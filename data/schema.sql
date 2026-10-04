-- Wedding RSVP & Wishes Database Schema
-- Database engine: SQLite 3 (stored at ./data/wedding.db)

CREATE TABLE IF NOT EXISTS rsvps (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  message     TEXT NOT NULL DEFAULT '',
  attendance  TEXT NOT NULL DEFAULT '',
  companions  TEXT NOT NULL DEFAULT '',
  side        TEXT NOT NULL DEFAULT '',
  invite      TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Index for fast ordering of guestbook wishes
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps (created_at DESC);
