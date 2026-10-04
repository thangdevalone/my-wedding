/** Shared input cleaning for the invite name and RSVP form. */

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function cleanText(value: unknown, max: number, multiline = false): string {
  if (typeof value !== "string") return "";
  let v = value.replace(CONTROL_CHARS, "").normalize("NFC");
  v = multiline
    ? v.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]+/g, " ")
    : v.replace(/\s+/g, " ");
  return v.trim().slice(0, max);
}

/** Name coming from ?invite=... — plain text only, short. */
export function cleanInviteName(value: unknown): string {
  return cleanText(value, 40).replace(/[<>]/g, "");
}

export const ATTENDANCE_OPTIONS = ["Tôi sẽ tham dự", "Xin lỗi, tôi không thể tham dự"] as const;
export const SIDE_OPTIONS = ["Khách mời cô dâu", "Khách mời chú rể"] as const;
