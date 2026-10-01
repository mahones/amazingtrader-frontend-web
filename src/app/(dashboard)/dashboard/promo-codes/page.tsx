"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CatalogCard, CatalogCardGrid } from "@/components/dashboard/CatalogListCard";
import { PromoCodeDialog } from "@/components/admin/PromoCodeDialog";
import { useRequireRole } from "@/hooks/useRequireRole";
import { deleteAdminPromoCode, fetchAdminPromoCodes } from "@/lib/api/admin";
import { formatDate } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { PromoCode, PromoCodeProductType } from "@/types/promo-code";

const productTypeLabels: Record<PromoCodeProductType, string> = {
  course: "Formation",
  bot_license_plan: "Licence de Bot",
  license_plan: "Licence Auto-Trading",
};

function productsSummary(promoCode: PromoCode): string {
  if (!promoCode.product_type || promoCode.products.length === 0) return "Aucun produit";
  const label = productTypeLabels[promoCode.product_type];
  const names = promoCode.products.map((p) => p.name).join(", ");
  return `${label} : ${names}`;
}

export default function DashboardPromoCodesPage() {
  useRequireRole(["admin", "developer"]);

  const [promoCodes, setPromoCodes] = useState<PromoCode[] | null>(null);

  async function reload() {
    const refreshed = await fetchAdminPromoCodes();
    setPromoCodes(refreshed);
  }

  useEffect(() => {
    void reload();
  }, []);

  function handleSaved(promoCode: PromoCode) {
    setPromoCodes((prev) => {
      if (!prev) return [promoCode];
      const exists = prev.some((p) => p.id === promoCode.id);
      return exists ? prev.map((p) => (p.id === promoCode.id ? promoCode : p)) : [promoCode, ...prev];
    });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Supprimer définitivement ce code promo ?")) return;
    try {
      await deleteAdminPromoCode(id);
      setPromoCodes((prev) => prev?.filter((p) => p.id !== id) ?? null);
      toast.success("Code promo supprimé.");
    } catch {
      toast.error("Impossible de supprimer ce code promo.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Codes promo</h1>
          <p className="text-muted-foreground">Gérez les codes de réduction applicables au paiement.</p>
        </div>
        <PromoCodeDialog
          onSaved={handleSaved}
          trigger={
            <Button>
              <Plus className="mr-1 size-4" /> Nouveau code promo
            </Button>
          }
        />
      </div>

      {promoCodes === null && <p className="text-muted-foreground">Chargement...</p>}
      {promoCodes?.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Aucun code promo pour le moment.
          </CardContent>
        </Card>
      )}
      <CatalogCardGrid>
        {promoCodes?.map((promoCode) => (
          <CatalogCard
            key={promoCode.id}
            title={<span className="font-mono">{promoCode.code}</span>}
            badges={
              <>
                <Badge variant="outline">-{promoCode.discount_percentage}%</Badge>
                <Badge variant={promoCode.is_active ? "default" : "secondary"}>
                  {promoCode.is_active ? "Actif" : "Inactif"}
                </Badge>
              </>
            }
            caption={`${productsSummary(promoCode)} · ${
              promoCode.expires_at ? `Expire le ${formatDate(promoCode.expires_at)}` : "Sans expiration"
            }`}
            actions={
              <>
                <PromoCodeDialog
                  promoCode={promoCode}
                  onSaved={handleSaved}
                  trigger={
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(promoCode.id)}
                >
                  Supprimer
                </Button>
              </>
            }
          />
        ))}
      </CatalogCardGrid>
    </div>
  );
}
