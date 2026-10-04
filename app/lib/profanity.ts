/**
 * Lightweight content filter for the guest-book (wishes / names).
 * Blocks Vietnamese + English profanity (also typed without diacritics, with
 * stretched letters like "địttt", spaced / symbol evasion "đ.m", leet "d1t") and links.
 *
 * It is deliberately conservative: ambiguous Vietnamese words are only matched
 * WITH their diacritics (e.g. "lồn" is blocked, "lớn" / "lon" are fine; "đéo" is
 * blocked, "đeo nhẫn" / "dẻo" are fine) so normal wishes are never rejected.
 */

const stripMarks = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");

/** runs of 3+ identical letters -> 1 ("địttt" -> "địt") */
const squeezeLong = (s: string) => s.replace(/(.)\1{2,}/gu, "$1");
/** every run -> 1 ("dmm" -> "dm") */
const squeezeAll = (s: string) => s.replace(/(.)\1+/gu, "$1");

// --- diacritic-sensitive words (ambiguous when the marks are removed) ----------
const RAW_WORDS = [
  "đụ", "địt", "đéo", "đĩ", "đm", "đmm", "đcm", "đkm", "đcmm", "đjt",
  "lồn", "buồi", "cặc", "cứt", "ngu",
];

// --- safe to match after stripping marks (no everyday Vietnamese word collides) -
const ASCII_WORDS = [
  "dit", "ditme", "ditmemay", "dcm", "dcmm", "dkm", "dmm", "dm", "vcl", "vkl", "vl",
  "clm", "cmm", "cmn", "cc", "loz", "dcmn", "vcc",
  "fuck", "fucking", "fck", "fuk", "shit", "bitch", "cunt", "asshole", "dickhead",
  "pussy", "nigga", "nigger", "porn", "wtf", "stfu",
];

// substrings inside one (glued) token – long & unambiguous only
const SUBSTRINGS = ["ditme", "ditcon", "concac", "dcmm", "fuck", "shit", "bitch", "cunt", "nigger", "nigga", "asshole", "porn"];

// phrases / insults (checked on the lowercase text with diacritics)
const PHRASES = [
  "súc vật", "óc chó", "đồ chó", "thằng chó", "con đĩ", "mẹ mày", "khốn nạn",
  "đồ ngu", "chết mẹ", "mả mẹ", "thằng ngu", "con điên", "đồ điên", "đồ khùng",
];

const EXACT_RAW = new Set(RAW_WORDS.map((w) => squeezeLong(w)));
const LOOSE_RAW = new Set(RAW_WORDS.map(squeezeAll).filter((w) => [...w].length >= 2));
const EXACT_ASCII = new Set(ASCII_WORDS.map((w) => squeezeLong(w)));
const LOOSE_ASCII = new Set(ASCII_WORDS.map(squeezeAll).filter((w) => w.length >= 3));
// 2-letter slang is only matched when typed as-is (otherwise "dd" -> "d"… collisions)

const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "$": "s", "@": "a" };

function tokenize(text: string): string[] {
  // symbols that stand for letters become letters, everything else separates words
  const t = text.toLowerCase().normalize("NFC").replace(/[@$]/g, (c) => LEET[c]);
  return t
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .map((tok) =>
      // leet only inside words that mix letters and digits ("d1t"), never plain numbers
      /\p{L}/u.test(tok) && /\d/.test(tok) ? tok.replace(/[013457]/g, (c) => LEET[c] ?? c) : tok
    );
}

/** "đ . m", "d i t": single letters separated by spaces/dots are glued back together */
function glueSingles(tokens: string[]): string[] {
  const out: string[] = [];
  let run: string[] = [];
  const flush = () => {
    if (run.length >= 2) out.push(run.join(""));
    run = [];
  };
  for (const tok of tokens) {
    if ([...tok].length === 1 && /\p{L}/u.test(tok)) run.push(tok);
    else flush();
  }
  flush();
  return out;
}

export type BlockReason = "profanity" | "link";

export function checkContent(text: string): BlockReason | null {
  if (!text) return null;

  if (
    /(https?:\/\/|www\.)/i.test(text) ||
    /\b[a-z0-9-]{2,}\.(com|net|org|vn|xyz|info|top|ru|cn|io|ly|me|site|club|online|shop)\b/i.test(text)
  ) {
    return "link";
  }

  const lower = text.toLowerCase().normalize("NFC");
  const flat = lower.replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  if (PHRASES.some((p) => flat.includes(p))) return "profanity";

  const tokens = tokenize(text);
  const candidates = [...tokens, ...glueSingles(tokens)];

  for (const tok of candidates) {
    const raw = squeezeLong(tok);
    const ascii = squeezeLong(stripMarks(tok));
    if (EXACT_RAW.has(raw) || LOOSE_RAW.has(squeezeAll(tok))) return "profanity";
    if (EXACT_ASCII.has(ascii) || LOOSE_ASCII.has(squeezeAll(stripMarks(tok)))) return "profanity";
    if (ascii.length >= 4 && SUBSTRINGS.some((s) => ascii.includes(s))) return "profanity";
  }
  return null;
}
