// Regenerates the PWA icon set from public/logo-whitebcc.png.
// Run via `npm run pwa:icons` whenever the logo changes; output is committed
// to public/icons/, not generated at build time.
const sharp = require("sharp");
const path = require("path");

const BG = "#0E0E0E";
const SRC = path.join(__dirname, "..", "public", "logo-whitebcc.png");
const OUT_DIR = path.join(__dirname, "..", "public", "icons");

async function makeIcon({ size, logoRatio, outFile }) {
  const logoSize = Math.round(size * logoRatio);
  const logo = await sharp(SRC)
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
  await require("fs").promises.mkdir(OUT_DIR, { recursive: true });

  await makeIcon({ size: 192, logoRatio: 0.68, outFile: "icon-192.png" });
  await makeIcon({ size: 512, logoRatio: 0.68, outFile: "icon-512.png" });
  await makeIcon({ size: 512, logoRatio: 0.5, outFile: "icon-maskable-512.png" });
  await makeIcon({ size: 192, logoRatio: 0.5, outFile: "icon-maskable-192.png" });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
