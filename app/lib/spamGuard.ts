import { createHash } from "node:crypto";
import { UNKNOWN_IP } from "./clientIp";
import { loadBlockedIps, saveBlockedIps, type BlockedIp } from "./db";

/**
 * Anti-spam for the guest book: rate limits, strikes and IP bans.
 *
 * Guests often share one IP (wedding wifi, mobile carrier NAT), so the strict limit is per
 * device (IP + User-Agent) and the per-IP one is wider. Automatic bans are always temporary;
 * only a ban made from the dashboard can be permanent.
 */
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const DEVICE_LIMITS = [{ windowMs: 10 * MIN, max: 4 }, { windowMs: DAY, max: 15 }];
const IP_LIMITS = [{ windowMs: 10 * MIN, max: 15 }, { windowMs: DAY, max: 100 }];
const GLOBAL_LIMITS = [{ windowMs: 10 * MIN, max: 120 }];
const SAME_TEXT_PER_DEVICE = 2; // per hour

const STRIKE_WINDOW = 30 * MIN;
const STRIKE_LIMIT = 10;
const STRIKES = { honeypot: 5, inappropriate: 2, spam: 2, duplicate: 1, too_many_requests: 1 } as const;
export type Strike = keyof typeof STRIKES;

const BAN_STEPS = [HOUR, DAY, 7 * DAY];
const OFFENCE_MEMORY = 7 * DAY;

const MAX_KEYS = 5000;

type Timed = { t: number; v: string | number };
type Store = { hits: Map<string, Timed[]>; strikes: Map<string, Timed[]>; texts: Map<string, Timed[]> };
const g = globalThis as unknown as { __spamGuard?: Store };
g.__spamGuard ??= { hits: new Map(), strikes: new Map(), texts: new Map() };
const store = g.__spamGuard;

function recent(map: Map<string, Timed[]>, key: string, windowMs: number): Timed[] {
  const now = Date.now();
  return (map.get(key) ?? []).filter((e) => now - e.t < windowMs);
}

function push(map: Map<string, Timed[]>, key: string, windowMs: number, v: string | number) {
  const list = recent(map, key, windowMs);
  list.push({ t: Date.now(), v });
  map.delete(key); // re-insert so the Map stays ordered by last use
  map.set(key, list);
  // full: drop the least recently used key instead of forgetting everybody
  while (map.size > MAX_KEYS) map.delete(map.keys().next().value as string);
}

export function deviceKey(ip: string, userAgent: string | null): string {
  return `${ip}|${createHash("sha256").update(userAgent ?? "").digest("hex").slice(0, 16)}`;
}

/** Comparable form of a text: no case, accents, punctuation, spaces or stretched letters. */
export function fingerprint(text: string): string {
  const flat = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .replace(/(\p{L})\1{2,}/gu, "$1");
  return flat || text.replace(/\s+/g, ""); // emoji-only wishes
}

// ---- rate limits -------------------------------------------------------------

/** Seconds to wait, or 0 when the visitor may post. */
export function retryAfter(ip: string, device: string): number {
  const now = Date.now();
  let wait = 0;
  for (const [key, limits] of [[device, DEVICE_LIMITS], [ip, IP_LIMITS], ["*", GLOBAL_LIMITS]] as const) {
    if (key === UNKNOWN_IP) continue; // shared by everybody
    for (const { windowMs, max } of limits) {
      const list = recent(store.hits, key, windowMs);
      if (list.length >= max) wait = Math.max(wait, list[list.length - max].t + windowMs - now);
    }
  }
  return Math.ceil(wait / 1000);
}

export function repeatsText(device: string, message: string): boolean {
  const fp = fingerprint(message);
  return recent(store.texts, device, HOUR).filter((e) => e.v === fp).length >= SAME_TEXT_PER_DEVICE;
}

export function recordAccepted(ip: string, device: string, message: string) {
  push(store.hits, device, DAY, 1);
  push(store.hits, ip, DAY, 1);
  push(store.hits, "*", 10 * MIN, 1);
  push(store.texts, device, HOUR, fingerprint(message));
}

// ---- strikes & bans ----------------------------------------------------------

const isActive = (b: BlockedIp) => !b.expiresAt || Date.parse(b.expiresAt) > Date.now();

export function listBlocked(): BlockedIp[] {
  return loadBlockedIps()
    .filter(isActive)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function isBlocked(ip: string): boolean {
  return loadBlockedIps().some((b) => b.ip === ip && isActive(b));
}

/** hours = null means until somebody unblocks it. */
export function blockIp(ip: string, hours: number | null, reason: string, source: BlockedIp["source"]) {
  const now = Date.now();
  const entries = loadBlockedIps();
  const previous = entries.find((b) => b.ip === ip);
  // expired bans are kept for a week so repeat offenders get a longer one
  const kept = entries.filter(
    (b) => b.ip !== ip && (!b.expiresAt || Date.parse(b.expiresAt) > now - OFFENCE_MEMORY)
  );
  kept.push({
    ip,
    reason,
    source,
    offences: (previous?.offences ?? 0) + (source === "auto" ? 1 : 0),
    createdAt: new Date(now).toISOString(),
    expiresAt: hours === null ? null : new Date(now + hours * HOUR).toISOString(),
  });
  saveBlockedIps(kept);
}

export function unblockIp(ip: string): boolean {
  const entries = loadBlockedIps();
  const kept = entries.filter((b) => b.ip !== ip);
  if (kept.length === entries.length) return false;
  saveBlockedIps(kept);
  store.strikes.delete(ip);
  return true;
}

/** Count one abuse; returns true when it just got the IP banned. */
export function strike(ip: string, kind: Strike): boolean {
  if (ip === UNKNOWN_IP) return false;
  push(store.strikes, ip, STRIKE_WINDOW, STRIKES[kind]);
  const total = recent(store.strikes, ip, STRIKE_WINDOW).reduce((sum, e) => sum + Number(e.v), 0);
  if (total < STRIKE_LIMIT) return false;

  store.strikes.delete(ip);
  const since = Date.now() - OFFENCE_MEMORY;
  const past = loadBlockedIps().find((b) => b.ip === ip && b.expiresAt && Date.parse(b.expiresAt) > since);
  const step = BAN_STEPS[Math.min(past?.offences ?? 0, BAN_STEPS.length - 1)];
  blockIp(ip, step / HOUR, `Tự động: ${kind}`, "auto");
  return true;
}
