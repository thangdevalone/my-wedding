import fs from "fs";
import path from "path";
import sharp from "sharp";

const galleryList = [
  // Group 1: Classic White Moulding Wall (Phòng chụp Châu Âu Cổ Điển)
  "4775", "4797", "4898", "4927", "4937", "5017",
  // Group 2: Pure White Studio & Playful (Studio Trắng Tinh Tế & Vui Tươi)
  "5047", "5063", "5084", "5122", "5126", "5329",
  // Group 3: Chic Grey Studio (Studio Xám Sang Trọng)
  "5210", "5363", "5411", "5436",
  // Group 4: Artistic Rose (Nghệ Thuật Hồng Pastel)
  "5513", "5595",
  // Group 5: Modern White Tuxedo & Mermaid Dress (Tuxedo Trắng & Váy Đuôi Cá)
  "5861", "5872", "5940", "6090",
  // Group 6: Traditional Red Silk Áo Tấc (Cổ Phục Áo Tấc Truyền Thống)
  "5699", "5769"
];

const outDir = path.resolve("public/images/gallery");
fs.mkdirSync(outDir, { recursive: true });

async function optimizeGallery() {
  console.log(`Starting gallery optimization for ${galleryList.length} photos...`);
  let totalOrigBytes = 0;
  let totalOptimizedBytes = 0;

  for (let i = 0; i < galleryList.length; i++) {
    const num = galleryList[i];
    const srcPath = path.resolve(`public/raw/DSC_${num}.jpg`);

    if (!fs.existsSync(srcPath)) {
      console.error(`[ERROR] File not found: ${srcPath}`);
      continue;
    }

    const origStat = fs.statSync(srcPath);
    totalOrigBytes += origStat.size;

    // 1. Zoom/Full version: max 1800px on long edge, MozJPEG quality 90
    // Sharp and clear even when pinched/zoomed on Retina/4K
    const zoomOutPath = path.join(outDir, `dsc-${num}.jpg`);
    await sharp(srcPath, { limitInputPixels: false })
      .rotate()
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(zoomOutPath);

    // 2. Grid Thumbnail version: max 640px on long edge, MozJPEG quality 90
    // Loads quickly on mobile 2-column grid with premium sharpness
    const thumbOutPath = path.join(outDir, `dsc-${num}-thumb.jpg`);
    await sharp(srcPath, { limitInputPixels: false })
      .rotate()
      .resize({ width: 640, height: 960, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(thumbOutPath);

    const zoomStat = fs.statSync(zoomOutPath);
    const thumbStat = fs.statSync(thumbOutPath);
    totalOptimizedBytes += zoomStat.size + thumbStat.size;

    console.log(
      `[${i + 1}/${galleryList.length}] DSC_${num}: ${(origStat.size / 1024 / 1024).toFixed(1)} MB -> Zoom: ${(zoomStat.size / 1024).toFixed(0)} KB | Thumb: ${(thumbStat.size / 1024).toFixed(0)} KB`
    );
  }

  console.log("-----------------------------------------------------------------");
  console.log(`Total Original Raw: ${(totalOrigBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Total Optimized Web: ${(totalOptimizedBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Optimization savings: -${((1 - totalOptimizedBytes / totalOrigBytes) * 100).toFixed(1)}%`);
}

optimizeGallery();
