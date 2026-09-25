// Stamps public/sw.js with a fresh CACHE_VERSION before every production
// build, so each deploy is byte-different from the last. Without this, the
// service worker file never changes, the browser never detects an update,
// and the old cached assets keep being served forever — see CLAUDE.md notes
// on this file. Runs automatically via the "prebuild" npm script.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SW_PATH = path.join(__dirname, "..", "public", "sw.js");

function resolveVersion() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 12);
  }

  try {
    return execSync("git rev-parse --short=12 HEAD", { cwd: __dirname }).toString().trim();
  } catch {
    return String(Date.now());
  }
}

const version = resolveVersion();
const source = fs.readFileSync(SW_PATH, "utf8");
const stamped = source.replace(
  /const CACHE_VERSION = ".*?";/,
  `const CACHE_VERSION = "${version}";`
);

if (stamped === source) {
  console.warn("stamp-service-worker: CACHE_VERSION line not found in public/sw.js, nothing changed.");
} else {
  fs.writeFileSync(SW_PATH, stamped);
  console.log(`stamp-service-worker: public/sw.js stamped with CACHE_VERSION "${version}".`);
}
