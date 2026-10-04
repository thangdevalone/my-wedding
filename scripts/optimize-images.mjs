// Shrinks any oversized photo in public/images to a web-friendly size.
// - Originals are copied once to ../originals (never overwritten) before being replaced.
// - Max width 1200px (the widest frame on the page is ~422 CSS px, so this is ~2.8x for retina).
// Usage: node scripts/optimize-images.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("public/images");
const originalsDir = path.resolve("..", "originals");
const MAX_WIDTH = 1200;
fs.mkdirSync(originalsDir, { recursive: true });

for (const file of fs.readdirSync(dir).filter((f) => /^photo-.*\.jpe?g$/i.test(f))) {
  const src = path.join(dir, file);
  const meta = await sharp(src, { limitInputPixels: false }).metadata();
  if (meta.width <= MAX_WIDTH) continue; // already small enough

  const backup = path.join(originalsDir, file);
  if (!fs.existsSync(backup)) fs.copyFileSync(src, backup);

  const before = fs.statSync(src).size;
  const out = await sharp(backup, { limitInputPixels: false })
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  fs.writeFileSync(src, out.data);
  console.log(
    `${file}: ${meta.width}x${meta.height} ${(before / 1024).toFixed(0)} KB -> ${out.info.width}x${out.info.height} ${(out.data.length / 1024).toFixed(0)} KB`
  );
}
