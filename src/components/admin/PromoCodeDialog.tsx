"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  createAdminPromoCode,
  fetchAdminCourses,
  fetchAdminLicensePlans,
  fetchAdminTradingBots,
  updateAdminPromoCode,
} from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import type { Course } from "@/types/course";
import type { LicensePlan } from "@/types/license";
import type { TradingBot } from "@/types/bot";
import type { PromoCode, PromoCodeProductType } from "@/types/promo-code";

function toggleId(ids: number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((existing) => existing !== id) : [...ids, id];
}

const productTypeOptions: { value: PromoCodeProductType; label: string }[] = [
  { value: "course", label: "Formation" },
  { value: "bot_license_plan", label: "Licence de Bot de Trading" },
  { value: "license_plan", label: "Licence d'Auto-Trading" },
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
  const [productType, setProductType] = useState<PromoCodeProductType>(promoCode?.product_type ?? "course");
  const [productIds, setProductIds] = useState<number[]>(promoCode?.product_ids ?? []);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [licensePlans, setLicensePlans] = useState<LicensePlan[]>([]);
  const [bots, setBots] = useState<TradingBot[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    if (!open || productsLoaded) return;
    Promise.all([fetchAdminCourses(), fetchAdminLicensePlans(), fetchAdminTradingBots()]).then(
      ([fetchedCourses, fetchedLicensePlans, fetchedBots]) => {
        setCourses(fetchedCourses);
        setLicensePlans(fetchedLicensePlans);
        setBots(fetchedBots);
        setProductsLoaded(true);
      }
    );
  }, [open, productsLoaded]);

  const productOptions = useMemo(() => {
    if (productType === "course") {
      return courses.map((course) => ({ id: course.id, label: course.title }));
    }
    if (productType === "license_plan") {
      return licensePlans.map((plan) => ({ id: plan.id, label: plan.name }));
    }
    return bots.flatMap((bot) =>
      (bot.license_plans ?? []).map((plan) => ({ id: plan.id, label: `${bot.name} — ${plan.name}` }))
    );
  }, [productType, courses, licensePlans, bots]);

  function reset() {
    setCode(promoCode?.code ?? "");
    setDiscountPercentage(promoCode?.discount_percentage?.toString() ?? "10");
    setExpiresAt(promoCode?.expires_at?.slice(0, 10) ?? "");
    setIsActive(promoCode?.is_active ?? true);
    setProductType(promoCode?.product_type ?? "course");
    setProductIds(promoCode?.product_ids ?? []);
    setError(null);
  }

  function handleProductTypeChange(value: PromoCodeProductType) {
    setProductType(value);
    setProductIds([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (productIds.length === 0) {
      setError("Sélectionnez au moins un produit auquel ce code s'applique.");
      return;
    }

    setPending(true);
    setError(null);

    const payload: Partial<PromoCode> = {
      code,
      discount_percentage: Number(discountPercentage),
      expires_at: expiresAt || null,
      is_active: isActive,
      product_type: productType,
      product_ids: productIds,
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
            Ce code pourra être appliqué au paiement des produits sélectionnés s&apos;il est actif et non expiré.
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
            <Label>Type de produit</Label>
            <Select
              items={productTypeOptions}
              value={productType}
              onValueChange={(v) => handleProductTypeChange((v as PromoCodeProductType) ?? "course")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un type de produit" />
              </SelectTrigger>
              <SelectContent>
                {productTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Produits éligibles</Label>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3">
              {!productsLoaded && <p className="text-sm text-muted-foreground">Chargement...</p>}
              {productsLoaded && productOptions.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun produit disponible pour ce type.</p>
              )}
              {productOptions.map((option) => (
                <label key={option.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-primary"
                    checked={productIds.includes(option.id)}
                    onChange={() => setProductIds((ids) => toggleId(ids, option.id))}
                  />
                  {option.label}
                </label>
              ))}
            </div>
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
