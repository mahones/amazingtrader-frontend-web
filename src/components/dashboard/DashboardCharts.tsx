"use client";

import { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ActivityItem, ActivityType, LicenseDistributionPoint, MonthlyPoint, StatsPeriod, TrendPoint } from "@/types/stats";

const MONTH_LETTERS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const PERIODS: StatsPeriod[] = [7, 30, 90];
const DONUT_STROKE_COLORS = ["stroke-primary", "stroke-primary/55", "stroke-foreground/30", "stroke-foreground/15"];
const DONUT_LEGEND_COLORS = ["bg-primary", "bg-primary/55", "bg-foreground/30", "bg-foreground/15"];

const ACTIVITY_BADGE: Record<ActivityType, { label: string; variant: "default" | "pending" | "outline" | "success" }> = {
  achat: { label: "Achat", variant: "default" },
  retrait: { label: "Retrait", variant: "pending" },
  partenaire: { label: "Partenaire", variant: "outline" },
  inscription: { label: "Inscription", variant: "success" },
  activation: { label: "Activée", variant: "success" },
  formation_terminee: { label: "Terminé", variant: "success" },
};

function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(date);
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Hier";
  }
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(date);
}

function formatAxisDate(isoDate: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(new Date(isoDate));
}

function AreaCurve({ points }: { points: TrendPoint[] }) {
  const gradientId = useId();
  const width = 600;
  const height = 160;
  const gridLines = [0.25, 0.5, 0.75];

  const values = points.map((p) => p.value);
  const max = Math.max(1, ...values);
  const min = Math.min(0, ...values);
  const range = max - min || 1;

  const coords = points.map((p, i) => ({
    x: points.length > 1 ? (i / (points.length - 1)) * width : width / 2,
    y: height - ((p.value - min) / range) * height,
  }));

  // Straight segments between real data points — this is daily/periodic data,
  // not a continuous signal, so no curve-smoothing is applied between them.
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x},${c.y}`).join(" ");
  const area = `${line} L ${width},${height} L 0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full overflow-visible" preserveAspectRatio="none">
      <defs>
        {/* currentColor in a <stop> resolves from the color inherited on this
            <linearGradient> itself, NOT from the <path> that later references
            it via fill="url(#…)" — the class has to live here or the fill
            falls back to the ambient (foreground) text color. */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1" className="text-primary">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.45" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {gridLines.map((g) => (
        <line
          key={g}
          x1={0}
          x2={width}
          y1={height * g}
          y2={height * g}
          className="stroke-foreground/10"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path d={area} fill={`url(#${gradientId})`} stroke="none" className="text-primary" />
      <path
        d={line}
        fill="none"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className="stroke-primary"
      />
    </svg>
  );
}

export function TrendChartCard({
  title,
  points,
  loading,
  period,
  onPeriodChange,
  headline,
  changePercent,
  changeLabel = "sur la période",
  emptyLabel = "Aucune donnée sur la période",
}: {
  title: string;
  points: TrendPoint[];
  loading: boolean;
  period: StatsPeriod;
  onPeriodChange: (period: StatsPeriod) => void;
  headline: string;
  changePercent: number | null;
  changeLabel?: string;
  emptyLabel?: string;
}) {
  const hasData = points.some((p) => p.value !== 0);
  const axisDates = useMemo(() => {
    if (points.length === 0) return [];
    const indices = [0, Math.floor((points.length - 1) / 4), Math.floor((points.length - 1) / 2), Math.floor(((points.length - 1) * 3) / 4), points.length - 1];
    return Array.from(new Set(indices)).map((i) => points[i].date);
  }, [points]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle>{title}</CardTitle>
        <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange(p)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p}j
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-40 w-full" />
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl font-bold tabular-nums">{headline}</span>
              {changePercent !== null && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-medium",
                    changePercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                  )}
                >
                  {changePercent >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                  {changePercent >= 0 ? "+" : ""}
                  {changePercent.toFixed(1)}% {changeLabel}
                </span>
              )}
            </div>
            {hasData ? (
              <>
                <AreaCurve points={points} />
                <div className="flex justify-between text-xs text-muted-foreground/70">
                  {axisDates.map((date) => (
                    <span key={date}>{formatAxisDate(date)}</span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">{emptyLabel}</div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function MonthlyBarChart({
  title,
  points,
  loading,
  emptyLabel = "Aucune donnée",
}: {
  title: string;
  points: MonthlyPoint[];
  loading: boolean;
  emptyLabel?: string;
}) {
  const max = Math.max(1, ...points.map((p) => p.value));
  const hasData = points.some((p) => p.value > 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : hasData ? (
          <div className="flex h-40 items-end justify-between gap-1.5 sm:gap-2.5">
            {points.map((p, index) => {
              const monthIndex = Number(p.month.split("-")[1]) - 1;
              const heightPct = max > 0 ? Math.max(4, (p.value / max) * 100) : 4;
              const isCurrent = index === points.length - 1;
              return (
                <div key={p.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <motion.div
                      className={cn("w-full rounded-t-md", isCurrent ? "bg-primary" : "bg-primary/25")}
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {MONTH_LETTERS[monthIndex]}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">{emptyLabel}</div>
        )}
      </CardContent>
    </Card>
  );
}

function Donut({ points, total }: { points: LicenseDistributionPoint[]; total: number }) {
  const size = 140;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = useMemo(() => {
    const lengths = points.map((p) => (total > 0 ? (p.value / total) * circumference : 0));
    return points.map((p, i) => ({
      ...p,
      length: lengths[i],
      dashoffset: -lengths.slice(0, i).reduce((sum, l) => sum + l, 0),
    }));
  }, [points, total, circumference]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-muted" />
        {segments.map((segment, i) => {
          if (segment.value === 0 || total === 0) return null;
          return (
            <circle
              key={segment.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={strokeWidth}
              strokeDasharray={`${segment.length} ${circumference - segment.length}`}
              strokeDashoffset={segment.dashoffset}
              className={DONUT_STROKE_COLORS[i % DONUT_STROKE_COLORS.length]}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-2xl font-bold tabular-nums">{total}</span>
        <span className="text-xs text-muted-foreground">actifs</span>
      </div>
    </div>
  );
}

export function LicenseDistributionCard({
  title,
  points,
  loading,
  emptyLabel = "Aucune licence active",
}: {
  title: string;
  points: LicenseDistributionPoint[];
  loading: boolean;
  emptyLabel?: string;
}) {
  const total = points.reduce((sum, p) => sum + p.value, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : total > 0 ? (
          <div className="flex items-center gap-6">
            <Donut points={points} total={total} />
            <ul className="flex-1 space-y-2.5">
              {points.map((p, i) => (
                <li key={p.key} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className={cn("size-2.5 shrink-0 rounded-full", DONUT_LEGEND_COLORS[i % DONUT_LEGEND_COLORS.length])} />
                    {p.label}
                  </span>
                  <span className="font-semibold tabular-nums">{p.value}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">{emptyLabel}</div>
        )}
      </CardContent>
    </Card>
  );
}

export function ActivityFeedCard({
  title,
  items,
  loading,
  emptyLabel = "Aucune activité récente",
}: {
  title: string;
  items: ActivityItem[];
  loading: boolean;
  emptyLabel?: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <ul className="divide-y divide-border/60">
            {items.map((item, index) => {
              const meta = ACTIVITY_BADGE[item.type];
              return (
                <li
                  key={index}
                  className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3 text-sm first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Badge variant={meta.variant} className="shrink-0">
                      {meta.label}
                    </Badge>
                    <span className="truncate font-medium">{item.label}</span>
                    {item.detail && <span className="shrink-0 text-muted-foreground">· {item.detail}</span>}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatRelativeTime(item.timestamp)}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">{emptyLabel}</div>
        )}
      </CardContent>
    </Card>
  );
}
