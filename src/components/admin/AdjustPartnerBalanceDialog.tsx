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
import { adjustPartnerBalance } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { Partner } from "@/types/partner";

export function AdjustPartnerBalanceDialog({
  partner,
  trigger,
  onSaved,
}: {
  partner: Partner;
  trigger: React.ReactElement;
  onSaved: (partner: Partner) => void;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function reset() {
    setAmount("");
    setNote("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Indiquez un montant valide.");
      return;
    }

    setPending(true);
    setError(null);

    try {
      const updated = await adjustPartnerBalance(partner.id, {
        amount: numericAmount,
        note: note.trim() || undefined,
      });
      toast.success(`${formatCurrency(numericAmount)} ajoutés au solde de ${partner.code}.`);
      onSaved(updated);
      setOpen(false);
      reset();
    } catch (err) {
      setError(extractApiError(err, "Impossible d'ajouter ce montant."));
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
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Ajouter un montant au solde</DialogTitle>
          <DialogDescription>
            Solde actuel de {partner.code} : {formatCurrency(partner.balance)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partner-balance-amount">Montant à ajouter</Label>
            <Input
              id="partner-balance-amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner-balance-note">Note (optionnel)</Label>
            <Input
              id="partner-balance-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ex. Bonus fin de mois"
            />
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
