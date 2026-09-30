"use client";

import { useEffect, useState } from "react";
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
import { createAdminBarronsChallenge, fetchAdminBrokers, updateAdminBarronsChallenge } from "@/lib/api/admin";
import type { BarronsChallenge } from "@/types/barronsChallenge";
import type { Broker } from "@/types/broker";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toggleId(ids: number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((existing) => existing !== id) : [...ids, id];
}

export function BarronsChallengeForm({
  challenge,
  onSaved,
}: {
  challenge?: BarronsChallenge;
  onSaved: (challenge: BarronsChallenge) => void;
}) {
  const isEditing = Boolean(challenge);

  const [name, setName] = useState(challenge?.name ?? "");
  const [slug, setSlug] = useState(challenge?.slug ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState(challenge?.description ?? "");
  const [excerpt, setExcerpt] = useState(challenge?.excerpt ?? "");
  const [strategySummary, setStrategySummary] = useState(challenge?.strategy_summary ?? "");
  const [pairsTraded, setPairsTraded] = useState((challenge?.pairs_traded ?? []).join(", "));
  const [managedCapital, setManagedCapital] = useState(challenge?.managed_capital?.toString() ?? "");
  const [position, setPosition] = useState(challenge?.position?.toString() ?? "");
  const [isActive, setIsActive] = useState(challenge?.is_active ?? true);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [brokerIds, setBrokerIds] = useState<number[]>(challenge?.brokers?.map((b) => b.id) ?? []);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetchAdminBrokers().then(setBrokers);
  }, []);

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
    if (position) formData.append("position", position);
    formData.append("is_active", isActive ? "1" : "0");
    brokerIds.forEach((id) => formData.append("broker_ids[]", String(id)));
    if (imageFile) formData.append("image", imageFile);
    if (previewImageFile) formData.append("preview_image_file", previewImageFile);

    try {
      const saved =
        isEditing && challenge
          ? await updateAdminBarronsChallenge(challenge.id, formData)
          : await createAdminBarronsChallenge(formData);
      onSaved(saved);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer le challenge."));
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Informations générales" : "Nouveau challenge"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="barrons-name">Nom</Label>
            <Input id="barrons-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="barrons-slug">Slug (URL)</Label>
            <Input
              id="barrons-slug"
              placeholder="auto-généré si laissé vide"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <ImageUploadInput
            id="barrons-image"
            label="Image principale (page détail du challenge)"
            value={imageFile}
            onChange={setImageFile}
            existingUrl={challenge?.image_url}
          />

          <div className="space-y-2">
            <Label>Description (page détail du challenge)</Label>
            <RichTextEditor value={description} onChange={setDescription} />
          </div>

          <ImageUploadInput
            id="barrons-preview-image"
            label="Image de la carte (liste des challenges)"
            value={previewImageFile}
            onChange={setPreviewImageFile}
            existingUrl={challenge?.preview_image}
          />

          <div className="space-y-2">
            <Label htmlFor="barrons-excerpt">Extrait (carte, liste des challenges)</Label>
            <Textarea
              id="barrons-excerpt"
              rows={2}
              maxLength={500}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="barrons-strategy">Résumé de la stratégie</Label>
            <Textarea
              id="barrons-strategy"
              rows={3}
              value={strategySummary}
              onChange={(e) => setStrategySummary(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="barrons-pairs">Paires / actifs tradés (séparés par des virgules)</Label>
            <Input
              id="barrons-pairs"
              placeholder="EUR/USD, XAU/USD, BTC/USD"
              value={pairsTraded}
              onChange={(e) => setPairsTraded(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="barrons-managed-capital">Capital géré ($)</Label>
            <Input
              id="barrons-managed-capital"
              type="number"
              min="0"
              step="0.01"
              value={managedCapital}
              onChange={(e) => setManagedCapital(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Courtiers recommandés</Label>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3">
              {brokers.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun courtier enregistré.</p>
              )}
              {brokers.map((broker) => (
                <label key={broker.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-primary"
                    checked={brokerIds.includes(broker.id)}
                    onChange={() => setBrokerIds((ids) => toggleId(ids, broker.id))}
                  />
                  {broker.name}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="barrons-position">Ordre d&apos;affichage</Label>
            <Input
              id="barrons-position"
              type="number"
              min="1"
              placeholder="Laissé vide = ajouté à la fin"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="barrons-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="barrons-active">Actif (visible sur le site)</Label>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer le challenge"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
