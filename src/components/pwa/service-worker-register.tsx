"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // A real, caching service worker in dev risks serving stale JS chunks
    // over Fast Refresh, but registering none at all fails Chrome's PWA
    // installability check (no active service worker => no install prompt).
    // sw-dev.js is a pure network pass-through: it satisfies the check
    // without ever caching anything.
    const swUrl = process.env.NODE_ENV === "production" ? "/sw.js" : "/sw-dev.js";

    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  }, []);

  return null;
}
