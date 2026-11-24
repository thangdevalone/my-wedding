import type { NextRequest } from "next/server";
import type { GuestOwner } from "./db";

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

function getExpectedPassword(owner: GuestOwner): string {
  if (owner === "codau") {
    return process.env.CODAU_PASSWORD || process.env.DASHBOARD_PASSWORD || "";
  }
  return process.env.CHURE_PASSWORD || process.env.DASHBOARD_PASSWORD || "";
}

export function authenticate(req: NextRequest, body?: Record<string, unknown>): { ok: true; owner: GuestOwner } | { ok: false; error: string } {
  const rawUser =
    req.headers.get("x-dashboard-user") ||
    req.nextUrl.searchParams.get("user") ||
    (body && typeof body.user === "string" ? body.user : "");

  const rawPass =
    req.headers.get("x-dashboard-pass") ||
    req.nextUrl.searchParams.get("password") ||
    (body && typeof body.password === "string" ? body.password : "");

  const owner = normalizeOwner(rawUser);
  if (!owner) {
    return { ok: false, error: "Tài khoản không hợp lệ (Chỉ chấp nhận: codau hoặc chure)" };
  }

  const expectedPass = getExpectedPassword(owner);
  if (!expectedPass) {
    return { ok: false, error: "Chưa cấu hình mật khẩu (DASHBOARD_PASSWORD) trong file .env trên server!" };
  }

  if (rawPass.trim() !== expectedPass.trim()) {
    return { ok: false, error: "Mật khẩu không chính xác!" };
  }

  return { ok: true, owner };
}
