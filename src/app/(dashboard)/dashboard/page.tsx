"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Bot,
  KeyRound,
  RefreshCw,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ProgressRing } from "@/components/ui/progress-ring";
import { AnnouncementsBanner } from "@/components/announcements/AnnouncementsBanner";
import { cn } from "@/lib/utils";
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
} from "@/lib/api/admin";

type Stat = {
  label: string;
  value: number;
  icon: typeof BookOpen;
  href?: string;
  sublabel?: string;
  attention?: boolean;
};

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

function StatTile({ stat, max }: { stat: Stat; max: number }) {
  const content = (
    <Card
      className={cn(
        "h-full transition-all duration-200",
        stat.href && "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 hover:ring-primary/40"
      )}
    >
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-xl",
              stat.attention ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
            )}
          >
            <stat.icon className="size-5" />
          </div>
          {stat.href && (
            <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5" />
          )}
        </div>

        <div className="mt-auto">
          <div className="font-heading text-3xl font-bold tabular-nums">
            <AnimatedNumber value={stat.value} />
          </div>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
          {stat.sublabel && <p className="mt-0.5 text-xs text-muted-foreground/70">{stat.sublabel}</p>}
        </div>

        <MiniBar value={stat.value} max={max} />
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
      <CardContent className="flex flex-col gap-4">
        <Skeleton className="size-11 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-1.5 w-full rounded-full" />
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

  useEffect(() => {
    async function load() {
      if (isStaff) {
        const [courses, plans, users, pendingActivations, pendingCredentialsChanges] = await Promise.all([
          fetchAdminCourses(),
          fetchAdminLicensePlans(),
          fetchAdminUsers(),
          fetchPendingActivationCount(),
          fetchPendingCredentialsChangeCount(),
        ]);
        setStats([
          { label: "Formations publiées", value: courses.length, icon: BookOpen },
          { label: "Auto-trading créés", value: plans.length, icon: KeyRound },
          { label: "Utilisateurs", value: users.length, icon: Users },
          {
            label: "Attente d'activation",
            value: pendingActivations,
            icon: AlertTriangle,
            href: "/dashboard/users?license_status=pending",
            sublabel: "À traiter",
            attention: pendingActivations > 0,
          },
          {
            label: "Modifications à approuver",
            value: pendingCredentialsChanges,
            icon: RefreshCw,
            href: "/dashboard/users?license_status=pending_changes",
            sublabel: "À traiter",
            attention: pendingCredentialsChanges > 0,
          },
        ]);
      } else {
        const [enrollments, licenses, bots] = await Promise.all([
          fetchMyEnrollments(),
          fetchMyLicenses(),
          fetchMyBotAssignments(),
        ]);
        const activeLicenses = licenses.filter((l) => l.is_activated).length;
        const activeBots = bots.filter((b) => b.status === "active").length;
        const avg =
          enrollments.length > 0
            ? enrollments.reduce((sum, e) => sum + e.progress_percent, 0) / enrollments.length
            : 0;
        setStats([
          {
            label: "Mes formations",
            value: enrollments.length,
            icon: BookOpen,
            href: "/dashboard/formations",
          },
          {
            label: "Mon auto-trading",
            value: licenses.length,
            icon: KeyRound,
            href: "/dashboard/auto-trading",
            sublabel: licenses.length > 0 ? `${activeLicenses} active${activeLicenses > 1 ? "s" : ""}` : undefined,
          },
          {
            label: "Mes bots",
            value: bots.length,
            icon: Bot,
            href: "/dashboard/bots",
            sublabel: bots.length > 0 ? `${activeBots} actif${activeBots > 1 ? "s" : ""}` : undefined,
          },
        ]);
        setAvgProgress(avg);
        setEnrollmentCount(enrollments.length);
      }
      setLoading(false);
    }
    load();
  }, [isStaff]);

  const max = useMemo(() => Math.max(1, ...stats.map((s) => s.value)), [stats]);

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
          isStaff ? "sm:grid-cols-2 lg:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {loading ? (
          <>
            {Array.from({ length: isStaff ? 5 : 3 }).map((_, i) => (
              <StatTileSkeleton key={i} />
            ))}
            {!isStaff && <StatTileSkeleton />}
          </>
        ) : (
          <>
            {stats.map((stat) => (
              <StatTile key={stat.label} stat={stat} max={max} />
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
        </CardContent>
      </Card>
    </div>
  );
}
