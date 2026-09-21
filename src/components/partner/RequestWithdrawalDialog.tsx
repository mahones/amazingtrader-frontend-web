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
import { requestWithdrawal } from "@/lib/api/partners";
import { extractApiError } from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { Withdrawal } from "@/types/withdrawal";

export function RequestWithdrawalDialog({
  balance,
  trigger,
  onRequested,
}: {
  balance: number;
  trigger: React.ReactElement;
  onRequested: (withdrawal: Withdrawal) => void;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [receivingIdentifier, setReceivingIdentifier] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function reset() {
    setAmount("");
    setPaymentMethod("");
    setReceivingIdentifier("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Indiquez un montant valide.");
      return;
    }
    if (numericAmount > balance) {
      setError("Ce montant dépasse votre solde disponible.");
      return;
    }

    setPending(true);
    setError(null);

    try {
      const withdrawal = await requestWithdrawal({
        amount: numericAmount,
        payment_method: paymentMethod,
        receiving_identifier: receivingIdentifier,
      });
      toast.success("Votre demande de retrait a été envoyée.");
      onRequested(withdrawal);
      setOpen(false);
      reset();
    } catch (err) {
      setError(extractApiError(err, "Impossible d'envoyer cette demande de retrait."));
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
          <DialogTitle>Demander un retrait</DialogTitle>
          <DialogDescription>Solde disponible : {formatCurrency(balance)}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="withdrawal-amount">Montant</Label>
            <Input
              id="withdrawal-amount"
              type="number"
              min="0.01"
              step="0.01"
              max={balance}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal-method">Moyen de paiement</Label>
            <Input
              id="withdrawal-method"
              required
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              placeholder="ex. Mobile Money, WhatsApp..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal-identifier">Numéro / identifiant de réception</Label>
            <Input
              id="withdrawal-identifier"
              required
              value={receivingIdentifier}
              onChange={(e) => setReceivingIdentifier(e.target.value)}
              placeholder="ex. +225 07 00 00 00 00"
            />
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Envoi..." : "Envoyer la demande"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
