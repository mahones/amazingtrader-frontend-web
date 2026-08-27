"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PromoCodeDialog } from "@/components/admin/PromoCodeDialog";
import { useRequireRole } from "@/hooks/useRequireRole";
import { deleteAdminPromoCode, fetchAdminPromoCodes } from "@/lib/api/admin";
import { formatDate } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { PromoCode, PromoCodeApplicability } from "@/types/promo-code";

const applicabilityLabels: Record<PromoCodeApplicability, string> = {
  courses: "Formations",
  bot_licenses: "Licences Bots",
  auto_trading_licenses: "Licences Auto-Trading",
  all: "Toutes",
};

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

      <div className="grid gap-4">
        {promoCodes === null && <p className="text-muted-foreground">Chargement...</p>}
        {promoCodes?.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Aucun code promo pour le moment.
            </CardContent>
          </Card>
        )}
        {promoCodes?.map((promoCode) => (
          <Card key={promoCode.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono font-semibold">{promoCode.code}</h3>
                  <Badge variant="outline">-{promoCode.discount_percentage}%</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {applicabilityLabels[promoCode.applicable_to]} ·{" "}
                  {promoCode.expires_at ? `Expire le ${formatDate(promoCode.expires_at)}` : "Sans expiration"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Badge variant={promoCode.is_active ? "default" : "secondary"}>
                  {promoCode.is_active ? "Actif" : "Inactif"}
                </Badge>
                <PromoCodeDialog
                  promoCode={promoCode}
                  onSaved={handleSaved}
                  trigger={
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  }
                />
                <Button variant="outline" size="sm" onClick={() => handleDelete(promoCode.id)}>
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
