import { NextResponse, type NextRequest } from "next/server";
import { authenticate } from "../../lib/dashboardAuth";
import { ipKey } from "../../lib/clientIp";
import { cleanText } from "../../lib/sanitize";
import { blockIp, listBlocked, unblockIp } from "../../lib/spamGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });
const done = () =>
  NextResponse.json({ ok: true, blocked: listBlocked() }, { headers: { "Cache-Control": "no-store" } });

/** Dashboard only: list / block / unblock the IPs that may not send wishes. */
export async function GET(req: NextRequest) {
  const auth = authenticate(req);
  if (!auth.ok) return fail(auth.error, 401);
  return done();
}

export async function POST(req: NextRequest) {
  const auth = authenticate(req);
  if (!auth.ok) return fail(auth.error, 401);

  let body: Record<string, unknown> | null;
  try {
    body = await req.json();
  } catch {
    return fail("Dữ liệu không hợp lệ", 400);
  }

  const ip = ipKey(String(body?.ip ?? ""));
  if (!ip) return fail("Địa chỉ IP không hợp lệ", 400);

  const hours = body?.hours == null ? null : Number(body.hours);
  if (hours !== null && !(hours > 0 && hours <= 24 * 365)) return fail("Thời gian chặn không hợp lệ", 400);

  blockIp(ip, hours, cleanText(body?.reason, 120) || "Chặn từ dashboard", "manual");
  return done();
}

export async function DELETE(req: NextRequest) {
  const auth = authenticate(req);
  if (!auth.ok) return fail(auth.error, 401);

  const ip = ipKey(req.nextUrl.searchParams.get("ip") ?? "");
  if (!ip || !unblockIp(ip)) return fail("IP này không bị chặn", 404);
  return done();
}
