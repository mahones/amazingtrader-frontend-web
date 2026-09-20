"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { ImageUploadInput } from "@/components/forms/ImageUploadInput";
import { extractApiError } from "@/lib/api/client";
import { createAdminEvent, deleteAdminEvent, updateAdminEvent } from "@/lib/api/admin";
import type { Event } from "@/types/event";

function toDatetimeLocalValue(iso: string | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({ event }: { event?: Event }) {
  const router = useRouter();
  const isEditing = Boolean(event);

  const [title, setTitle] = useState(event?.title ?? "");
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [content, setContent] = useState(event?.content ?? "");
  const [startsAt, setStartsAt] = useState(toDatetimeLocalValue(event?.starts_at));
  const [location, setLocation] = useState(event?.location ?? "");
  const [meetingLink, setMeetingLink] = useState(event?.meeting_link ?? "");
  const [isPublished, setIsPublished] = useState(event?.is_published ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!location && !meetingLink) {
      setError("Renseignez le lieu de l'événement ou le lien de la réunion.");
      return;
    }

    setPending(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append(
      "slug",
      slug || title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-")
    );
    formData.append("content", content);
    formData.append("starts_at", startsAt);
    if (location) formData.append("location", location);
    if (meetingLink) formData.append("meeting_link", meetingLink);
    formData.append("is_published", isPublished ? "1" : "0");
    if (imageFile) formData.append("image", imageFile);

    try {
      if (isEditing && event) {
        await updateAdminEvent(event.id, formData);
      } else {
        await createAdminEvent(formData);
      }
      router.push("/dashboard/events");
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer l'événement."));
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!event) return;
    if (!window.confirm("Supprimer définitivement cet événement ?")) return;
    await deleteAdminEvent(event.id);
    router.push("/dashboard/events");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isEditing ? "Modifier l'événement" : "Nouvel événement"}</h1>
        {isEditing && (
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contenu de l&apos;événement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <ImageUploadInput
              id="image"
              label="Image de l'événement"
              value={imageFile}
              onChange={setImageFile}
              existingUrl={event?.image_url}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="starts_at">Date et heure</Label>
                <Input
                  id="starts_at"
                  type="datetime-local"
                  required
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lieu de l&apos;événement</Label>
                <Input
                  id="location"
                  placeholder="ex. Salle de conférence, Paris"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting_link">Lien de la réunion</Label>
              <Input
                id="meeting_link"
                type="url"
                placeholder="https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Renseignez le lieu ou le lien de la réunion (au moins un des deux).
              </p>
            </div>

            <div className="space-y-2">
              <Label>Contenu</Label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={isPublished} onCheckedChange={setIsPublished} id="published" />
              <Label htmlFor="published">Publié (visible dans le tableau de bord)</Label>
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Publier l'événement"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
