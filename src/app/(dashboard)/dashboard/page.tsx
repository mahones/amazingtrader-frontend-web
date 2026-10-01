"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Bot,
  KeyRound,
  MessageSquarePlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ProgressRing } from "@/components/ui/progress-ring";
import { AnnouncementsBanner } from "@/components/announcements/AnnouncementsBanner";
import { SubmitReviewDialog } from "@/components/reviews/SubmitReviewDialog";
import { ActivityFeedCard, LicenseDistributionCard, MonthlyBarChart, TrendChartCard } from "@/components/dashboard/DashboardCharts";
import { cn, formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { fetchMyEnrollments } from "@/lib/api/courses";
import { fetchMyLicenses } from "@/lib/api/licenses";
import { fetchMyBotAssignments } from "@/lib/api/bots";
import {
  fetchAdminCourses,
  fetchAdminLicensePlans,
  fetchAdminUsers,
  fetchPendingActivationCount,
  fetchPendingCredentialsChangeCount,
  fetchPendingPartnerApplicationCount,
  fetchPendingWithdrawalCount,
} from "@/lib/api/admin";
import {
  fetchAdminKpiTrends,
  fetchAdminLicenseDistribution,
  fetchAdminRecentActivity,
  fetchAdminRegistrationStats,
  fetchAdminRevenueStats,
  fetchMyBotPerformanceStats,
  fetchMyEnrollmentStats,
  fetchMyKpiTrends,
  fetchMyLicenseDistribution,
  fetchMyRecentActivity,
} from "@/lib/api/stats";
import type { ActivityItem, LicenseDistributionPoint, MonthlyPoint, StatsPeriod, TrendPoint } from "@/types/stats";

type Stat = {
  label: string;
  value: number;
  href?: string;
  caption?: string;
  attention?: boolean;
  trendPercent?: number | null;
};

// Decorative accent curve only — it is not a rendering of real historical
// data (we don't track per-day history for these counters), just a visual
// echo of the design reference. Seeded from the stat's own value so it stays
// stable across re-renders instead of reshuffling on every tick.
function sparklinePoints(seed: number, count = 10) {
  const points: number[] = [];
  let value = 45 + (seed % 20);
  for (let i = 0; i < count; i++) {
    const n = Math.sin((seed + 1) * (i + 1) * 12.9898) * 43758.5453;
    const frac = n - Math.floor(n);
    value += (frac - 0.32) * 26;
    value = Math.max(12, Math.min(88, value));
    points.push(value);
  }
  return points;
}

function Sparkline({ seed, tone = "primary" }: { seed: number; tone?: "primary" | "destructive" }) {
  const width = 100;
  const height = 28;
  const points = useMemo(() => sparklinePoints(Math.max(1, seed)), [seed]);
  const coords = points.map((p, i) => ({
    x: (i / (points.length - 1)) * width,
    y: height - (p / 100) * height,
  }));

  let d = `M ${coords[0].x},${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const mid = { x: (coords[i].x + coords[i + 1].x) / 2, y: (coords[i].y + coords[i + 1].y) / 2 };
    d += ` Q ${coords[i].x},${coords[i].y} ${mid.x},${mid.y}`;
  }
  d += ` T ${coords[coords.length - 1].x},${coords[coords.length - 1].y}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-7 w-full overflow-visible" preserveAspectRatio="none">
      <path
        d={d}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={tone === "destructive" ? "stroke-destructive" : "stroke-primary"}
      />
    </svg>
  );
}

