import fs from "node:fs";
import path from "node:path";

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

/**
 * Pure JSON-based atomic database.
 * Stored at: ./data/wedding.json (configured via DATABASE_DIR).
 * 100% pure JavaScript, zero native dependencies, zero Segmentation faults in Next.js Server Components.
 */
function getDataFilePath(): string {
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

    return rows.map((r) => ({
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
