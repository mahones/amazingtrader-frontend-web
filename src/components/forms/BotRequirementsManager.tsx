"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractApiError } from "@/lib/api/client";
import {
  createAdminBotRequirement,
  deleteAdminBotRequirement,
  updateAdminBotRequirement,
} from "@/lib/api/admin";
import type { BotRequirement } from "@/types/bot";

export function BotRequirementsManager({
  botId,
  requirements,
  onChange,
}: {
  botId: number;
  requirements: BotRequirement[];
  onChange: (next: BotRequirement[]) => void;
}) {
  const [label, setLabel] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    setPending(true);
    setError(null);
    try {
      const created = await createAdminBotRequirement(botId, {
        label,
        position: requirements.length,
      });
      onChange([...requirements, created]);
      setLabel("");
    } catch (err) {
      setError(extractApiError(err, "Impossible d'ajouter l'exigence."));
    } finally {
      setPending(false);
    }
  }

  async function handleSave(id: number) {
    setPending(true);
    setError(null);
    try {
      const updated = await updateAdminBotRequirement(id, { label: editingLabel });
      onChange(requirements.map((r) => (r.id === id ? updated : r)));
      setEditingId(null);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer l'exigence."));
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id: number) {
    await deleteAdminBotRequirement(id);
    onChange(requirements.filter((r) => r.id !== id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exigences et recommandations ({requirements.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="divide-y divide-border">
          {requirements.map((req) =>
            editingId === req.id ? (
              <li key={req.id} className="flex items-center gap-2 py-2">
                <Input
                  value={editingLabel}
                  onChange={(e) => setEditingLabel(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" disabled={pending} onClick={() => handleSave(req.id)}>
                  Enregistrer
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>
                  Annuler
                </Button>
              </li>
            ) : (
              <li key={req.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span>{req.label}</span>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(req.id);
                      setEditingLabel(req.label);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(req.id)}>
                    Supprimer
                  </Button>
                </div>
              </li>
            )
          )}
          {requirements.length === 0 && (
            <p className="py-2 text-sm text-muted-foreground">Aucune exigence pour le moment.</p>
          )}
        </ul>

        <form onSubmit={handleAdd} className="flex items-end gap-2 border-t border-border pt-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="new-requirement">Nouvelle exigence</Label>
            <Input
              id="new-requirement"
              placeholder="Ex : Dépôt minimum : 200 $"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={pending || !label.trim()}>
            Ajouter
          </Button>
        </form>
        {error && <Alert variant="error">{error}</Alert>}
      </CardContent>
    </Card>
  );
}
