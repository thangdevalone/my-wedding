import fs from "fs";
import path from "path";
import sharp from "sharp";

async function generateMoments() {
  const outputDir = path.resolve("public/images");

  // 1. Top slot: DSC_5126
  console.log("Generating moments-5126.jpg...");
  const img5126 = sharp("public/raw/DSC_5126.jpg");
  await img5126
    .extract({ left: 90, top: 80, width: 3350, height: 4357 })
    .resize(900, 1170, { fit: "cover" })
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(path.join(outputDir, "moments-5126.jpg"));

  // 2. Small right slot: DSC_5329 (Wider crop showing full shoulders, veil, and torso)
  console.log("Generating moments-5329.jpg...");
  const img5329 = sharp("public/raw/DSC_5329.jpg");
  await img5329
    .extract({ left: 180, top: 80, width: 3500, height: 3195 })
    .resize(800, 730, { fit: "cover" })
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(path.join(outputDir, "moments-5329.jpg"));

  // 3. Bottom large slot: DSC_4927
  console.log("Generating moments-4927.jpg...");
  const img4927 = sharp("public/raw/DSC_4927.jpg");
  await img4927
    .extract({ left: 0, top: 380, width: 3957, height: 5146 })
    .resize(1000, 1300, { fit: "cover" })
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(path.join(outputDir, "moments-4927.jpg"));

  console.log("Done generating moments photos!");

  const s1 = fs.statSync(path.join(outputDir, "moments-5126.jpg"));
  const s2 = fs.statSync(path.join(outputDir, "moments-5329.jpg"));
  const s3 = fs.statSync(path.join(outputDir, "moments-4927.jpg"));

  console.log("File sizes:");
  console.log(`moments-5126.jpg: ${(s1.size / 1024).toFixed(1)} KB`);
  console.log(`moments-5329.jpg: ${(s2.size / 1024).toFixed(1)} KB`);
  console.log(`moments-4927.jpg: ${(s3.size / 1024).toFixed(1)} KB`);
}

generateMoments().catch((err) => {
  console.error("Error generating moments photos:", err);
  process.exit(1);
});
