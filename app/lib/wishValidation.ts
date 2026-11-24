import { cleanText } from "./sanitize";
import { checkContent } from "./profanity";

export const NAME_MAX = 60;
export const MESSAGE_MAX = 500;

export type WishError =
  | "name_required"
  | "name_invalid"
  | "name_too_long"
  | "message_required"
  | "message_invalid"
  | "message_too_long"
  | "inappropriate"
  | "spam";

type Result = { ok: true; name: string; message: string } | { ok: false; error: WishError };

const AD_PHRASES = [
  "nhà cái", "cá độ", "soi kèo", "nổ hũ", "tài xỉu", "lô đề", "casino", "vay tiền nhanh", "vay online",
  "vay tín chấp", "kiếm tiền online", "việc nhẹ lương cao", "telegram", "bitcoin", "crypto", "forex",
  "viagra", "backlink", "gái gọi",
];

// 0912 345 678 / +84.912.345.678 — "999999999 năm hạnh phúc" is not a phone number
const PHONE = /(?<!\d)(?:\+?84|0)(?:[\s.-]?\d){9}(?!\d)/;
const EMAIL = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;
const HTML_TAG = /<\/?[a-z!][^>]*>|javascript:|\[\/?url/i; // "<3" stays fine

function looksLikeSpam(text: string): boolean {
  if (HTML_TAG.test(text) || PHONE.test(text) || EMAIL.test(text)) return true;

  const flat = ` ${text.toLowerCase().normalize("NFC").replace(/[^\p{L}\p{N}]+/gu, " ").trim()} `;
  if (AD_PHRASES.some((p) => flat.includes(` ${p} `))) return true;

  if (/([\p{L}\p{N}])\1{29,}/u.test(text)) return true; // one key held down
  if (/\p{M}{4,}/u.test(text)) return true; // zalgo
  if (text.split("\n").length > 20) return true;

  const words = flat.trim().split(" ").filter(Boolean);
  if (words.some((w) => [...w.replace(/(.)\1{2,}/gu, "$1")].length > 40)) return true;
  return words.length >= 12 && new Set(words).size / words.length < 0.25;
}

/** Validate and clean what a guest typed. Nothing is cut silently: too long is an error. */
export function validateWish(rawName: unknown, rawMessage: unknown): Result {
  const name = cleanText(rawName, NAME_MAX + 1);
  const message = cleanText(rawMessage, MESSAGE_MAX + 1, true);

  if (!name) return { ok: false, error: "name_required" };
  if (name.length > NAME_MAX) return { ok: false, error: "name_too_long" };
  if (!/\p{L}/u.test(name)) return { ok: false, error: "name_invalid" };

  if (!message) return { ok: false, error: "message_required" };
  if (message.length > MESSAGE_MAX) return { ok: false, error: "message_too_long" };
  if (!/[\p{L}\p{N}\p{Extended_Pictographic}]/u.test(message)) return { ok: false, error: "message_invalid" };

  for (const text of [name, message]) {
    const reason = checkContent(text);
    if (reason === "profanity") return { ok: false, error: "inappropriate" };
    if (reason === "link" || looksLikeSpam(text)) return { ok: false, error: "spam" };
  }
  return { ok: true, name, message };
}
