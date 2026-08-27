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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAdminPromoCode, updateAdminPromoCode } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import type { PromoCode, PromoCodeApplicability } from "@/types/promo-code";

const applicabilityOptions: { value: PromoCodeApplicability; label: string }[] = [
  { value: "courses", label: "Formations" },
  { value: "bot_licenses", label: "Licences Bots" },
  { value: "auto_trading_licenses", label: "Licences Auto-Trading" },
  { value: "all", label: "Toutes" },
];

export function PromoCodeDialog({
  promoCode,
  trigger,
  onSaved,
}: {
  promoCode?: PromoCode;
  trigger: React.ReactElement;
  onSaved: (promoCode: PromoCode) => void;
}) {
  const isEditing = Boolean(promoCode);

  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(promoCode?.code ?? "");
  const [discountPercentage, setDiscountPercentage] = useState(promoCode?.discount_percentage?.toString() ?? "10");
  const [expiresAt, setExpiresAt] = useState(promoCode?.expires_at?.slice(0, 10) ?? "");
  const [isActive, setIsActive] = useState(promoCode?.is_active ?? true);
  const [applicableTo, setApplicableTo] = useState<PromoCodeApplicability>(promoCode?.applicable_to ?? "all");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function reset() {
    setCode(promoCode?.code ?? "");
    setDiscountPercentage(promoCode?.discount_percentage?.toString() ?? "10");
    setExpiresAt(promoCode?.expires_at?.slice(0, 10) ?? "");
    setIsActive(promoCode?.is_active ?? true);
    setApplicableTo(promoCode?.applicable_to ?? "all");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const payload: Partial<PromoCode> = {
      code,
      discount_percentage: Number(discountPercentage),
      expires_at: expiresAt || null,
      is_active: isActive,
      applicable_to: applicableTo,
    };

    try {
      const saved = isEditing && promoCode
        ? await updateAdminPromoCode(promoCode.id, payload)
        : await createAdminPromoCode(payload);
      toast.success(isEditing ? "Code promo mis à jour." : "Code promo créé.");
      onSaved(saved);
      setOpen(false);
      if (!isEditing) reset();
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer ce code promo."));
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
          <DialogTitle>{isEditing ? "Modifier le code promo" : "Nouveau code promo"}</DialogTitle>
          <DialogDescription>
            Ce code pourra être appliqué au paiement s&apos;il est actif et non expiré.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promo-code">Code</Label>
            <Input
              id="promo-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ex. PROMO20"
              className="uppercase"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo-discount">Réduction (%)</Label>
            <Input
              id="promo-discount"
              type="number"
              min="1"
              max="100"
              required
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Applicable à</Label>
            <Select
              items={applicabilityOptions}
              value={applicableTo}
              onValueChange={(v) => setApplicableTo((v as PromoCodeApplicability) ?? "all")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {applicabilityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo-expires">Date d&apos;expiration (optionnel)</Label>
            <Input
              id="promo-expires"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="promo-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="promo-active">Actif</Label>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : isEditing ? "Enregistrer" : "Créer le code promo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
