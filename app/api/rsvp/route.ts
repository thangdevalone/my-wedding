import { NextResponse, type NextRequest } from "next/server";
import { getDb, type RsvpRow } from "../../lib/db";
import { cleanInviteName } from "../../lib/sanitize";
import { checkContent } from "../../lib/profanity";
import { clientIpKey } from "../../lib/clientIp";
import { validateWish } from "../../lib/wishValidation";
import {
  deviceKey,
  fingerprint,
  isBlocked,
  recordAccepted,
  repeatsText,
  retryAfter,
  strike,
  type Strike,
} from "../../lib/spamGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 20_000;
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

function fail(error: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ ok: false, error }, { status, headers });
}

/** Browsers always send Origin on a fetch POST; a request without it is a script. */
function sameOrigin(req: NextRequest): boolean {
  const source = req.headers.get("origin") ?? req.headers.get("referer");
  if (!source) return false;
  try {
    return new URL(source).host === req.headers.get("host");
  } catch {
    return false;
  }
}

/** POST /api/rsvp — save one RSVP / wish. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("forbidden", 403);

  const ip = clientIpKey(req);
  if (isBlocked(ip)) return fail("blocked", 403);

  const reject = (kind: Strike, status: number, headers?: HeadersInit) =>
    strike(ip, kind) ? fail("blocked", 403) : fail(kind, status, headers);

  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return fail("unsupported_media_type", 415);
  }
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return fail("payload_too_large", 413);

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) return fail("payload_too_large", 413);
    body = JSON.parse(raw);
  } catch {
    return fail("invalid_json", 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return fail("invalid_json", 400);

  // Honeypot: real users never fill this hidden field, bots do. Pretend it worked.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    strike(ip, "honeypot");
    return NextResponse.json({ ok: true });
  }

  const device = deviceKey(ip, req.headers.get("user-agent"));
  const wait = retryAfter(ip, device);
  if (wait > 0) return reject("too_many_requests", 429, { "Retry-After": String(wait) });

  const valid = validateWish(body.name, body.message);
  if (!valid.ok) {
    if (valid.error === "inappropriate" || valid.error === "spam") return reject(valid.error, 422);
    return fail(valid.error, 400);
  }
  const { name, message } = valid;
  const invite = cleanInviteName(body.invite);

  // Same person + same wish sent twice, or one device pasting the same text under many names
  const nameFp = fingerprint(name);
  const messageFp = fingerprint(message);
  const sentBefore = (getDb().prepare("SELECT * FROM rsvps ORDER BY id DESC").all() as RsvpRow[]).some(
    (r) =>
      Date.now() - Date.parse(r.created_at) < DUPLICATE_WINDOW_MS &&
      fingerprint(r.name) === nameFp &&
      fingerprint(r.message) === messageFp
  );
  if (sentBefore || repeatsText(device, message)) return reject("duplicate", 409);

  const info = getDb()
    .prepare(
      `INSERT INTO rsvps (name, message, attendance, companions, side, invite, ip)
       VALUES (@name, @message, '', '', '', @invite, @ip)`
    )
    .run({ name, message, invite, ip });
  recordAccepted(ip, device, message);

  const newId = Number(info.lastInsertRowid);
  const wish = {
    id: newId,
    name,
    message,
    createdAt: new Date().toISOString(),
  };

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

