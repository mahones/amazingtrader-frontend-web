"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePartnerLevel } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import type { PartnerLevelConfig } from "@/types/partner";

export function PartnerLevelDialog({
  level,
  trigger,
  onSaved,
}: {
  level: PartnerLevelConfig;
  trigger: React.ReactElement;
  onSaved: (level: PartnerLevelConfig) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(level.name);
  const [gainPercentage, setGainPercentage] = useState(level.gain_percentage.toString());
  const [discountPercentage, setDiscountPercentage] = useState(level.discount_percentage.toString());
  const [minCumulativePurchases, setMinCumulativePurchases] = useState(level.min_cumulative_purchases.toString());
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function reset() {
    setName(level.name);
    setGainPercentage(level.gain_percentage.toString());
    setDiscountPercentage(level.discount_percentage.toString());
    setMinCumulativePurchases(level.min_cumulative_purchases.toString());
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const saved = await updatePartnerLevel(level.id, {
        name,
        gain_percentage: Number(gainPercentage),
        discount_percentage: Number(discountPercentage),
        min_cumulative_purchases: Number(minCumulativePurchases),
      });
      toast.success("Niveau mis à jour.");
      onSaved(saved);
      setOpen(false);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer ce niveau."));
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Niveau {level.name}</DialogTitle>
          <DialogDescription>
            Renommez ce niveau et définissez le pourcentage de gain, la réduction offerte, et le seuil d&apos;achats
            cumulés requis.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="level-name">Nom du niveau</Label>
            <Input id="level-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="ex. Bronze" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level-gain">Pourcentage de gain (%)</Label>
            <Input
              id="level-gain"
              type="number"
              min="0"
              max="100"
              required
              value={gainPercentage}
              onChange={(e) => setGainPercentage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level-discount">Pourcentage de réduction (%)</Label>
            <Input
              id="level-discount"
              type="number"
              min="0"
              max="100"
              required
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level-threshold">Seuil d&apos;achats cumulés requis</Label>
            <Input
              id="level-threshold"
              type="number"
              min="0"
              step="0.01"
              required
              value={minCumulativePurchases}
              onChange={(e) => setMinCumulativePurchases(e.target.value)}
            />
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
