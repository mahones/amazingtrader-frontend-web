"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Bot,
  KeyRound,
  Landmark,
  MessageSquarePlus,
  PlayCircle,
  Plus,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  fetchPendingActivationCount,
  fetchPendingCredentialsChangeCount,
  fetchPendingPartnerApplicationCount,
  fetchPendingWithdrawalCount,
} from "@/lib/api/admin";
import {
  fetchAdminKpiTrends,
  fetchAdminOverviewStats,
  fetchAdminLicenseDistribution,
  fetchAdminRecentActivity,
  fetchAdminRegistrationStats,
  fetchAdminRevenueStats,
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
  /** Real cumulative history (one value per day); no sparkline when absent. */
  series?: number[];
};

function Sparkline({ series, tone = "primary" }: { series: number[]; tone?: "primary" | "destructive" }) {
  const width = 100;
  const height = 28;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const coords = series.map((v, i) => ({
    x: (i / (series.length - 1)) * width,
    // Flat series (no change over the window) sits on the midline.
    y: max === min ? height / 2 : height - 2 - ((v - min) / range) * (height - 4),
  }));
  const d = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x},${c.y}`).join(" ");

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

function StatTile({ stat }: { stat: Stat }) {
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
          {stat.series && stat.series.length > 1 && (
            <div className="w-20 shrink-0">
              <Sparkline series={stat.series} tone={stat.attention ? "destructive" : "primary"} />
            </div>
          )}
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

function EurekaProjectCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="size-4 text-primary" />
          Le projet Eureka
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Relevez le Challenge Eureka : des stratégies de trading gérées, des licences et un accompagnement pour
          atteindre vos objectifs.
        </p>
        <div className="mt-auto flex flex-wrap gap-3">
          <Button render={<Link href="/challenge-eureka">Découvrir le challenge</Link>} />
          <Button variant="outline" render={<Link href="/dashboard/eureka-challenges">Mes challenges</Link>} />
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
          overview,
          pendingActivations,
          pendingCredentialsChanges,
          pendingWithdrawals,
          pendingPartnerApplications,
          kpiTrends,
        ] = await Promise.all([
          fetchAdminOverviewStats(),
          fetchPendingActivationCount(),
          fetchPendingCredentialsChangeCount(),
          fetchPendingWithdrawalCount(),
          fetchPendingPartnerApplicationCount(),
          fetchAdminKpiTrends(),
        ]);

        setStats([
          {
            label: "Formations publiées",
            value: overview.courses.published,
            href: "/dashboard/formations",
            caption: `sur ${overview.courses.total} au total`,
            trendPercent: kpiTrends.formations,
            series: overview.courses.series,
          },
          {
            label: "Auto-trading créés",
            value: overview.plans.total,
            href: "/dashboard/auto-trading",
            caption: `${overview.plans.active} actif${overview.plans.active > 1 ? "s" : ""}`,
            trendPercent: kpiTrends.auto_trading,
            series: overview.plans.series,
          },
          {
            label: "Utilisateurs",
            value: overview.users.total,
            href: "/dashboard/users",
            caption: `+${overview.users.new_this_week} cette semaine`,
            trendPercent: kpiTrends.users,
            series: overview.users.series,
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
        const [enrollments, kpiTrends] = await Promise.all([fetchMyEnrollments(), fetchMyKpiTrends()]);
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
    if (!isStaff) return;
    async function load() {
      setTrendLoading(true);
      const points = await fetchAdminRevenueStats(period);
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
    if (!isStaff) return;
    async function load() {
      setMonthlyLoading(true);
      const points = await fetchAdminRegistrationStats();
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

  const trendHeadline = formatCurrency(trendPoints.reduce((sum, p) => sum + p.value, 0));

  const trendChangePercent = useMemo(() => {
    if (trendPoints.length < 2) return null;
    const deltas = trendPoints.map((p) => p.value);
    const mid = Math.floor(deltas.length / 2);
    const firstHalf = deltas.slice(0, mid).reduce((sum, v) => sum + v, 0);
    const secondHalf = deltas.slice(mid).reduce((sum, v) => sum + v, 0);
    if (firstHalf === 0) return null;
    return ((secondHalf - firstHalf) / Math.abs(firstHalf)) * 100;
  }, [trendPoints]);

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

      {isStaff ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 7 }).map((_, i) => <StatTileSkeleton key={i} />)
              : stats.map((stat) => <StatTile key={stat.label} stat={stat} />)}
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TrendChartCard
                title={`Revenus des ${period} derniers jours`}
                href="/dashboard/orders"
                points={trendPoints}
                loading={trendLoading}
                period={period}
                onPeriodChange={setPeriod}
                headline={trendHeadline}
                changePercent={trendChangePercent}
                changeLabel="sur la période"
                emptyLabel="Aucun revenu sur la période"
              />
            </div>
            <LicenseDistributionCard
              title="Répartition des licences"
              points={licensePoints}
              loading={licenseLoading}
              emptyLabel="Aucune licence active"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <MonthlyBarChart
              title="Inscriptions par mois"
              href="/dashboard/users"
              points={monthlyPoints}
              loading={monthlyLoading}
              emptyLabel="Aucune inscription récente"
            />
            <ActivityFeedCard
              title="Activité récente"
              items={activity}
              loading={activityLoading}
              emptyLabel="Aucune activité récente"
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
              {loading ? (
                <>
                  <StatTileSkeleton />
                  <StatTileSkeleton />
                </>
              ) : (
                <>
                  {stats.map((stat) => (
                    <StatTile key={stat.label} stat={stat} />
                  ))}
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
                </>
              )}
            </div>
            <LicenseDistributionCard
              title="Mes licences"
              points={licensePoints}
              loading={licenseLoading}
              emptyLabel="Aucune licence active"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <EurekaProjectCard />
            <ActivityFeedCard
              title="Mes dernières activités"
              items={activity}
              loading={activityLoading}
              emptyLabel="Aucune activité récente"
            />
          </div>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Accès rapides</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {(isStaff
            ? [
                { href: "/dashboard/formations", label: "Gérer les formations", icon: BookOpen },
                { href: "/dashboard/auto-trading", label: "Gérer l'auto-trading", icon: KeyRound },
                { href: "/dashboard/bots", label: "Gérer les bots", icon: Bot },
                { href: "/dashboard/tutoriels/new", label: "Nouveau tutoriel", icon: Plus },
                { href: "/dashboard/tutoriels", label: "Tous les tutoriels", icon: PlayCircle },
              ]
            : [
                { href: "/brokers", label: "Courtiers recommandés", icon: Landmark },
                { href: "/tutoriels", label: "Tutoriels", icon: PlayCircle },
              ]
          ).map((link) => (
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
