import { NextResponse, type NextRequest } from "next/server";
import { getDb, type RsvpRow } from "../../lib/db";
import {
  ATTENDANCE_OPTIONS,
  SIDE_OPTIONS,
  cleanInviteName,
  cleanText,
} from "../../lib/sanitize";
import { checkContent } from "../../lib/profanity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---- tiny in-memory rate limit: 5 submissions / 10 minutes / IP ------------
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = (globalThis as unknown as { __rsvpHits?: Map<string, number[]> });
hits.__rsvpHits ??= new Map();

function rateLimited(ip: string): boolean {
  const map = hits.__rsvpHits!;
  const now = Date.now();
  const recent = (map.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    map.set(ip, recent);
    return true;
  }
  recent.push(now);
  map.set(ip, recent);
  if (map.size > 5000) map.clear();
  return false;
}

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

/** POST /api/rsvp — save one RSVP / wish. */
export async function POST(req: NextRequest) {
  // Same-origin only (browsers always send Origin on cross-site POST)
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get("host")) return fail("forbidden", 403);
    } catch {
      return fail("forbidden", 403);
    }
  }

  if (Number(req.headers.get("content-length") ?? 0) > 20_000) return fail("payload_too_large", 413);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("invalid_json", 400);
  }

  // Honeypot: real users never fill this hidden field, bots do.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = cleanText(body.name, 60);
  const message = cleanText(body.message, 500, true);
  const attendanceRaw = cleanText(body.attendance, 60);
  const sideRaw = cleanText(body.side, 60);
  const companions = cleanText(body.companions, 120);
  const invite = cleanInviteName(body.invite);

  if (!name) return fail("name_required", 400);

  // Block swearing / spam links in anything that can be shown publicly
  if ([name, message, companions].some((t) => checkContent(t))) return fail("inappropriate", 422);

  const attendance = (ATTENDANCE_OPTIONS as readonly string[]).includes(attendanceRaw) ? attendanceRaw : "";
  const side = (SIDE_OPTIONS as readonly string[]).includes(sideRaw) ? sideRaw : "";

  if (rateLimited(clientIp(req))) return fail("too_many_requests", 429);

  const info = getDb()
    .prepare(
      `INSERT INTO rsvps (name, message, attendance, companions, side, invite)
       VALUES (@name, @message, @attendance, @companions, @side, @invite)`
    )
    .run({ name, message, attendance, companions, side, invite });

  const newId = Number(info.lastInsertRowid);
  const wish = message
    ? {
        id: newId,
        name,
        message,
        createdAt: new Date().toISOString(),
      }
    : null;

  return NextResponse.json({ ok: true, id: newId, wish }, { status: 201 });
}

/** GET /api/rsvp — public list of wishes (only name + message) for the scrolling board. */
export async function GET() {
  const rows = getDb()
    .prepare(
      `SELECT id, name, message, created_at FROM rsvps
       WHERE message <> '' ORDER BY id DESC LIMIT 60`
    )
    .all() as Pick<RsvpRow, "id" | "name" | "message" | "created_at">[];

  // safety net: never show anything the filter rejects (older rows, manual edits)
  const clean = rows.filter((r) => !checkContent(r.name) && !checkContent(r.message));

  return NextResponse.json(
    {
      wishes: clean.map((r) => ({ id: r.id, name: r.name, message: r.message, createdAt: r.created_at })),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