function StatTile({ stat, index }: { stat: Stat; index: number }) {
  const content = (
    <Card
      className={cn(
        "h-full transition-all duration-200",
        stat.href && "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5",
        stat.attention &&
          "border-destructive/50 bg-destructive/[0.03] ring-1 ring-destructive/15 dark:bg-destructive/[0.06]"
      )}
    >
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
          {stat.attention ? (
            <Badge variant="destructive" className="shrink-0">
              À traiter
            </Badge>
          ) : (
            stat.trendPercent != null && (
              <span
                className={cn(
                  "shrink-0 text-xs font-semibold tabular-nums",
                  stat.trendPercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                )}
              >
                {stat.trendPercent >= 0 ? "+" : ""}
                {stat.trendPercent.toFixed(1)}%
              </span>
            )
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <div className="font-heading text-3xl font-bold tabular-nums">
              <AnimatedNumber value={stat.value} />
            </div>
            {stat.caption && <p className="mt-0.5 text-xs text-muted-foreground/70">{stat.caption}</p>}
          </div>
          <div className="w-20 shrink-0">
            <Sparkline seed={stat.value + index} tone={stat.attention ? "destructive" : "primary"} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return stat.href ? (
    <Link href={stat.href} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
}

function StatTileSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-7 w-20 shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressRingTile({
  label,
  percent,
  caption,
  loading,
}: {
  label: string;
  percent: number;
  caption: string;
  loading: boolean;
}) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col items-center justify-center gap-3 text-center">
        {loading ? (
          <Skeleton className="size-[104px] rounded-full" />
        ) : (
          <div className="relative flex items-center justify-center">
            <ProgressRing percent={percent} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-2xl font-bold tabular-nums">
                <AnimatedNumber value={Math.round(percent)} />%
              </span>
            </div>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-xs text-muted-foreground/70">{caption}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardOverviewPage() {
  const { user, isStaff } = useAuth();
  const [stats, setStats] = useState<Stat[]>([]);
  const [avgProgress, setAvgProgress] = useState(0);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<StatsPeriod>(30);
  const [trendPoints, setTrendPoints] = useState<TrendPoint[]>([]);
  const [trendLoading, setTrendLoading] = useState(true);
  const [monthlyPoints, setMonthlyPoints] = useState<MonthlyPoint[]>([]);
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [licensePoints, setLicensePoints] = useState<LicenseDistributionPoint[]>([]);
  const [licenseLoading, setLicenseLoading] = useState(true);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (isStaff) {
        const [
          courses,
          plans,
          users,
          pendingActivations,
          pendingCredentialsChanges,
          pendingWithdrawals,
          pendingPartnerApplications,
          kpiTrends,
        ] = await Promise.all([
          fetchAdminCourses(),
          fetchAdminLicensePlans(),
          fetchAdminUsers(),
          fetchPendingActivationCount(),
          fetchPendingCredentialsChangeCount(),
          fetchPendingWithdrawalCount(),
          fetchPendingPartnerApplicationCount(),
          fetchAdminKpiTrends(),
        ]);
        const publishedCourses = courses.filter((c) => c.is_published).length;
        const activePlans = plans.filter((p) => p.is_active).length;
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const newUsersThisWeek = users.filter((u) => new Date(u.created_at).getTime() >= sevenDaysAgo).length;

        setStats([
          {
            label: "Formations publiées",
            value: publishedCourses,
            caption: `sur ${courses.length} au total`,
            trendPercent: kpiTrends.formations,
          },
          {
            label: "Auto-trading créés",
            value: plans.length,
            caption: `${activePlans} actif${activePlans > 1 ? "s" : ""}`,
            trendPercent: kpiTrends.auto_trading,
          },
          {
            label: "Utilisateurs",
            value: users.length,
            caption: `+${newUsersThisWeek} cette semaine`,
            trendPercent: kpiTrends.users,
          },
          {
            label: "Attente d'activation",
            value: pendingActivations,
            href: "/dashboard/users?license_status=pending",
            caption: "licences à traiter",
            attention: pendingActivations > 0,
          },
          {
            label: "Modifications à approuver",
            value: pendingCredentialsChanges,
            href: "/dashboard/users?license_status=pending_changes",
            caption: "demandes à traiter",
            attention: pendingCredentialsChanges > 0,
          },
          {
            label: "Retraits en attente",
            value: pendingWithdrawals,
            href: "/dashboard/retraits",
            caption: "retraits à traiter",
            attention: pendingWithdrawals > 0,
          },
          {
            label: "Demandes partenaires",
            value: pendingPartnerApplications,
            href: "/dashboard/partenaires",
            caption: pendingPartnerApplications > 0 ? "demandes à traiter" : "Aucune en attente",
            attention: pendingPartnerApplications > 0,
          },
        ]);
      } else {
        const [enrollments, licenses, bots, kpiTrends] = await Promise.all([
          fetchMyEnrollments(),
          fetchMyLicenses(),
          fetchMyBotAssignments(),
          fetchMyKpiTrends(),
        ]);
        const activeLicenses = licenses.filter((l) => l.is_activated).length;
        const activeBots = bots.filter((b) => b.status === "active").length;
        const inProgressCourses = enrollments.filter((e) => e.progress_percent < 100).length;
        const avg =
          enrollments.length > 0
            ? enrollments.reduce((sum, e) => sum + e.progress_percent, 0) / enrollments.length
            : 0;
        setStats([
          {
            label: "Mes formations",
            value: enrollments.length,
            href: "/dashboard/formations",
            caption: enrollments.length > 0 ? `${inProgressCourses} en cours` : undefined,
            trendPercent: kpiTrends.formations,
          },
          {
            label: "Mon auto-trading",
            value: licenses.length,
            href: "/dashboard/auto-trading",
            caption: licenses.length > 0 ? `${activeLicenses} active${activeLicenses > 1 ? "s" : ""}` : undefined,
            trendPercent: kpiTrends.auto_trading,
          },
          {
            label: "Mes bots",
            value: bots.length,
            href: "/dashboard/bots",
            caption: bots.length > 0 ? `${activeBots} actif${activeBots > 1 ? "s" : ""}` : undefined,
            trendPercent: kpiTrends.bots,
          },
        ]);
        setAvgProgress(avg);
        setEnrollmentCount(enrollments.length);
      }
      setLoading(false);
    }
    load();
  }, [isStaff]);

  useEffect(() => {
    let isActive = true;
    async function load() {
      setTrendLoading(true);
      const points = isStaff ? await fetchAdminRevenueStats(period) : await fetchMyBotPerformanceStats(period);
      if (!isActive) return;
      setTrendPoints(points);
      setTrendLoading(false);
    }
    load();
    return () => {
      isActive = false;
    };
  }, [isStaff, period]);

  useEffect(() => {
    let isActive = true;
    async function load() {
      setMonthlyLoading(true);
      const points = isStaff ? await fetchAdminRegistrationStats() : await fetchMyEnrollmentStats();
      if (!isActive) return;
      setMonthlyPoints(points);
      setMonthlyLoading(false);
    }
    load();
    return () => {
      isActive = false;
    };
  }, [isStaff]);

  useEffect(() => {
    let isActive = true;
    async function load() {
      setLicenseLoading(true);
      const points = isStaff ? await fetchAdminLicenseDistribution() : await fetchMyLicenseDistribution();
      if (!isActive) return;
      setLicensePoints(points);
      setLicenseLoading(false);
    }
    load();
    return () => {
      isActive = false;
    };
  }, [isStaff]);

  useEffect(() => {
    let isActive = true;
    async function load() {
      setActivityLoading(true);
      const items = isStaff ? await fetchAdminRecentActivity() : await fetchMyRecentActivity();
      if (!isActive) return;
      setActivity(items);
      setActivityLoading(false);
    }
    load();
    return () => {
      isActive = false;
    };
  }, [isStaff]);

  const trendHeadline = isStaff
    ? formatCurrency(trendPoints.reduce((sum, p) => sum + p.value, 0))
    : formatCurrency(trendPoints.length > 0 ? trendPoints[trendPoints.length - 1].value : 0);

  const trendChangePercent = useMemo(() => {
    if (trendPoints.length < 2) return null;
    // Revenue points are already per-day totals; bot-performance points are a
    // cumulative running total, so de-cumulate them first for a like-for-like
    // first-half-vs-second-half comparison.
    const deltas = isStaff
      ? trendPoints.map((p) => p.value)
      : trendPoints.map((p, i) => (i === 0 ? p.value : p.value - trendPoints[i - 1].value));

    const mid = Math.floor(deltas.length / 2);
    const firstHalf = deltas.slice(0, mid).reduce((sum, v) => sum + v, 0);
    const secondHalf = deltas.slice(mid).reduce((sum, v) => sum + v, 0);
    if (firstHalf === 0) return null;
    return ((secondHalf - firstHalf) / Math.abs(firstHalf)) * 100;
  }, [trendPoints, isStaff]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Bonjour, <span className="text-primary">{user?.name}</span>
        </h1>
        <p className="text-muted-foreground">
          {isStaff ? "Voici un aperçu de l'activité de la plateforme." : "Voici un aperçu de votre activité."}
        </p>
      </div>

      <AnnouncementsBanner />

      <div
        className={cn(
          "grid gap-5",
          "sm:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {loading ? (
          <>
            {Array.from({ length: isStaff ? 7 : 3 }).map((_, i) => (
              <StatTileSkeleton key={i} />
            ))}
            {!isStaff && <StatTileSkeleton />}
          </>
        ) : (
          <>
            {stats.map((stat, index) => (
              <StatTile key={stat.label} stat={stat} index={index} />
            ))}
            {!isStaff && (
              <ProgressRingTile
                label="Progression globale"
                percent={avgProgress}
                caption={
                  enrollmentCount > 0
                    ? `Moyenne sur ${enrollmentCount} formation${enrollmentCount > 1 ? "s" : ""}`
                    : "Aucune formation en cours"
                }
                loading={loading}
              />
            )}
          </>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendChartCard
            title={isStaff ? `Revenus des ${period} derniers jours` : `Performance de mes bots sur ${period} jours`}
            points={trendPoints}
            loading={trendLoading}
            period={period}
            onPeriodChange={setPeriod}
            headline={trendHeadline}
            changePercent={trendChangePercent}
            changeLabel={isStaff ? "sur la période" : "ce mois"}
            emptyLabel={isStaff ? "Aucun revenu sur la période" : "Aucune clôture de trade sur la période"}
          />
        </div>
        <LicenseDistributionCard
          title={isStaff ? "Répartition des licences" : "Mes licences"}
          points={licensePoints}
          loading={licenseLoading}
          emptyLabel={isStaff ? "Aucune licence active" : "Aucune licence active"}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <MonthlyBarChart
          title={isStaff ? "Inscriptions par mois" : "Mes formations par mois"}
          points={monthlyPoints}
          loading={monthlyLoading}
          emptyLabel={isStaff ? "Aucune inscription récente" : "Aucune formation récente"}
        />
        <ActivityFeedCard
          title={isStaff ? "Activité récente" : "Mes dernières activités"}
          items={activity}
          loading={activityLoading}
          emptyLabel={isStaff ? "Aucune activité récente" : "Aucune activité récente"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accès rapides</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {[
            { href: "/dashboard/formations", label: isStaff ? "Gérer les formations" : "Mes formations", icon: BookOpen },
            { href: "/dashboard/auto-trading", label: isStaff ? "Gérer l'auto-trading" : "Mon auto-trading", icon: KeyRound },
            { href: "/dashboard/bots", label: isStaff ? "Gérer les bots" : "Mes bots", icon: Bot },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              <link.icon className="size-4 text-primary" />
              {link.label}
              <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ))}
          {!isStaff && (
            <SubmitReviewDialog
              trigger={
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <MessageSquarePlus className="size-4 text-primary" />
                  Laisser un avis
                </button>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
