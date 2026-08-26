"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Download, Share, SquarePlus, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

const DISMISSED_KEY = "at-pwa-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIosDevice() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandaloneDisplay() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function subscribeNever() {
  return () => {};
}

// iOS never fires beforeinstallprompt (WebKit is mandatory for every browser
// on iOS, Chrome included), so it has no automatic install UI — this drives
// manual "Share > Sur l'écran d'accueil" instructions instead. Read through
// useSyncExternalStore (not useState+effect) so the browser-only check stays
// SSR-safe without a setState call inside the effect body.
function getShowIosSnapshot() {
  return isIosDevice() && !isStandaloneDisplay() && localStorage.getItem(DISMISSED_KEY) !== "1";
}

function getShowIosServerSnapshot() {
  return false;
}

export function InstallPrompt() {
  const showIos = useSyncExternalStore(subscribeNever, getShowIosSnapshot, getShowIosServerSnapshot);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (showIos) return;
    if (isStandaloneDisplay()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setClosed(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [showIos]);

  const visible = !closed && (showIos || deferredPrompt !== null);

  if (!visible) return null;

  const dismiss = () => {
    setClosed(true);
    localStorage.setItem(DISMISSED_KEY, "1");
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setClosed(true);
    if (outcome === "dismissed") {
      localStorage.setItem(DISMISSED_KEY, "1");
    }
  };

  const logo = (
    <>
      <Image
        src="/logo.png"
        alt="amazingtraders"
        width={40}
        height={32}
        className="h-8 w-10 shrink-0 object-contain dark:hidden"
      />
      <Image
        src="/logo-whitebcc.png"
        alt="amazingtraders"
        width={40}
        height={32}
        className="hidden h-8 w-10 shrink-0 object-contain dark:block"
      />
    </>
  );

  if (showIos) {
    return (
      <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-4">
        {logo}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-card-foreground">Installer amazingtraders</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Appuyez sur <Share className="mx-0.5 inline size-3.5 align-text-bottom" /> Partager, puis sur{" "}
            <SquarePlus className="mx-0.5 inline size-3.5 align-text-bottom" /> « Sur l&apos;écran d&apos;accueil ».
          </p>
        </div>
        <Button size="icon-sm" variant="ghost" onClick={dismiss} aria-label="Fermer">
          <X />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-4">
      {logo}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-card-foreground">Installer amazingtraders</p>
        <p className="text-xs text-muted-foreground">Accès rapide depuis votre écran d&apos;accueil.</p>
      </div>
      <Button size="icon-sm" variant="default" onClick={install} aria-label="Installer l'application">
        <Download />
      </Button>
      <Button size="icon-sm" variant="ghost" onClick={dismiss} aria-label="Fermer">
        <X />
      </Button>
    </div>
  );
}
