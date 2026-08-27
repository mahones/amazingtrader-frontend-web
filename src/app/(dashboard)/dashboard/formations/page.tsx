"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Plus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { fetchMyEnrollments } from "@/lib/api/courses";
import { deleteAdminCourse, fetchAdminCourses } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils";
import type { Enrollment } from "@/types/course";
import type { Course } from "@/types/course";

export default function DashboardFormationsPage() {
  const { isStaff } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null);
  const [adminCourses, setAdminCourses] = useState<Course[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isStaff) {
      fetchAdminCourses().then(setAdminCourses);
    } else {
      fetchMyEnrollments().then(setEnrollments);
    }
  }, [isStaff]);

  async function handleDeleteCourse(id: number) {
    if (!window.confirm("Supprimer définitivement cette formation ?")) return;
    setError(null);
    try {
      await deleteAdminCourse(id);
      setAdminCourses((prev) => prev?.filter((c) => c.id !== id) ?? prev);
    } catch (err) {
      setError(extractApiError(err, "Impossible de supprimer cette formation."));
    }
  }

  if (isStaff) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Formations</h1>
            <p className="text-muted-foreground">Gérez le catalogue de formations de la plateforme.</p>
          </div>
          <Button
            render={
              <Link href="/dashboard/formations/new">
                <Plus className="mr-1 size-4" /> Nouvelle formation
              </Link>
            }
          />
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <div className="grid gap-4">
          {adminCourses === null && <p className="text-muted-foreground">Chargement...</p>}
          {adminCourses?.length === 0 && <p className="text-muted-foreground">Aucune formation créée.</p>}
          {adminCourses?.map((course) => (
            <Card key={course.id}>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{course.title}</h3>
                    <Badge variant={course.is_published ? "default" : "secondary"}>
                      {course.is_published ? "Publiée" : "Brouillon"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatCurrency(course.price)} · {course.enrollment_count ?? 0} inscrits
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/formations/${course.slug}`}>Voir la page</Link>}
                  />
                  <Button variant="outline" size="sm" render={<Link href={`/dashboard/formations/${course.id}`}>Gérer</Link>} />
                  <Tooltip>
                    <TooltipTrigger render={<span tabIndex={course.has_active_subscribers ? 0 : undefined} />}>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={course.has_active_subscribers}
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        Supprimer
                      </Button>
                    </TooltipTrigger>
                    {course.has_active_subscribers && (
                      <TooltipContent>
                        Ce produit ne peut pas être supprimé car des utilisateurs y sont inscrits.
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mes formations</h1>
        <p className="text-muted-foreground">Reprenez vos formations là où vous vous êtes arrêté.</p>
      </div>

      <div className="grid gap-4">
        {enrollments === null && <p className="text-muted-foreground">Chargement...</p>}
        {enrollments?.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Vous n&apos;êtes inscrit à aucune formation pour le moment.{" "}
              <Link href="/formations" className="font-medium text-primary hover:underline">
                Découvrir les formations
              </Link>
            </CardContent>
          </Card>
        )}
        {enrollments?.map((enrollment) => (
          <Card key={enrollment.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{enrollment.course.title}</CardTitle>
                {enrollment.progress_percent >= 100 && (
                  <Badge className="border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-3" />
                    Terminé
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Progress value={enrollment.progress_percent} className="flex-1" />
                <span className="text-sm text-muted-foreground">{enrollment.progress_percent}%</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button render={<Link href={`/dashboard/formations/${enrollment.id}`}>Continuer la formation</Link>} />
                <Button
                  variant="outline"
                  render={<Link href={`/formations/${enrollment.course.slug}`}>Voir la page</Link>}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
