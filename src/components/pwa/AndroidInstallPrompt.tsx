"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

const DISMISSED_KEY = "at-pwa-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function AndroidInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const handleAppInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!visible || !deferredPrompt) return null;

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  };

  const install = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
    if (outcome === "dismissed") {
      localStorage.setItem(DISMISSED_KEY, "1");
    }
  };

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-4">
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
