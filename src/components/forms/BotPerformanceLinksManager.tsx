"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { extractApiError } from "@/lib/api/client";
import {
  createAdminBotPerformanceLink,
  deleteAdminBotPerformanceLink,
  updateAdminBotPerformanceLink,
} from "@/lib/api/admin";
import type { BotPerformanceLink, PerformancePlatform } from "@/types/bot";

const PLATFORM_LABELS: Record<PerformancePlatform, string> = {
  myfxbook: "Myfxbook",
  mql5: "MQL5",
  other: "Autre",
};

interface LinkDraft {
  platform: PerformancePlatform;
  label: string;
  url: string;
}

const EMPTY_DRAFT: LinkDraft = { platform: "myfxbook", label: "", url: "" };

function LinkFields({ value, onChange }: { value: LinkDraft; onChange: (next: LinkDraft) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="space-y-2">
        <Label>Plateforme</Label>
        <Select
          value={value.platform}
          onValueChange={(v) => v && onChange({ ...value, platform: v as PerformancePlatform })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PLATFORM_LABELS).map(([key, l]) => (
              <SelectItem key={key} value={key}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Libellé du bouton</Label>
        <Input
          placeholder="Vérifier nos performances sur Myfxbook"
          value={value.label}
          onChange={(e) => onChange({ ...value, label: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>URL</Label>
        <Input
          placeholder="https://..."
          value={value.url}
          onChange={(e) => onChange({ ...value, url: e.target.value })}
        />
      </div>
    </div>
  );
}

export function BotPerformanceLinksManager({
  botId,
  links,
  onChange,
}: {
  botId: number;
  links: BotPerformanceLink[];
  onChange: (next: BotPerformanceLink[]) => void;
}) {
  const [draft, setDraft] = useState<LinkDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingDraft, setEditingDraft] = useState<LinkDraft>(EMPTY_DRAFT);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.label.trim() || !draft.url.trim()) return;
    setPending(true);
    setError(null);
    try {
      const created = await createAdminBotPerformanceLink(botId, { ...draft, position: links.length });
      onChange([...links, created]);
      setDraft(EMPTY_DRAFT);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'ajouter le lien de performance."));
    } finally {
      setPending(false);
    }
  }

  async function handleSave(id: number) {
    setPending(true);
    setError(null);
    try {
      const updated = await updateAdminBotPerformanceLink(id, editingDraft);
      onChange(links.map((l) => (l.id === id ? updated : l)));
      setEditingId(null);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer le lien de performance."));
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id: number) {
    await deleteAdminBotPerformanceLink(id);
    onChange(links.filter((l) => l.id !== id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performances ({links.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="divide-y divide-border">
          {links.map((link) =>
            editingId === link.id ? (
              <li key={link.id} className="space-y-3 py-3">
                <LinkFields value={editingDraft} onChange={setEditingDraft} />
                <div className="flex gap-2">
                  <Button size="sm" disabled={pending} onClick={() => handleSave(link.id)}>
                    Enregistrer
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>
                    Annuler
                  </Button>
                </div>
              </li>
            ) : (
              <li key={link.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <div>
                  <span className="font-medium">{PLATFORM_LABELS[link.platform]}</span>
                  <span className="ml-2 text-muted-foreground">{link.label}</span>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(link.id);
                      setEditingDraft({ platform: link.platform, label: link.label, url: link.url });
                    }}
                  >
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(link.id)}>
                    Supprimer
                  </Button>
                </div>
              </li>
            )
          )}
          {links.length === 0 && (
            <p className="py-2 text-sm text-muted-foreground">Aucun lien de performance pour le moment.</p>
          )}
        </ul>

        <form onSubmit={handleAdd} className="space-y-3 border-t border-border pt-4">
          <p className="text-sm font-medium">Ajouter un lien</p>
          <LinkFields value={draft} onChange={setDraft} />
          <Button type="submit" disabled={pending || !draft.label.trim() || !draft.url.trim()}>
            Ajouter
          </Button>
        </form>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
