"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Bot, KeyRound, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { fetchMyEnrollments } from "@/lib/api/courses";
import { fetchMyLicenses } from "@/lib/api/licenses";
import { fetchMyBotAssignments } from "@/lib/api/bots";
import { fetchAdminCourses, fetchAdminLicensePlans, fetchAdminUsers } from "@/lib/api/admin";

export default function DashboardOverviewPage() {
  const { user, isStaff } = useAuth();
  const [stats, setStats] = useState<{ label: string; value: number; icon: typeof BookOpen }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (isStaff) {
        const [courses, plans, users] = await Promise.all([
          fetchAdminCourses(),
          fetchAdminLicensePlans(),
          fetchAdminUsers(),
        ]);
        setStats([
          { label: "Formations publiées", value: courses.length, icon: BookOpen },
          { label: "Licences créées", value: plans.length, icon: KeyRound },
          { label: "Utilisateurs", value: users.length, icon: Users },
        ]);
      } else {
        const [enrollments, licenses, bots] = await Promise.all([
          fetchMyEnrollments(),
          fetchMyLicenses(),
          fetchMyBotAssignments(),
        ]);
        setStats([
          { label: "Mes formations", value: enrollments.length, icon: BookOpen },
          { label: "Mes licences", value: licenses.length, icon: KeyRound },
          { label: "Mes bots", value: bots.length, icon: Bot },
        ]);
      }
      setLoading(false);
    }
    load();
  }, [isStaff]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bonjour, <span className="text-primary">{user?.name}</span></h1>
        <p className="text-muted-foreground">
          {isStaff
            ? "Voici un aperçu de l'activité de la plateforme."
            : "Voici un aperçu de votre activité."}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6 text-muted-foreground">Chargement...</CardContent>
              </Card>
            ))
          : stats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className="size-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accès rapides</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/dashboard/formations" className="text-sm font-medium text-primary hover:underline">
            {isStaff ? "Gérer les formations" : "Mes formations"}
          </Link>
          <Link href="/dashboard/licences" className="text-sm font-medium text-primary hover:underline">
            {isStaff ? "Gérer les licences" : "Mes licences"}
          </Link>
          <Link href="/dashboard/bots" className="text-sm font-medium text-primary hover:underline">
            {isStaff ? "Gérer les bots" : "Mes bots"}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
