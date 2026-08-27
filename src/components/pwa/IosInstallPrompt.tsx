"use client";

import { useEffect, useState } from "react";
import { Share, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

const DISMISSED_KEY = "at-pwa-ios-install-dismissed";

function isIosSafari(): boolean {
  const ua = window.navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios|opios/i.test(ua);
  return isIos && isSafari;
}

export function IosInstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    if (standalone) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;
    if (!isIosSafari()) return;
    setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  };

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-4">
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
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-semibold text-card-foreground">Installer amazingtraders</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Appuyez sur <Share className="inline size-3.5 align-text-bottom" /> Partager, puis « Sur l&apos;écran
          d&apos;accueil ».
        </p>
      </div>
      <Button size="icon-sm" variant="ghost" onClick={dismiss} aria-label="Fermer">
        <X />
      </Button>
    </div>
  );
}
