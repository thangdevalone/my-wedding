import fs from "fs";
import path from "path";
import sharp from "sharp";

/**
 * Generates the official OpenGraph image (1200x630) for Quang Thắng & Tường Lan wedding
 * - Sources: DSC_5122.jpg & DSC_5940.jpg from public/raw/
 * - Features: Full body uncropped, seamless center join, soft edge feathering into pure white,
 *             elegant typography ribbon at bottom with date 28.11.2026.
 * - Targets: public/images/og-share.jpg & app/opengraph-image.jpg
 */
async function generateOG() {
  const W = 1200;
  const H = 630;
  const photoW = 420;
  const edgeFeather = 25;

  const raw1 = "public/raw/DSC_5122.jpg";
  const raw2 = "public/raw/DSC_5940.jpg";

  if (!fs.existsSync(raw1) || !fs.existsSync(raw2)) {
    console.error("Missing raw input photos in public/raw/");
    process.exit(1);
  }

  // Alpha gradient mask to feather left and right boundaries into white
  const featherMaskSvg = Buffer.from(`
    <svg width="${photoW}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#000000"/>
          <stop offset="${(edgeFeather / photoW) * 100}%" stop-color="#ffffff"/>
          <stop offset="${((photoW - edgeFeather) / photoW) * 100}%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#000000"/>
        </linearGradient>
      </defs>
      <rect width="${photoW}" height="${H}" fill="url(#edgeGrad)"/>
    </svg>
  `);

  const p1 = await sharp(raw1)
    .resize(photoW, H, { fit: "contain" })
    .ensureAlpha()
    .composite([{ input: featherMaskSvg, blend: "dest-in" }])
    .png()
    .toBuffer();

  const p2 = await sharp(raw2)
    .resize(photoW, H, { fit: "contain" })
    .ensureAlpha()
    .composite([{ input: featherMaskSvg, blend: "dest-in" }])
    .png()
    .toBuffer();

  // Typography overlay: Quang Thắng ❤ Tường Lan, 28.11.2026
  const ribbonSvg = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(255, 255, 255, 0)"/>
          <stop offset="25%" stop-color="rgba(255, 255, 255, 0.75)"/>
          <stop offset="60%" stop-color="rgba(255, 255, 255, 0.95)"/>
          <stop offset="100%" stop-color="rgba(255, 255, 255, 1)"/>
        </linearGradient>
      </defs>

      <!-- Soft White Gradient Overlay at Bottom -->
      <rect x="0" y="520" width="${W}" height="110" fill="url(#ribbonGrad)"/>

      <!-- Names -->
      <text x="478" y="575" font-family="'Palatino Linotype', 'Times New Roman', serif" font-size="30" font-weight="bold" fill="#241d1a" text-anchor="middle">
        Quang Thắng
      </text>

      <!-- Red Heart Icon -->
      <g transform="translate(587, 555) scale(1.1)">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#c43030"/>
      </g>

      <text x="722" y="575" font-family="'Palatino Linotype', 'Times New Roman', serif" font-size="30" font-weight="bold" fill="#241d1a" text-anchor="middle">
        Tường Lan
      </text>

      <!-- Date -->
      <text x="600" y="608" font-family="'Palatino Linotype', 'Times New Roman', serif" font-size="18" font-weight="600" fill="#755a4a" text-anchor="middle" letter-spacing="5">
        28.11.2026
      </text>
    </svg>
  `);

  // Build high-resolution optimized JPEG (mozjpeg, quality: 96, 4:4:4 chroma)
  const finalImage = await sharp({
    create: { width: W, height: H, channels: 4, background: "#ffffff" },
  })
    .composite([
      { input: p1, left: 180, top: 0 },
      { input: p2, left: 600, top: 0 },
      { input: ribbonSvg, left: 0, top: 0 },
    ])
    .jpeg({ quality: 96, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();

  const out1 = path.resolve("public/images/og-share.jpg");
  fs.writeFileSync(out1, finalImage);

  console.log(`[OK] OG image generated successfully:`);
  console.log(`     - ${out1} (${(finalImage.length / 1024).toFixed(1)} KB)`);
  console.log(`     - ${out2} (${(finalImage.length / 1024).toFixed(1)} KB)`);
}

generateOG();
