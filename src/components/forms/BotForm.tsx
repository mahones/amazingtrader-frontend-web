"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
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
  const [imageUrl, setImageUrl] = useState(bot?.image_url ?? "");
  const [description, setDescription] = useState(bot?.description ?? "");
  const [strategySummary, setStrategySummary] = useState(bot?.strategy_summary ?? "");
  const [pairsTraded, setPairsTraded] = useState((bot?.pairs_traded ?? []).join(", "));
  const [yieldPercent, setYieldPercent] = useState(bot?.yield_percent?.toString() ?? "");
  const [drawdownPercent, setDrawdownPercent] = useState(bot?.drawdown_percent?.toString() ?? "");
  const [winRatePercent, setWinRatePercent] = useState(bot?.win_rate_percent?.toString() ?? "");
  const [isActive, setIsActive] = useState(bot?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const payload = {
      name,
      slug: slug || slugify(name),
      image_url: imageUrl || null,
      description,
      strategy_summary: strategySummary || null,
      pairs_traded: pairsTraded
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      yield_percent: yieldPercent ? Number(yieldPercent) : null,
      drawdown_percent: drawdownPercent ? Number(drawdownPercent) : null,
      win_rate_percent: winRatePercent ? Number(winRatePercent) : null,
      is_active: isActive,
    };

    try {
      const saved =
        isEditing && bot
          ? await updateAdminTradingBot(bot.id, payload)
          : await createAdminTradingBot(payload);
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

          <div className="space-y-2">
            <Label htmlFor="bot-image">Image / média principal (URL)</Label>
            <Input
              id="bot-image"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <RichTextEditor value={description} onChange={setDescription} />
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bot-yield">Rendement (%)</Label>
              <Input
                id="bot-yield"
                type="number"
                step="0.01"
                value={yieldPercent}
                onChange={(e) => setYieldPercent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bot-drawdown">Drawdown (%)</Label>
              <Input
                id="bot-drawdown"
                type="number"
                step="0.01"
                value={drawdownPercent}
                onChange={(e) => setDrawdownPercent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bot-winrate">Win rate (%)</Label>
              <Input
                id="bot-winrate"
                type="number"
                step="0.01"
                value={winRatePercent}
                onChange={(e) => setWinRatePercent(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="bot-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="bot-active">Actif (visible sur le site)</Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer le bot"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
