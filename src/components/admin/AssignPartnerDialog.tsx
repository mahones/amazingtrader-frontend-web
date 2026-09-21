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
import { assignPartnerToUser, updateAssignedPartner } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import type { Partner } from "@/types/partner";

export function AssignPartnerDialog({
  userId,
  existingPartner,
  trigger,
  onSaved,
}: {
  userId: number;
  existingPartner?: Partner | null;
  trigger: React.ReactElement;
  onSaved: (partner: Partner) => void;
}) {
  const [open, setOpen] = useState(false);
  const [gainPercentage, setGainPercentage] = useState(existingPartner?.gain_percentage?.toString() ?? "");
  const [discountPercentage, setDiscountPercentage] = useState(
    existingPartner?.discount_percentage?.toString() ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function reset() {
    setGainPercentage(existingPartner?.gain_percentage?.toString() ?? "");
    setDiscountPercentage(existingPartner?.discount_percentage?.toString() ?? "");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const payload = {
        gain_percentage: Number(gainPercentage),
        discount_percentage: Number(discountPercentage),
      };
      const partner = existingPartner
        ? await updateAssignedPartner(userId, payload)
        : await assignPartnerToUser(userId, payload);
      toast.success(existingPartner ? "Partenaire mis à jour." : "Code partenaire assigné.");
      onSaved(partner);
      setOpen(false);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer ce partenaire."));
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
          <DialogTitle>{existingPartner ? "Modifier le code partenaire" : "Assigner un code partenaire"}</DialogTitle>
          <DialogDescription>
            {existingPartner
              ? "Ajustez les pourcentages fixes de ce partenaire sous contrat."
              : "Ce code est directement associé à cet utilisateur, avec des pourcentages fixes définis ici (hors grille de niveaux) — dans le cadre d'un accord conclu hors plateforme."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assigned-gain">Pourcentage de gain (%)</Label>
            <Input
              id="assigned-gain"
              type="number"
              min="0"
              max="100"
              required
              value={gainPercentage}
              onChange={(e) => setGainPercentage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned-discount">Pourcentage de réduction (%)</Label>
            <Input
              id="assigned-discount"
              type="number"
              min="0"
              max="100"
              required
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
            />
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : existingPartner ? "Enregistrer" : "Assigner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
