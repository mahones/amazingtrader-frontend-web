// Regenerates the PWA icon set from public/Logo Blan.png (the mountain/arrow
// mark alone, no wordmark text). The old source, logo-whitebcc.png, is the
// full lockup (mark + "AMAZING TRADERS" text + underline) — squeezing that
// whole wide composition into a square tile shrank the actual mark down to
// a sliver, which is why the home-screen icon looked tiny next to other
// apps'. The mark is trimmed to its own bounding box first so it fills the
// tile the same way a normal app icon does.
// Run via `npm run pwa:icons` whenever the logo changes; output is committed
// to public/icons/, not generated at build time.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const BG = "#0E0E0E";
const SRC = path.join(__dirname, "..", "public", "Logo Blan.png");
const OUT_DIR = path.join(__dirname, "..", "public", "icons");

// sharp's own .trim() doesn't reliably detect a fully-transparent (alpha 0)
// border on this file, so the crop box is computed by hand from the alpha
// channel instead.
async function trimmedMarkBuffer() {
  const { data, info } = await sharp(SRC).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  return sharp(SRC)
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .toBuffer();
}

async function makeIcon(markBuffer, { size, logoRatio, outFile }) {
  const logoSize = Math.round(size * logoRatio);
  const logo = await sharp(markBuffer)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const offset = Math.round((size - logoSize) / 2);

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: logo, left: offset, top: offset }])
    .png()
    .toFile(path.join(OUT_DIR, outFile));

  console.log("wrote", outFile);
}

async function main() {
  await fs.promises.mkdir(OUT_DIR, { recursive: true });
  const markBuffer = await trimmedMarkBuffer();

  // "any" icons aren't masked by the OS, so the mark can fill almost the
  // whole tile, same as other apps' icons.
  await makeIcon(markBuffer, { size: 192, logoRatio: 0.85, outFile: "icon-192.png" });
  await makeIcon(markBuffer, { size: 512, logoRatio: 0.85, outFile: "icon-512.png" });
  // "maskable" icons get cropped to a circle/squircle by the launcher, so the
  // mark has to stay inside that safe zone (~66% of the canvas) or corners
  // of it get clipped.
  await makeIcon(markBuffer, { size: 512, logoRatio: 0.62, outFile: "icon-maskable-512.png" });
  await makeIcon(markBuffer, { size: 192, logoRatio: 0.62, outFile: "icon-maskable-192.png" });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
