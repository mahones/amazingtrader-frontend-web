"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Megaphone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn, formatDateTime } from "@/lib/utils";
import { API_URL } from "@/lib/api/client";
import type { Announcement } from "@/types/announcement";

interface TickerPair {
  symbol: string;
  rate: number;
}

type Direction = "up" | "down" | "flat";

type TickerItem =
  | { kind: "currency"; key: string; symbol: string; rate: number; direction: Direction }
  | { kind: "announcement"; key: string; announcement: Announcement };

const POLL_INTERVAL_MS = 60_000;

async function fetchRates(): Promise<Record<string, number> | null> {
  try {
    const res = await fetch(
      "https://api.frankfurter.dev/v1/latest?from=EUR&to=USD,GBP,JPY,CHF,CAD,AUD"
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.rates as Record<string, number>;
  } catch {
    return null;
  }
}

async function fetchAnnouncements(): Promise<Announcement[]> {
  // Deliberately bypasses apiClient (axios): that shared instance shows a
  // global "server error" toast on any failed request, which is too
  // disruptive for this decorative, best-effort ticker content that now
  // loads on every public page — a transient hiccup here should just mean
  // no announcement pills, exactly like a failed currency fetch below.
  try {
    const res = await fetch(`${API_URL}/api/announcements`);
    if (!res.ok) return [];
    const body = (await res.json()) as { data: Announcement[] };
    return body.data;
  } catch {
    return [];
  }
}

function computePairs(rates: Record<string, number>): TickerPair[] {
  return [
    { symbol: "EUR/USD", rate: rates.USD },
    { symbol: "GBP/USD", rate: rates.USD / rates.GBP },
    { symbol: "USD/JPY", rate: rates.JPY / rates.USD },
    { symbol: "USD/CHF", rate: rates.CHF / rates.USD },
    { symbol: "AUD/USD", rate: rates.USD / rates.AUD },
    { symbol: "USD/CAD", rate: rates.CAD / rates.USD },
  ];
}

export function MarketTicker() {
  const [pairs, setPairs] = useState<TickerPair[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [directions, setDirections] = useState<Record<string, Direction>>({});
  const previousRef = useRef<Record<string, number>>({});
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selected, setSelected] = useState<Announcement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const rates = await fetchRates();
      if (cancelled) return;

      if (!rates) {
        setFailed(true);
        return;
      }

      const computed = computePairs(rates);
      const nextDirections: Record<string, Direction> = {};
      for (const pair of computed) {
        const prev = previousRef.current[pair.symbol];
        nextDirections[pair.symbol] =
          prev === undefined ? "flat" : pair.rate > prev ? "up" : pair.rate < prev ? "down" : "flat";
        previousRef.current[pair.symbol] = pair.rate;
      }

      setFailed(false);
      setDirections(nextDirections);
      setPairs(computed);
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Only ever returns pinned announcements — see
    // ListPinnedAnnouncementsAction on the backend. The ticker simply has
    // nothing extra to show when this comes back empty.
    fetchAnnouncements().then(setAnnouncements);
  }, []);

  const items: TickerItem[] = [
    ...announcements.map((announcement) => ({
      kind: "announcement" as const,
      key: `announcement-${announcement.id}`,
      announcement,
    })),
    ...(pairs ?? []).map((pair) => ({
      kind: "currency" as const,
      key: pair.symbol,
      symbol: pair.symbol,
      rate: pair.rate,
      direction: directions[pair.symbol] ?? "flat",
    })),
  ];

  if (items.length === 0) {
    if (failed) {
      return (
        <div className="flex h-9 items-center px-1 text-sm text-muted-foreground">
          Cours des devises indisponibles pour le moment.
        </div>
      );
    }
    return <div className="h-9" aria-hidden />;
  }

  const loop = [...items, ...items];

  return (
    <>
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-10 py-2 pr-10 whitespace-nowrap hover:[animation-play-state:paused]">
          {loop.map((item, index) =>
            item.kind === "announcement" ? (
              <button
                key={`${item.key}-${index}`}
                type="button"
                onClick={() => setSelected(item.announcement)}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30"
              >
                <Megaphone className="size-3.5 shrink-0" />
                {item.announcement.title}
                <span className="font-normal text-destructive/80">— {item.announcement.description}</span>
              </button>
            ) : (
              <span
                key={`${item.key}-${index}`}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium",
                  item.direction === "up" && "text-emerald-600",
                  item.direction === "down" && "text-red-600",
                  item.direction === "flat" && "text-foreground"
                )}
              >
                {item.symbol}
                <strong className="tabular-nums">{item.rate.toFixed(4)}</strong>
                {item.direction === "up" && <ArrowUp className="size-3" />}
                {item.direction === "down" && <ArrowDown className="size-3" />}
              </span>
            )
          )}
        </div>
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
