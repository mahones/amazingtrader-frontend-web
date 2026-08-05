"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TickerPair {
  symbol: string;
  rate: number;
}

type Direction = "up" | "down" | "flat";

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

  if (!pairs) {
    if (failed) {
      return (
        <div className="flex h-9 items-center px-1 text-sm text-muted-foreground">
          Cours des devises indisponibles pour le moment.
        </div>
      );
    }
    return <div className="h-9" aria-hidden />;
  }

  const loop = [...pairs, ...pairs];

  return (
    <div className="overflow-hidden">
      <div className="flex w-max animate-marquee gap-10 py-2 pr-10 whitespace-nowrap">
        {loop.map((pair, index) => {
          const direction = directions[pair.symbol] ?? "flat";
          return (
            <span
              key={`${pair.symbol}-${index}`}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium",
                direction === "up" && "text-emerald-600",
                direction === "down" && "text-red-600",
                direction === "flat" && "text-foreground"
              )}
            >
              {pair.symbol}
              <strong className="tabular-nums">{pair.rate.toFixed(4)}</strong>
              {direction === "up" && <ArrowUp className="size-3" />}
              {direction === "down" && <ArrowDown className="size-3" />}
            </span>
          );
        })}
      </div>
    </div>
  );
}
