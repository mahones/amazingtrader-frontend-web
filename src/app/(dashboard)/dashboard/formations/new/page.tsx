"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRequireRole } from "@/hooks/useRequireRole";
import { createAdminCourse, createAdminLesson } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { LessonDraftManager } from "@/components/forms/LessonDraftManager";
import type { LessonDraft } from "@/components/forms/LessonFields";

export default function NewCoursePage() {
  useRequireRole(["admin", "developer"]);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("beginner");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("99");
  const [durationMinutes, setDurationMinutes] = useState("120");
  const [lessons, setLessons] = useState<LessonDraft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const course = await createAdminCourse({
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description,
        level: level as "beginner" | "intermediate" | "advanced",
        category,
        price: Number(price),
        duration_minutes: Number(durationMinutes),
        is_published: true,
      });

      for (const [index, lesson] of lessons.entries()) {
        await createAdminLesson(course.id, {
          title: lesson.title,
          slug: `${lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
          position: index,
          description: lesson.description,
          video_provider: lesson.video_id ? "vimeo" : null,
          video_id: lesson.video_id || null,
          is_preview: lesson.is_preview,
        });
      }

      router.push(`/dashboard/formations/${course.id}`);
    } catch (err) {
      setError(extractApiError(err, "Impossible de créer la formation. Vérifiez les champs (le slug doit être unique)."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Nouvelle formation</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="new-course-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                placeholder="auto-généré si laissé vide"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Niveau</Label>
                <Select value={level} onValueChange={(value) => value && setLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leçons ({lessons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <LessonDraftManager lessons={lessons} onChange={setLessons} />
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" form="new-course-form" disabled={pending}>
        {pending ? "Création..." : "Créer la formation"}
      </Button>
    </div>
  );
}
