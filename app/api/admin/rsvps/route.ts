import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getDb, type RsvpRow } from "../../../lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sha = (s: string) => createHash("sha256").update(s).digest();

/** Token via `Authorization: Bearer <token>`, `x-admin-token` header or `?token=`. */
function authorized(req: NextRequest): "ok" | "unconfigured" | "denied" {
  const expected = process.env.ADMIN_TOKEN || "thangdevalone";
  const header = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const given = header || req.headers.get("x-admin-token") || req.nextUrl.searchParams.get("token") || "";
  return timingSafeEqual(sha(given), sha(expected)) ? "ok" : "denied";
}

function deny(state: "unconfigured" | "denied") {
  return NextResponse.json(
    { ok: false, error: state === "unconfigured" ? "ADMIN_TOKEN is not configured" : "unauthorized" },
    { status: state === "unconfigured" ? 503 : 401 }
  );
}

function csvCell(value: string | number): string {
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // neutralise spreadsheet formulas
  return `"${s.replace(/"/g, '""')}"`;
}

/** GET /api/admin/rsvps?token=...            -> JSON (all RSVPs + summary)
 *  GET /api/admin/rsvps?token=...&format=csv -> CSV download (opens in Excel/Sheets) */
export async function GET(req: NextRequest) {
  const auth = authorized(req);
  if (auth !== "ok") return deny(auth);

  const rows = getDb().prepare("SELECT * FROM rsvps ORDER BY id DESC").all() as RsvpRow[];

  if (req.nextUrl.searchParams.get("format") === "csv") {
    const header = ["ID", "Thời gian (UTC)", "Tên", "Lời chúc", "Xác nhận", "Đi cùng", "Khách của", "Link mời"];
    const lines = [header.map(csvCell).join(",")];
    for (const r of rows) {
      lines.push(
        [r.id, r.created_at, r.name, r.message, r.attendance, r.companions, r.side, r.invite]
          .map(csvCell)
          .join(",")
      );
    }
    return new NextResponse("\uFEFF" + lines.join("\r\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="rsvps.csv"',
        "Cache-Control": "no-store",
      },
    });
  }

  const summary = {
    total: rows.length,
    attending: rows.filter((r) => r.attendance === "Tôi sẽ tham dự").length,
    declined: rows.filter((r) => r.attendance === "Xin lỗi, tôi không thể tham dự").length,
    noAnswer: rows.filter((r) => !r.attendance).length,
  };
  return NextResponse.json({ ok: true, summary, rsvps: rows }, { headers: { "Cache-Control": "no-store" } });
}

/** DELETE /api/admin/rsvps?token=...&id=12 — remove an entry (e.g. spam). */
export async function DELETE(req: NextRequest) {
  const auth = authorized(req);
  if (auth !== "ok") return deny(auth);

  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }
  const info = getDb().prepare("DELETE FROM rsvps WHERE id = ?").run(id);
  return NextResponse.json({ ok: info.changes > 0 });
}
