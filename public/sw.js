// CACHE_VERSION is stamped automatically by scripts/stamp-service-worker.js
// on every production build (see its "prebuild" npm script) — never edit it
// by hand. That stamp is what makes the browser notice this file changed on
// each deploy and re-run install/activate to drop the previous cache; if it
// never changes, previously cached assets can keep being served forever.
const CACHE_VERSION = "246bf75a69ba";
const CACHE_NAME = `amazingtraders-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";

const PRECACHE_URLS = [
  OFFLINE_URL,
  "/manifest.json",
  "/logo-whitebcc.png",
  "/logo.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

const STATIC_ASSET_RE = /\.(?:png|jpg|jpeg|webp|gif|svg|ico|css|js|woff2?|ttf)$/;
// Next.js fingerprints these filenames by content hash, so a changed file
// always gets a new URL — safe to cache-first forever, no revalidation
// needed. Everything else matching STATIC_ASSET_RE (logo, icons,
// manifest.json...) can change in place without its URL changing (e.g. an
// admin replaces the logo), so it must stay network-first below.
const IMMUTABLE_ASSET_RE = /^\/_next\/static\//;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  if (IMMUTABLE_ASSET_RE.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
      )
    );
    return;
  }

  if (STATIC_ASSET_RE.test(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});
