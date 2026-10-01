"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StringListEditor } from "@/components/forms/StringListEditor";
import { extractApiError } from "@/lib/api/client";
import { createAdminVipFormation, updateAdminVipFormation } from "@/lib/api/admin";
import type { VipFormation } from "@/types/vipFormation";

export function VipFormationForm({
  vipFormation,
  onSaved,
}: {
  vipFormation?: VipFormation;
  onSaved: (vipFormation: VipFormation) => void;
}) {
  const isEditing = Boolean(vipFormation);

  const [title, setTitle] = useState(vipFormation?.title ?? "");
  const [description, setDescription] = useState(vipFormation?.description ?? "");
  const [price, setPrice] = useState(vipFormation?.price?.toString() ?? "");
  const [highlights, setHighlights] = useState<string[]>(vipFormation?.highlights ?? []);
  const [note, setNote] = useState(vipFormation?.note ?? "");
  const [isPinned, setIsPinned] = useState(vipFormation?.is_pinned ?? false);
  const [pinnedLabel, setPinnedLabel] = useState(vipFormation?.pinned_label ?? "");
  const [isActive, setIsActive] = useState(vipFormation?.is_active ?? true);
  const [position, setPosition] = useState(vipFormation?.position?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const payload = {
      title,
      description,
      price: Number(price),
      highlights: highlights.map((h) => h.trim()).filter(Boolean),
      note: note.trim() || null,
      is_pinned: isPinned,
      pinned_label: isPinned ? pinnedLabel.trim() || null : null,
      is_active: isActive,
      ...(position ? { position: Number(position) } : {}),
    };

    try {
      const saved =
        isEditing && vipFormation
          ? await updateAdminVipFormation(vipFormation.id, payload)
          : await createAdminVipFormation(payload);
      onSaved(saved);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer la formation VIP."));
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Informations générales" : "Nouvelle formation VIP"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vip-title">Titre</Label>
            <Input id="vip-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vip-description">Petite description</Label>
            <Textarea
              id="vip-description"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vip-price">Prix ($)</Label>
              <Input
                id="vip-price"
                type="number"
                min="0"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vip-position">Ordre d&apos;affichage</Label>
              <Input
                id="vip-position"
                type="number"
                min="1"
                placeholder="Laissé vide = ajouté à la fin"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
          </div>

          <StringListEditor
            label="Grandes lignes (points clés)"
            items={highlights}
            onChange={setHighlights}
            placeholder="ex. Suivi individuel & coaching sur-mesure"
          />

          <div className="space-y-2">
            <Label htmlFor="vip-note">Note / avertissement (optionnel)</Label>
            <Textarea
              id="vip-note"
              rows={2}
              placeholder="ex. Ne convient pas aux débutants."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="vip-pinned" checked={isPinned} onCheckedChange={setIsPinned} />
            <Label htmlFor="vip-pinned">Épinglée (badge mis en avant)</Label>
          </div>

          {isPinned && (
            <div className="space-y-2">
              <Label htmlFor="vip-pinned-label">Texte du badge</Label>
              <Input
                id="vip-pinned-label"
                placeholder="ex. PLUS POPULAIRE"
                value={pinnedLabel}
                onChange={(e) => setPinnedLabel(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <Switch id="vip-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="vip-active">Active (visible sur le site)</Label>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer la formation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
