"use client";

import { useState } from "react";
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
import { createAdminTradingBot, updateAdminTradingBot } from "@/lib/api/admin";
import type { TradingBot } from "@/types/bot";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BotForm({ bot, onSaved }: { bot?: TradingBot; onSaved: (bot: TradingBot) => void }) {
  const isEditing = Boolean(bot);

  const [name, setName] = useState(bot?.name ?? "");
  const [slug, setSlug] = useState(bot?.slug ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState(bot?.description ?? "");
  const [excerpt, setExcerpt] = useState(bot?.excerpt ?? "");
  const [strategySummary, setStrategySummary] = useState(bot?.strategy_summary ?? "");
  const [pairsTraded, setPairsTraded] = useState((bot?.pairs_traded ?? []).join(", "));
  const [managedCapital, setManagedCapital] = useState(bot?.managed_capital?.toString() ?? "");
  const [isActive, setIsActive] = useState(bot?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug || slugify(name));
    formData.append("description", description);
    if (excerpt) formData.append("excerpt", excerpt);
    if (strategySummary) formData.append("strategy_summary", strategySummary);
    pairsTraded
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((pair) => formData.append("pairs_traded[]", pair));
    if (managedCapital) formData.append("managed_capital", managedCapital);
    formData.append("is_active", isActive ? "1" : "0");
    if (imageFile) formData.append("image", imageFile);
    if (previewImageFile) formData.append("preview_image_file", previewImageFile);

    try {
      const saved =
        isEditing && bot
          ? await updateAdminTradingBot(bot.id, formData)
          : await createAdminTradingBot(formData);
      onSaved(saved);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer le bot."));
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Informations générales" : "Nouveau bot"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Nom</Label>
            <Input id="bot-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-slug">Slug (URL)</Label>
            <Input
              id="bot-slug"
              placeholder="auto-généré si laissé vide"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <ImageUploadInput
            id="bot-image"
            label="Image principale (page détail du bot)"
            value={imageFile}
            onChange={setImageFile}
            existingUrl={bot?.image_url}
          />

          <div className="space-y-2">
            <Label>Description (page détail du bot)</Label>
            <RichTextEditor value={description} onChange={setDescription} />
          </div>

          <ImageUploadInput
            id="bot-preview-image"
            label="Image de la carte (liste des bots)"
            value={previewImageFile}
            onChange={setPreviewImageFile}
            existingUrl={bot?.preview_image}
          />

          <div className="space-y-2">
            <Label htmlFor="bot-excerpt">Extrait (carte, liste des bots)</Label>
            <Textarea
              id="bot-excerpt"
              rows={2}
              maxLength={500}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-strategy">Résumé de la stratégie</Label>
            <Textarea
              id="bot-strategy"
              rows={3}
              value={strategySummary}
              onChange={(e) => setStrategySummary(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-pairs">Paires / actifs tradés (séparés par des virgules)</Label>
            <Input
              id="bot-pairs"
              placeholder="EUR/USD, XAU/USD, BTC/USD"
              value={pairsTraded}
              onChange={(e) => setPairsTraded(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-managed-capital">Capital géré ($)</Label>
            <Input
              id="bot-managed-capital"
              type="number"
              min="0"
              step="0.01"
              value={managedCapital}
              onChange={(e) => setManagedCapital(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="bot-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="bot-active">Actif (visible sur le site)</Label>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer le bot"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
