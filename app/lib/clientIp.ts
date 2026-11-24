import { BlockList, isIP } from "node:net";
import type { NextRequest } from "next/server";

/** Visitor IP could not be determined (dev, or proxy headers missing). */
export const UNKNOWN_IP = "local";

const trustedProxies = new BlockList();

for (const [net, bits] of [
  // https://www.cloudflare.com/ips/
  ["173.245.48.0", 20], ["103.21.244.0", 22], ["103.22.200.0", 22], ["103.31.4.0", 22],
  ["141.101.64.0", 18], ["108.162.192.0", 18], ["190.93.240.0", 20], ["188.114.96.0", 20],
  ["197.234.240.0", 22], ["198.41.128.0", 17], ["162.158.0.0", 15], ["104.16.0.0", 13],
  ["104.24.0.0", 14], ["172.64.0.0", 13], ["131.0.72.0", 22],
  // loopback / private (cloudflared, docker bridge)
  ["127.0.0.0", 8], ["10.0.0.0", 8], ["172.16.0.0", 12], ["192.168.0.0", 16],
] as const) {
  trustedProxies.addSubnet(net, bits, "ipv4");
}

for (const [net, bits] of [
  ["2400:cb00::", 32], ["2606:4700::", 32], ["2803:f800::", 32], ["2405:b500::", 32],
  ["2405:8100::", 32], ["2a06:98c0::", 29], ["2c0f:f248::", 32],
  ["::1", 128], ["fc00::", 7],
] as const) {
  trustedProxies.addSubnet(net, bits, "ipv6");
}

function parseIp(raw: string | null | undefined): string | null {
  const ip = (raw ?? "").trim().replace(/^::ffff:(?=\d+\.)/i, "");
  return isIP(ip) ? ip : null;
}

function isTrustedProxy(ip: string): boolean {
  return trustedProxies.check(ip, isIP(ip) === 6 ? "ipv6" : "ipv4");
}

/** One visitor owns a whole IPv6 /64, so limits and bans use the /64 prefix. */
export function ipKey(raw: string): string | null {
  const ip = parseIp(raw.trim().replace(/\/64$/, ""));
  if (!ip) return null;
  if (isIP(ip) === 4) return ip;

  const [head, tail] = ip.toLowerCase().split("::");
  const left = head ? head.split(":") : [];
  const right = tail ? tail.split(":") : [];
  const groups =
    tail === undefined
      ? left
      : [...left, ...Array<string>(Math.max(0, 8 - left.length - right.length)).fill("0"), ...right];
  const prefix = groups.slice(0, 4).map((g) => parseInt(g, 16).toString(16));
  return `${prefix.join(":")}::/64`;
}

/**
 * Visitor IP behind Cloudflare -> nginx -> Next.js.
 *
 * X-Forwarded-For is never trusted from the left: anyone can send their own value and
 * every proxy only appends to it. CF-Connecting-IP is used only when the peer nginx saw
 * (X-Real-IP) really is Cloudflare or a local tunnel.
 */
export function clientIpKey(req: NextRequest): string {
  const peer = parseIp(req.headers.get("x-real-ip"));
  const cf = parseIp(req.headers.get("cf-connecting-ip"));
  // without X-Real-IP, the last X-Forwarded-For hop is the one our own proxy added
  const lastHop = parseIp(req.headers.get("x-forwarded-for")?.split(",").pop());

  const direct = peer ?? lastHop;
  const ip = direct && !isTrustedProxy(direct) ? direct : (cf ?? direct);
  // never key on a proxy: banning it would ban every guest
  return (ip && !isTrustedProxy(ip) && ipKey(ip)) || UNKNOWN_IP;
}
