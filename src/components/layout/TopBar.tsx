"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Megaphone, MessageCircleMore, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/utils";
import { API_URL } from "@/lib/api/client";
import type { Announcement } from "@/types/announcement";
import { MarketTicker } from "./MarketTicker";

const WHATSAPP_URL = "https://wa.me/22879920432";
const ROTATE_INTERVAL_MS = 6_000;

async function fetchPinnedAnnouncements(): Promise<Announcement[]> {
  // Deliberately bypasses apiClient (axios): that shared instance shows a
  // global "server error" toast on any failed request, which is too
  // disruptive for this decorative, best-effort bar that loads on every
  // public page — a transient hiccup here should just mean the normal
  // ticker row stays put, exactly like MarketTicker's own currency fetch.
  try {
    const res = await fetch(`${API_URL}/api/announcements`);
    if (!res.ok) return [];
    const body = (await res.json()) as { data: Announcement[] };
    return body.data;
  } catch {
    return [];
  }
}

export function TopBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [selected, setSelected] = useState<Announcement | null>(null);

  useEffect(() => {
    // Only ever returns pinned announcements — see
    // ListPinnedAnnouncementsAction on the backend.
    fetchPinnedAnnouncements().then(setAnnouncements);
  }, []);

  useEffect(() => {
    if (announcements.length < 2 || dismissed) return;
    const timeout = setTimeout(() => {
      setIndex((i) => (i + 1) % announcements.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearTimeout(timeout);
  }, [announcements.length, dismissed, index]);

  const showAnnouncement = !dismissed && announcements.length > 0;

  if (showAnnouncement) {
    const current = announcements[index % announcements.length];

    return (
      <>
        <div className="relative flex items-center bg-destructive px-4 py-2">
          <button
            type="button"
            onClick={() => setSelected(current)}
            className="mx-auto flex min-w-0 max-w-[calc(100%-3rem)] items-center gap-2 text-white"
          >
            <Megaphone className="size-4 shrink-0" />
            <AnimatePresence mode="wait">
              <motion.span
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex min-w-0 items-center gap-2 truncate text-sm"
              >
                <span className="shrink-0 font-semibold text-white">{current.title}</span>
                <span className="shrink-0 text-white/70">·</span>
                <span className="truncate text-white/90">{current.description}</span>
              </motion.span>
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Fermer l'annonce"
            className="absolute right-3 shrink-0 rounded-full p-1 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-4" />
          </button>
        </div>

        <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
          <DialogContent className="sm:max-w-md">
            {selected && (
              <>
                <DialogHeader>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                    <Megaphone className="size-4.5" />
                  </div>
                  <DialogTitle className="text-lg">{selected.title}</DialogTitle>
                  <span className="text-xs text-muted-foreground">{formatDateTime(selected.created_at)}</span>
                </DialogHeader>
                <p className="text-sm whitespace-pre-wrap text-foreground/90">{selected.description}</p>
              </>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="flex items-stretch border-b border-border bg-background text-foreground">
      <div className="min-w-0 flex-1">
        <MarketTicker />
      </div>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex shrink-0 items-center gap-1.5 border-l border-border px-4 text-sm font-bold whitespace-nowrap text-foreground transition-colors hover:text-primary"
      >
        <MessageCircleMore className="size-4 text-primary" />
        (228) 79920432
      </a>
    </div>
  );
}
