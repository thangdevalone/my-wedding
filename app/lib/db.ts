import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

/**
 * SQLite database (single file, no external service needed).
 * Location: ./data/wedding.db (override the folder with DATABASE_DIR).
 */
const globalForDb = globalThis as unknown as { __weddingDb?: Database.Database };

export function getDb(): Database.Database {
  if (!globalForDb.__weddingDb) {
    const dir = process.env.DATABASE_DIR || path.join(process.cwd(), "data");
    fs.mkdirSync(dir, { recursive: true });

    const db = new Database(path.join(dir, "wedding.db"), { timeout: 5000 });
    try {
      db.pragma("journal_mode = DELETE");
    } catch {
      // fallback safe
    }
    db.exec(`
      CREATE TABLE IF NOT EXISTS rsvps (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT NOT NULL,
        message     TEXT NOT NULL DEFAULT '',
        attendance  TEXT NOT NULL DEFAULT '',
        companions  TEXT NOT NULL DEFAULT '',
        side        TEXT NOT NULL DEFAULT '',
        invite      TEXT NOT NULL DEFAULT '',
        created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      );
      CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps (created_at DESC);
    `);
    globalForDb.__weddingDb = db;
  }
  return globalForDb.__weddingDb;
}

export type RsvpRow = {
  id: number;
  name: string;
  message: string;
  attendance: string;
  companions: string;
  side: string;
  invite: string;
  created_at: string;
};

export type WishItem = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

export function getPublicWishes(limit = 60): WishItem[] {
  try {
    const rows = getDb()
      .prepare(
        `SELECT id, name, message, created_at FROM rsvps
         WHERE message <> '' ORDER BY id DESC LIMIT ?`
      )
      .all(limit) as Pick<RsvpRow, "id" | "name" | "message" | "created_at">[];

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      message: r.message,
      createdAt: r.created_at,
    }));
  } catch (err) {
    console.error("Error reading wishes from SQLite:", err);
    return [];
  }
}

