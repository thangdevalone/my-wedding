/** Called once when the Next.js server starts, before it accepts requests. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  try {
    const { cleanStoredWishes } = await import("./app/lib/migrations");
    const changed = cleanStoredWishes();
    if (changed > 0) console.log(`[migrate] removed swear words from ${changed} wish(es)`);
  } catch (err) {
    // the invitation must come up even if the clean-up fails
    console.error("[migrate] wishes not cleaned:", err);
  }
}
