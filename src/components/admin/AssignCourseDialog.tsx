"use client";

import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { assignCoursesToUser, fetchAdminCourses } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import type { Course, Enrollment } from "@/types/course";

function toggleId(ids: number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

export function AssignCourseDialog({
  userId,
  enrolledCourseIds,
  onEnrollmentsAssigned,
}: {
  userId: number;
  enrolledCourseIds: number[];
  onEnrollmentsAssigned: (enrollments: Enrollment[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseIds, setCourseIds] = useState<number[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) fetchAdminCourses().then(setCourses);
  }, [open]);

  const availableCourses = courses.filter((course) => !enrolledCourseIds.includes(course.id));

  function reset() {
    setCourseIds([]);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (courseIds.length === 0) {
      setError("Sélectionnez au moins une formation.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const enrollments = await assignCoursesToUser(userId, courseIds);
      onEnrollmentsAssigned(enrollments);
      toast.success("Formation(s) assignée(s) avec succès.");
      setOpen(false);
      reset();
    } catch (err) {
      setError(extractApiError(err, "Impossible d'assigner ces formations."));
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={<Button variant="outline" />}>Assigner des formations</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assigner des formations</DialogTitle>
          <DialogDescription>
            La formation sera immédiatement débloquée dans l&apos;espace d&apos;apprentissage de l&apos;utilisateur.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border p-3">
            {availableCourses.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucune formation disponible à assigner.
              </p>
            )}
            {availableCourses.map((course) => (
              <label key={course.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={courseIds.includes(course.id)}
                  onChange={() => setCourseIds((ids) => toggleId(ids, course.id))}
                />
                {course.title}
              </label>
            ))}
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Attribution..." : "Assigner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
