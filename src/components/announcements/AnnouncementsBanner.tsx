"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn, formatDateTime } from "@/lib/utils";
import { fetchPinnedAnnouncements } from "@/lib/api/announcements";
import type { Announcement } from "@/types/announcement";

const ROTATE_INTERVAL_MS = 6_000;

export function AnnouncementsBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<Announcement | null>(null);

  useEffect(() => {
    // Only ever returns pinned announcements — see
    // ListPinnedAnnouncementsAction on the backend.
    fetchPinnedAnnouncements()
      .then(setAnnouncements)
      .catch(() => setAnnouncements([]));
  }, []);

  useEffect(() => {
    // Re-armed on every index change (manual arrow click or automatic
    // advance) so a manual click always gets a full interval before the
    // next auto-advance, instead of racing a stale timer.
    if (announcements.length < 2 || paused) return;
    const timeout = setTimeout(() => {
      setIndex((i) => (i + 1) % announcements.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearTimeout(timeout);
  }, [announcements.length, paused, index]);

  if (announcements.length === 0) return null;

  const hasMultiple = announcements.length > 1;
  const current = announcements[index % announcements.length];

  function goTo(delta: number) {
    setIndex((i) => (i + delta + announcements.length) % announcements.length);
  }

  return (
    <div className="mx-auto flex w-full max-w-xl items-center gap-2">
      {hasMultiple && (
        <Button
          variant="outline"
          size="icon-sm"
          className="shrink-0 rounded-full"
          aria-label="Annonce précédente"
          onClick={() => goTo(-1)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <ChevronLeft className="size-4" />
        </Button>
      )}

      <Card
        className="min-w-0 flex-1 cursor-pointer border-primary/30 bg-primary/5 transition-colors hover:bg-primary/10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={() => setSelected(current)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setSelected(current);
        }}
      >
        <CardContent className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Megaphone className="size-4" />
          </div>

          <div className="relative h-5 min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center gap-2 overflow-hidden text-sm"
              >
                <span className="shrink-0 font-semibold text-foreground">{current.title}</span>
                <span className="shrink-0 text-muted-foreground">·</span>
                <span className="truncate text-muted-foreground">{current.description}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {hasMultiple && (
            <div className="flex shrink-0 items-center gap-1">
              {announcements.map((announcement, i) => (
                <span
                  key={announcement.id}
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    i === index ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {hasMultiple && (
        <Button
          variant="outline"
          size="icon-sm"
          className="shrink-0 rounded-full"
          aria-label="Annonce suivante"
          onClick={() => goTo(1)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <ChevronRight className="size-4" />
        </Button>
      )}

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
    </div>
  );
}
