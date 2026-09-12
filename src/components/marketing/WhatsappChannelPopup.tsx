"use client";

import { useEffect, useState } from "react";
import { ArrowRight, MessageCircleMore, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029VbBOvS55a240W5cVIb1w";
const LATER_KEY = "at-whatsapp-popup-later";
const DISMISSED_KEY = "at-whatsapp-popup-dismissed";
const SHOW_DELAY_MS = 5000;

export function WhatsappChannelPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;
    if (sessionStorage.getItem(LATER_KEY)) return;
    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function handleLater() {
    sessionStorage.setItem(LATER_KEY, "1");
    setOpen(false);
  }

  function handleDismissForever() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleLater();
      }}
    >
      <DialogContent className="max-w-md p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <MessageCircleMore className="size-8" />
          </div>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            100% gratuit
          </span>

          <DialogTitle className="mt-4 text-xl font-bold sm:text-2xl">
            Rejoignez notre chaîne WhatsApp
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm">
            Recevez nos analyses de marché et nos actualités directement sur WhatsApp.
          </DialogDescription>
        </div>

        <Button
          size="lg"
          className="mt-6 w-full"
          render={
            <a
              href={WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDismissForever}
            >
              Rejoindre la chaîne WhatsApp
              <ArrowRight className="size-4" />
            </a>
          }
        />

        <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <button type="button" onClick={handleLater} className="transition-colors hover:text-foreground hover:underline">
            Plus tard
          </button>
          <span aria-hidden>·</span>
          <button
            type="button"
            onClick={handleDismissForever}
            className="transition-colors hover:text-foreground hover:underline"
          >
            Ne plus afficher
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
