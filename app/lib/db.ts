import fs from "node:fs";
import path from "node:path";
import { checkContent } from "./profanity";

export type RsvpRow = {
  id: number;
  name: string;
  message: string;
  attendance: string;
  companions: string;
  side: string;
  invite: string;
  created_at: string;
  /** dashboard only (to block spammers), never sent to the public page */
  ip?: string;
};

export type BlockedIp = {
  ip: string;
  reason: string;
  source: "auto" | "manual";
  offences: number;
  createdAt: string;
  /** null = until unblocked */
  expiresAt: string | null;
};

export type WishItem = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

export type GuestItem = {
  id: number;
  name: string;
  phone: string;
  category: string;
  relationship: string;
  priority: string;
  giftAmount: string;
  returnGift: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type GuestOwner = "codau" | "chure";

/**
 * Pure JSON-based atomic database.
 * Stored at: ./data/wedding.json (configured via DATABASE_DIR).
 * 100% pure JavaScript, zero native dependencies, zero Segmentation faults in Next.js Server Components.
 */
export function getDataFilePath(): string {
  const dir = process.env.DATABASE_DIR || path.join(process.cwd(), "data");
  if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // ignore
    }
  }
  return path.join(dir, "wedding.json");
}

function loadRows(): RsvpRow[] {
  const file = getDataFilePath();
  if (!fs.existsSync(/*turbopackIgnore: true*/ file)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(file, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error reading wedding.json:", err);
    return [];
  }
}

function saveRows(rows: RsvpRow[]): void {
  const file = getDataFilePath();
  const dir = path.dirname(file);
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempFile = `${file}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(rows, null, 2), "utf-8");
    fs.renameSync(tempFile, file);
  } catch (err) {
    console.error("Error saving wedding.json:", err);
  }
}

/**
 * Compatibility getDb() provider matching existing query patterns.
 */
export function getDb() {
  return {
    prepare(sql: string) {
      const lower = sql.toLowerCase();

      return {
        all(...args: unknown[]): RsvpRow[] | Pick<RsvpRow, "id" | "name" | "message" | "created_at">[] {
          const rows = loadRows();

          // Pattern: SELECT id, name, message, created_at FROM rsvps WHERE message <> '' ORDER BY id DESC LIMIT ?
          if (lower.includes("where message <> ''")) {
            const limit = typeof args[0] === "number" ? args[0] : 60;
            return rows
              .filter((r) => r.message && r.message.trim() !== "")
              .sort((a, b) => b.id - a.id)
              .slice(0, limit)
              .map((r) => ({
                id: r.id,
                name: r.name,
                message: r.message,
                created_at: r.created_at,
              }));
          }

          // Pattern: SELECT * FROM rsvps ORDER BY id DESC
          return rows.sort((a, b) => b.id - a.id);
        },

        run(params?: Record<string, unknown> | number | string) {
          const rows = loadRows();

          // Pattern: DELETE FROM rsvps WHERE id = ?
          if (lower.startsWith("delete")) {
            const idToDelete = Number(params);
            const initialCount = rows.length;
            const updated = rows.filter((r) => r.id !== idToDelete);
            saveRows(updated);
            return { changes: initialCount - updated.length };
          }

          // Pattern: INSERT INTO rsvps (...)
          if (lower.startsWith("insert")) {
            const p = (params || {}) as Record<string, unknown>;
            const nextId = rows.reduce((max, r) => Math.max(max, r.id || 0), 0) + 1;
            const newRow: RsvpRow = {
              id: nextId,
              name: String(p.name || ""),
              message: String(p.message || ""),
              attendance: String(p.attendance || ""),
              companions: String(p.companions || ""),
              side: String(p.side || ""),
              invite: String(p.invite || ""),
              created_at: new Date().toISOString(),
              ...(p.ip ? { ip: String(p.ip) } : {}),
            };

            rows.push(newRow);
            saveRows(rows);
            return { lastInsertRowid: nextId, changes: 1 };
          }

          return { lastInsertRowid: 0, changes: 0 };
        },
      };
    },
  };
}

export function getPublicWishes(limit = 60): WishItem[] {
  try {
    const rows = getDb()
      .prepare(
        `SELECT id, name, message, created_at FROM rsvps
         WHERE message <> '' ORDER BY id DESC LIMIT ?`
      )
      .all(limit) as Pick<RsvpRow, "id" | "name" | "message" | "created_at">[];

    // same safety net as GET /api/rsvp
    const clean = rows.filter((r) => !checkContent(r.name) && !checkContent(r.message));
    return clean.map((r) => ({
      id: r.id,
      name: r.name,
      message: r.message,
      createdAt: r.created_at,
    }));
  } catch (err) {
    console.error("Error reading wishes:", err);
    return [];
  }
}

function getGuestsFilePath(owner: GuestOwner): string {
  const dir = process.env.DATABASE_DIR || path.join(process.cwd(), "data");
  if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // ignore
    }
  }
  const safeOwner = owner === "codau" ? "codau" : "chure";
  return path.join(dir, `guests_${safeOwner}.json`);
}

export function loadGuests(owner: GuestOwner): GuestItem[] {
  const file = getGuestsFilePath(owner);
  if (!fs.existsSync(/*turbopackIgnore: true*/ file)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(file, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(`Error reading guests_${owner}.json:`, err);
    return [];
  }
}

export function saveGuests(owner: GuestOwner, guests: GuestItem[]): void {
  const file = getGuestsFilePath(owner);
  const dir = path.dirname(file);
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempFile = `${file}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(guests, null, 2), "utf-8");
    fs.renameSync(tempFile, file);
  } catch (err) {
    console.error(`Error saving guests_${owner}.json:`, err);
  }
}

function getBlockedIpsFilePath(): string {
  return path.join(process.env.DATABASE_DIR || path.join(process.cwd(), "data"), "blocked_ips.json");
}

export function loadBlockedIps(): BlockedIp[] {
  const file = getBlockedIpsFilePath();
  if (!fs.existsSync(/*turbopackIgnore: true*/ file)) {
    return [];
  }
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error reading blocked_ips.json:", err);
    return [];
  }
}

export function saveBlockedIps(entries: BlockedIp[]): void {
  const file = getBlockedIpsFilePath();
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const tempFile = `${file}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(entries, null, 2), "utf-8");
    fs.renameSync(tempFile, file);
  } catch (err) {
    console.error("Error saving blocked_ips.json:", err);
  }
}
