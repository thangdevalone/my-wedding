import { NextResponse, type NextRequest } from "next/server";
import { loadGuests, saveGuests, type GuestItem, type GuestOwner } from "../../lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_PASSWORD = process.env.GUEST_PASSWORD || "28112026";

function normalizeOwner(raw: unknown): GuestOwner | null {
  const s = String(raw ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, "");

  if (s === "codau" || s === "bride" || s === "nhagai") return "codau";
  if (s === "chure" || s === "groom" || s === "nhatrai") return "chure";
  return null;
}

function authenticate(req: NextRequest, body?: Record<string, unknown>): { ok: true; owner: GuestOwner } | { ok: false; error: string } {
  const rawUser =
    req.headers.get("x-guest-user") ||
    req.nextUrl.searchParams.get("user") ||
    (body && typeof body.user === "string" ? body.user : "");

  const rawPass =
    req.headers.get("x-guest-pass") ||
    req.nextUrl.searchParams.get("password") ||
    (body && typeof body.password === "string" ? body.password : "");

  const owner = normalizeOwner(rawUser);
  if (!owner) {
    return { ok: false, error: "Tài khoản không hợp lệ (Chỉ chấp nhận: codau hoặc chure)" };
  }

  if (rawPass.trim() !== VALID_PASSWORD) {
    return { ok: false, error: "Mật khẩu không chính xác!" };
  }

  return { ok: true, owner };
}

function csvCell(value: string | number): string {
  let s = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}

/** GET /api/guests?user=codau&password=28112026(&format=csv) */
export async function GET(req: NextRequest) {
  const auth = authenticate(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });
  }

  const guests = loadGuests(auth.owner).sort((a, b) => b.id - a.id);

  if (req.nextUrl.searchParams.get("format") === "csv") {
    const header = [
      "ID",
      "Họ và Tên",
      "Số điện thoại",
      "Danh mục",
      "Mối quan hệ",
      "Độ ưu tiên",
      "Tiền mừng / Phong bì",
      "Đi lại / Đáp lễ",
      "Ghi chú",
      "Cập nhật lúc",
    ];
    const lines = [header.map(csvCell).join(",")];
    for (const g of guests) {
      lines.push(
        [
          g.id,
          g.name,
          g.phone,
          g.category,
          g.relationship,
          g.priority,
          g.giftAmount,
          g.returnGift,
          g.notes,
          g.updatedAt || g.createdAt,
        ]
          .map(csvCell)
          .join(",")
      );
    }
    return new NextResponse("\uFEFF" + lines.join("\r\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="danh-sach-khach-${auth.owner}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.json(
    { ok: true, owner: auth.owner, guests },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/** POST /api/guests — Add a new guest */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const auth = authenticate(req, body);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });
  }

  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ ok: false, error: "Vui lòng nhập tên khách mời!" }, { status: 400 });
  }

  const guests = loadGuests(auth.owner);
  const nextId = guests.reduce((max, g) => Math.max(max, g.id || 0), 0) + 1;
  const now = new Date().toISOString();

  const newGuest: GuestItem = {
    id: nextId,
    name,
    phone: String(body.phone ?? "").trim(),
    category: String(body.category ?? "Bạn đại học").trim(),
    relationship: String(body.relationship ?? "Thân thiết").trim(),
    priority: String(body.priority ?? "Ưu tiên 1 (Chắc chắn mời)").trim(),
    giftAmount: String(body.giftAmount ?? "").trim(),
    returnGift: String(body.returnGift ?? "Chưa đi lại").trim(),
    notes: String(body.notes ?? "").trim(),
    createdAt: now,
    updatedAt: now,
  };

  guests.push(newGuest);
  saveGuests(auth.owner, guests);

  return NextResponse.json({ ok: true, guest: newGuest }, { status: 201 });
}

/** PUT /api/guests — Update an existing guest */
export async function PUT(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const auth = authenticate(req, body);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });
  }

  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ ok: false, error: "ID khách mời không hợp lệ" }, { status: 400 });
  }

  const guests = loadGuests(auth.owner);
  const idx = guests.findIndex((g) => g.id === id);
  if (idx === -1) {
    return NextResponse.json({ ok: false, error: "Không tìm thấy khách mời" }, { status: 404 });
  }

  const existing = guests[idx];
  const updatedName = body.name !== undefined ? String(body.name).trim() : existing.name;
  if (!updatedName) {
    return NextResponse.json({ ok: false, error: "Tên khách mời không được để trống!" }, { status: 400 });
  }

  const updatedGuest: GuestItem = {
    ...existing,
    name: updatedName,
    phone: body.phone !== undefined ? String(body.phone).trim() : existing.phone,
    category: body.category !== undefined ? String(body.category).trim() : existing.category,
    relationship: body.relationship !== undefined ? String(body.relationship).trim() : existing.relationship,
    priority: body.priority !== undefined ? String(body.priority).trim() : existing.priority,
    giftAmount: body.giftAmount !== undefined ? String(body.giftAmount).trim() : existing.giftAmount,
    returnGift: body.returnGift !== undefined ? String(body.returnGift).trim() : existing.returnGift,
    notes: body.notes !== undefined ? String(body.notes).trim() : existing.notes,
    updatedAt: new Date().toISOString(),
  };

  guests[idx] = updatedGuest;
  saveGuests(auth.owner, guests);

  return NextResponse.json({ ok: true, guest: updatedGuest });
}

/** DELETE /api/guests?id=123 */
export async function DELETE(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    // allow query params
  }

  const auth = authenticate(req, body);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });
  }

  const id = Number(req.nextUrl.searchParams.get("id") || body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ ok: false, error: "ID không hợp lệ" }, { status: 400 });
  }

  const guests = loadGuests(auth.owner);
  const filtered = guests.filter((g) => g.id !== id);
  if (filtered.length === guests.length) {
    return NextResponse.json({ ok: false, error: "Không tìm thấy khách mời để xóa" }, { status: 404 });
  }

  saveGuests(auth.owner, filtered);
  return NextResponse.json({ ok: true });
}

