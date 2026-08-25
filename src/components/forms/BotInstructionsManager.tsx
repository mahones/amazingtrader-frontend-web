"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractApiError } from "@/lib/api/client";
import {
  createAdminBotInstruction,
  deleteAdminBotInstruction,
  updateAdminBotInstruction,
} from "@/lib/api/admin";
import type { BotInstruction } from "@/types/bot";

export function BotInstructionsManager({
  botId,
  instructions,
  onChange,
}: {
  botId: number;
  instructions: BotInstruction[];
  onChange: (next: BotInstruction[]) => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingUrl, setEditingUrl] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    setPending(true);
    setError(null);
    try {
      const created = await createAdminBotInstruction(botId, {
        title,
        url,
        position: instructions.length,
      });
      onChange([...instructions, created]);
      setTitle("");
      setUrl("");
    } catch (err) {
      setError(extractApiError(err, "Impossible d'ajouter l'instruction."));
    } finally {
      setPending(false);
    }
  }

  async function handleSave(id: number) {
    setPending(true);
    setError(null);
    try {
      const updated = await updateAdminBotInstruction(id, { title: editingTitle, url: editingUrl });
      onChange(instructions.map((i) => (i.id === id ? updated : i)));
      setEditingId(null);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer l'instruction."));
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id: number) {
    await deleteAdminBotInstruction(id);
    onChange(instructions.filter((i) => i.id !== id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructions d&apos;installation ({instructions.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="divide-y divide-border">
          {instructions.map((instruction) =>
            editingId === instruction.id ? (
              <li key={instruction.id} className="flex flex-col gap-2 py-2 sm:flex-row sm:items-center">
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  placeholder="Titre"
                  className="flex-1"
                />
                <Input
                  value={editingUrl}
                  onChange={(e) => setEditingUrl(e.target.value)}
                  placeholder="URL"
                  className="flex-1"
                />
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" disabled={pending} onClick={() => handleSave(instruction.id)}>
                    Enregistrer
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>
                    Annuler
                  </Button>
                </div>
              </li>
            ) : (
              <li key={instruction.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{instruction.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{instruction.url}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(instruction.id);
                      setEditingTitle(instruction.title);
                      setEditingUrl(instruction.url);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(instruction.id)}>
                    Supprimer
                  </Button>
                </div>
              </li>
            )
          )}
          {instructions.length === 0 && (
            <p className="py-2 text-sm text-muted-foreground">Aucune instruction pour le moment.</p>
          )}
        </ul>

        <form onSubmit={handleAdd} className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="new-instruction-title">Titre</Label>
            <Input
              id="new-instruction-title"
              placeholder="Ex : Guide d'installation MT4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="new-instruction-url">URL</Label>
            <Input
              id="new-instruction-url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={pending || !title.trim() || !url.trim()}>
            Ajouter
          </Button>
        </form>
        {error && <Alert variant="error">{error}</Alert>}
      </CardContent>
    </Card>
  );
}
