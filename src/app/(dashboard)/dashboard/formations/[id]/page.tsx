"use client";

import { use, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { useAuth } from "@/context/AuthContext";
import { fetchMyEnrollment, updateEnrollmentProgress } from "@/lib/api/courses";
import { extractApiError } from "@/lib/api/client";
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

  async function toggleComplete(lessonId: number) {
    if (!enrollment) return;
    const next = new Set(completed);
    if (next.has(lessonId)) next.delete(lessonId);
    else next.add(lessonId);

    const total = enrollment.course.lessons?.length ?? 1;
    const progress = Math.round((next.size / total) * 100);

    const updated = await updateEnrollmentProgress(enrollment.id, {
      completed_lessons: Array.from(next),
      progress_percent: progress,
    });
    setEnrollment(updated);
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
            <p className="mt-1 text-sm text-muted-foreground">{activeLesson.description}</p>
            <Button
              variant={completed.has(activeLesson.id) ? "secondary" : "default"}
              className="mt-3"
              onClick={() => toggleComplete(activeLesson.id)}
            >
              {completed.has(activeLesson.id) ? "Marquée comme terminée ✓" : "Marquer comme terminée"}
            </Button>
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
  const [title, setTitle] = useState("");
  const [videoId, setVideoId] = useState("");
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
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        video_provider: "vimeo",
        video_id: videoId,
        is_preview: false,
      });
      await reload();
      setTitle("");
      setVideoId("");
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

          <form onSubmit={handleAddLesson} className="grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="lesson-title">Titre de la leçon</Label>
              <Input id="lesson-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-video">ID vidéo Vimeo</Label>
              <Input id="lesson-video" value={videoId} onChange={(e) => setVideoId(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive sm:col-span-3">{error}</p>}
            <Button type="submit" disabled={pending} className="sm:col-span-3">
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
  const [title, setTitle] = useState(lesson.title);
  const [videoId, setVideoId] = useState(lesson.video_id ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await updateAdminLesson(lesson.id, {
        title,
        slug: lesson.slug,
        video_provider: lesson.video_provider ?? "vimeo",
        video_id: videoId,
        is_preview: lesson.is_preview,
      });
      onSaved();
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer la leçon."));
    } finally {
      setPending(false);
    }
  }

  return (
    <li className="py-2">
      <form onSubmit={handleSave} className="grid gap-2 sm:grid-cols-3">
        <Input
          className="sm:col-span-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          placeholder="ID vidéo Vimeo"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
        />
        {error && <p className="text-sm text-destructive sm:col-span-3">{error}</p>}
        <div className="flex gap-2 sm:col-span-3">
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
