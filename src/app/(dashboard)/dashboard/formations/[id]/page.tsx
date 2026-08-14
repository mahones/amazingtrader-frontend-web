"use client";

import { use, useEffect, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { EMPTY_LESSON_DRAFT, LessonFields, type LessonDraft } from "@/components/forms/LessonFields";
import { useAuth } from "@/context/AuthContext";
import { fetchMyEnrollment, updateEnrollmentProgress } from "@/lib/api/courses";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import {
  fetchAdminCourse,
  createAdminLesson,
  updateAdminLesson,
  deleteAdminLesson,
} from "@/lib/api/admin";
import type { Enrollment, Lesson } from "@/types/course";
import type { Course } from "@/types/course";

export default function FormationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isStaff } = useAuth();

  if (isStaff) {
    return <AdminCourseView courseId={Number(id)} />;
  }

  return <StudentCourseView enrollmentId={Number(id)} />;
}

function StudentCourseView({ enrollmentId }: { enrollmentId: number }) {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    fetchMyEnrollment(enrollmentId).then((e) => {
      setEnrollment(e);
      setActiveLesson(e.course.lessons?.[0] ?? null);
    });
  }, [enrollmentId]);

  if (!enrollment) return <p className="text-muted-foreground">Chargement...</p>;

  const completed = new Set(enrollment.completed_lessons ?? []);
  const lessons = enrollment.course.lessons ?? [];
  const activeIndex = lessons.findIndex((lesson) => lesson.id === activeLesson?.id);
  const previousLesson = activeIndex > 0 ? lessons[activeIndex - 1] : null;
  const nextLesson =
    activeIndex >= 0 && activeIndex < lessons.length - 1 ? lessons[activeIndex + 1] : null;

  async function toggleComplete(lessonId: number) {
    if (!enrollment) return;
    const next = new Set(completed);
    const wasCompleted = next.has(lessonId);
    if (wasCompleted) next.delete(lessonId);
    else next.add(lessonId);

    const total = enrollment.course.lessons?.length ?? 1;
    const progress = Math.round((next.size / total) * 100);

    const updated = await updateEnrollmentProgress(enrollment.id, {
      completed_lessons: Array.from(next),
      progress_percent: progress,
    });
    setEnrollment(updated);

    if (!wasCompleted) {
      toast.success(
        progress >= 100 ? "Félicitations, vous avez terminé la formation !" : "Leçon marquée comme terminée."
      );
      if (nextLesson) setActiveLesson(nextLesson);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold">{enrollment.course.title}</h1>
        <VideoPlayer
          provider={activeLesson?.video_provider ?? null}
          videoId={activeLesson?.video_id ?? null}
          embedUrl={activeLesson?.embed_url}
        />
        {activeLesson && (
          <div>
            <h2 className="text-lg font-semibold">{activeLesson.title}</h2>
            {activeLesson.description && (
              <div
                className="mt-1 space-y-2 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(activeLesson.description) }}
              />
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                variant={completed.has(activeLesson.id) ? "secondary" : "default"}
                onClick={() => toggleComplete(activeLesson.id)}
              >
                {completed.has(activeLesson.id)
                  ? "Marquée comme terminée ✓"
                  : nextLesson
                    ? "Terminer la leçon"
                    : "Terminer le cours"}
              </Button>
              <Button
                variant="outline"
                disabled={!previousLesson}
                onClick={() => previousLesson && setActiveLesson(previousLesson)}
              >
                <ChevronLeft className="size-4" />
                Leçon précédente
              </Button>
              <Button
                variant="outline"
                disabled={!nextLesson}
                onClick={() => nextLesson && setActiveLesson(nextLesson)}
              >
                Leçon suivante
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leçons ({enrollment.progress_percent}%)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {enrollment.course.lessons?.map((lesson) => (
              <li key={lesson.id}>
                <button
                  onClick={() => setActiveLesson(lesson)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-accent ${
                    activeLesson?.id === lesson.id ? "bg-accent" : ""
                  }`}
                >
                  <span>{lesson.title}</span>
                  {completed.has(lesson.id) && <Badge variant="secondary">Terminée</Badge>}
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminCourseView({ courseId }: { courseId: number }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [draft, setDraft] = useState<LessonDraft>(EMPTY_LESSON_DRAFT);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);

  async function reload() {
    const refreshed = await fetchAdminCourse(courseId);
    setCourse(refreshed);
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  if (!course) return <p className="text-muted-foreground">Chargement...</p>;

  async function handleAddLesson(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await createAdminLesson(courseId, {
        title: draft.title,
        slug: `${draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${(course?.lessons?.length ?? 0) + 1}`,
        position: course?.lessons?.length ?? 0,
        description: draft.description,
        video_provider: draft.video_id ? "vimeo" : null,
        video_id: draft.video_id || null,
        is_preview: draft.is_preview,
      });
      await reload();
      setDraft(EMPTY_LESSON_DRAFT);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'ajouter la leçon."));
    } finally {
      setPending(false);
    }
  }

  async function handleDeleteLesson(lessonId: number) {
    await deleteAdminLesson(lessonId);
    await reload();
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <Badge variant={course.is_published ? "default" : "secondary"}>
            {course.is_published ? "Publiée" : "Brouillon"}
          </Badge>
        </div>
        <p className="mt-1 text-muted-foreground">
          {course.enrollment_count ?? 0} personne(s) inscrite(s)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leçons ({course.lessons?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="divide-y divide-border">
            {course.lessons?.map((lesson) =>
              editingLessonId === lesson.id ? (
                <LessonEditRow
                  key={lesson.id}
                  lesson={lesson}
                  onCancel={() => setEditingLessonId(null)}
                  onSaved={async () => {
                    setEditingLessonId(null);
                    await reload();
                  }}
                />
              ) : (
                <li key={lesson.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span>{lesson.title}</span>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingLessonId(lesson.id)}>
                      Modifier
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteLesson(lesson.id)}>
                      Supprimer
                    </Button>
                  </div>
                </li>
              )
            )}
          </ul>

          <form onSubmit={handleAddLesson} className="space-y-4 border-t border-border pt-4">
            <p className="text-sm font-medium">Ajouter une leçon</p>
            <LessonFields value={draft} onChange={setDraft} idPrefix="new-lesson" />
            {error && <Alert variant="error">{error}</Alert>}
            <Button type="submit" disabled={pending}>
              {pending ? "Ajout..." : "Ajouter la leçon"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function LessonEditRow({
  lesson,
  onCancel,
  onSaved,
}: {
  lesson: Lesson;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<LessonDraft>({
    title: lesson.title,
    video_id: lesson.video_id ?? "",
    description: lesson.description ?? "",
    is_preview: lesson.is_preview,
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await updateAdminLesson(lesson.id, {
        title: draft.title,
        slug: lesson.slug,
        description: draft.description,
        video_provider: draft.video_id ? "vimeo" : null,
        video_id: draft.video_id || null,
        is_preview: draft.is_preview,
      });
      onSaved();
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer la leçon."));
    } finally {
      setPending(false);
    }
  }

  return (
    <li className="py-4">
      <form onSubmit={handleSave} className="space-y-4">
        <LessonFields value={draft} onChange={setDraft} idPrefix={`lesson-${lesson.id}`} />
        {error && <Alert variant="error">{error}</Alert>}
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Enregistrement..." : "Enregistrer"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </form>
    </li>
  );
}
