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
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { ImageUploadInput } from "@/components/forms/ImageUploadInput";
import { extractApiError } from "@/lib/api/client";
import { createAdminPost, deleteAdminPost, updateAdminPost } from "@/lib/api/admin";
import type { Post } from "@/types/post";

const CATEGORIES = ["Forex", "Crypto", "Bourse", "Analyse technique"];

export function ArticleForm({ post }: { post?: Post }) {
  const router = useRouter();
  const isEditing = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [category, setCategory] = useState(post?.category ?? CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [content, setContent] = useState(post?.content ?? "");
  const [isPublished, setIsPublished] = useState(post?.is_published ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append(
      "slug",
      slug || title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-")
    );
    if (category) formData.append("category", category);
    if (excerpt) formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("is_published", isPublished ? "1" : "0");
    if (coverImageFile) formData.append("cover_image", coverImageFile);

    try {
      if (isEditing && post) {
        await updateAdminPost(post.id, formData);
      } else {
        await createAdminPost(formData);
      }
      router.push("/dashboard/articles");
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer l'article."));
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!post) return;
    if (!window.confirm("Supprimer définitivement cet article ?")) return;
    await deleteAdminPost(post.id);
    router.push("/dashboard/articles");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isEditing ? "Modifier l'article" : "Nouvel article"}</h1>
        {isEditing && (
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contenu de l&apos;article</CardTitle>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <ImageUploadInput
                id="cover"
                label="Image de couverture"
                value={coverImageFile}
                onChange={setCoverImageFile}
                existingUrl={post?.cover_image_url}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Extrait (résumé court)</Label>
              <Textarea
                id="excerpt"
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Contenu</Label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={isPublished} onCheckedChange={setIsPublished} id="published" />
              <Label htmlFor="published">Publié (visible sur le site)</Label>
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Publier l'article"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
