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

    // public/sw.js is re-stamped with a fresh CACHE_VERSION on every
    // production build, so a new deploy always looks byte-different to the
    // browser and gets installed. But clients.claim() alone doesn't refresh
    // an already-open tab's in-memory JS — without this listener, a user
    // who never fully reloads keeps running the old build indefinitely,
    // which is the actual "site doesn't update" symptom. Only reload when
    // this tab was ALREADY under a service worker's control (a genuine
    // update), not on the very first-ever activation for a new visitor.
    const hadControllerAtLoad = Boolean(navigator.serviceWorker.controller);
    let reloaded = false;

    function handleControllerChange() {
      if (!hadControllerAtLoad || reloaded) return;
      reloaded = true;
      window.location.reload();
    }

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        // The browser only auto-checks for a new service worker on
        // navigation, and throttles that to roughly once every 24h — this
        // makes long-lived tabs (dashboard left open, installed PWA) check
        // again whenever the user comes back to them.
        function checkForUpdate() {
          if (document.visibilityState === "visible") registration.update().catch(() => {});
        }
        document.addEventListener("visibilitychange", checkForUpdate);
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  return null;
}
