import fs from "node:fs";
import { getDataFilePath, type RsvpRow } from "./db";
import { checkContent, removeProfanity } from "./profanity";

/**
 * Runs once per server start (see /instrumentation.ts): takes the swear words out of the
 * wishes saved before the filter knew them ("Anh Trung chó" -> "Anh Trung").
 *
 * Safe to run again: nothing is written when nothing changes, and the untouched file is
 * copied next to it before every rewrite. A text that would end up empty is left as is;
 * the public page already hides it and the dashboard can delete it.
 */
export function cleanStoredWishes(): number {
  const file = getDataFilePath();
  if (!fs.existsSync(/*turbopackIgnore: true*/ file)) return 0;

  const rows: RsvpRow[] = JSON.parse(fs.readFileSync(file, "utf-8"));
  if (!Array.isArray(rows)) return 0;

  let changed = 0;
  const cleaned = rows.map((row) => {
    const next = { ...row };
    for (const field of ["name", "message"] as const) {
      const text = String(row[field] ?? "");
      if (checkContent(text) !== "profanity") continue;
      const kept = removeProfanity(text);
      if (/[\p{L}\p{N}\p{Extended_Pictographic}]/u.test(kept)) next[field] = kept;
    }
    if (next.name === row.name && next.message === row.message) return row;
    changed++;
    return next;
  });
  if (changed === 0) return 0;

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.copyFileSync(file, file.replace(/\.json$/, `.backup-${stamp}.json`), fs.constants.COPYFILE_EXCL);

  const temp = `${file}.${stamp}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(cleaned, null, 2), "utf-8");
  fs.renameSync(temp, file);
  return changed;
}
