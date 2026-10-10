"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YoutubePlayer } from "@/components/tutorials/YoutubePlayer";
import { extractApiError } from "@/lib/api/client";
import { createAdminTutorial, deleteAdminTutorial, updateAdminTutorial } from "@/lib/api/admin";
import { getYoutubeId } from "@/lib/youtube";
import type { Tutorial } from "@/types/tutorial";

export function TutorialForm({ tutorial }: { tutorial?: Tutorial }) {
  const router = useRouter();
  const isEditing = Boolean(tutorial);

  const [title, setTitle] = useState(tutorial?.title ?? "");
  const [slug, setSlug] = useState(tutorial?.slug ?? "");
  const [description, setDescription] = useState(tutorial?.description ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(tutorial?.youtube_url ?? "");
  const [isPublished, setIsPublished] = useState(tutorial?.is_published ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const payload = {
      title,
      slug:
        slug ||
        title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      description: description || null,
      youtube_url: youtubeUrl,
      is_published: isPublished,
    };

    try {
      if (isEditing && tutorial) {
        await updateAdminTutorial(tutorial.id, payload);
      } else {
        await createAdminTutorial(payload);
      }
      router.push("/dashboard/tutoriels");
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer le tutoriel."));
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!tutorial) return;
    if (!window.confirm("Supprimer définitivement ce tutoriel ?")) return;
    await deleteAdminTutorial(tutorial.id);
    router.push("/dashboard/tutoriels");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isEditing ? "Modifier le tutoriel" : "Nouveau tutoriel"}</h1>
        {isEditing && (
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contenu du tutoriel</CardTitle>
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

            <div className="space-y-2">
              <Label htmlFor="youtube">Lien YouTube</Label>
              <Input
                id="youtube"
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              {getYoutubeId(youtubeUrl) && <YoutubePlayer url={youtubeUrl} title={title || "Aperçu"} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={isPublished} onCheckedChange={setIsPublished} id="published" />
              <Label htmlFor="published">Publié (accessible via le lien)</Label>
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer le tutoriel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
