"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LicenseExpiryGauge } from "@/components/licenses/LicenseExpiryGauge";
import { EditPurchaseDetailsDialog } from "@/components/licenses/EditPurchaseDetailsDialog";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import { fetchMyLicenses } from "@/lib/api/licenses";
import { deleteAdminLicensePlan, fetchAdminLicensePlans } from "@/lib/api/admin";
import { formatCurrency } from "@/lib/utils";
import type { UserLicense } from "@/types/license";
import type { LicensePlan } from "@/types/license";

export default function DashboardAutoTradingPage() {
  const { isStaff } = useAuth();
  const [licenses, setLicenses] = useState<UserLicense[] | null>(null);
  const [plans, setPlans] = useState<LicensePlan[] | null>(null);

  async function reloadPlans() {
    const refreshed = await fetchAdminLicensePlans();
    setPlans(refreshed);
  }

  useEffect(() => {
    if (isStaff) reloadPlans();
    else fetchMyLicenses().then(setLicenses);
  }, [isStaff]);

  async function handleDeletePlan(id: number) {
    if (!window.confirm("Supprimer définitivement cette licence ?")) return;
    await deleteAdminLicensePlan(id);
    await reloadPlans();
  }

  if (isStaff) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Licences auto-trading</h1>
            <p className="text-muted-foreground">Gérez les formules disponibles à la vente.</p>
          </div>
          <Button
            render={
              <Link href="/dashboard/auto-trading/new">
                <Plus className="mr-1 size-4" /> Nouvelle formule
              </Link>
            }
          />
        </div>

        <div className="grid gap-4">
          {plans === null && <p className="text-muted-foreground">Chargement...</p>}
          {plans?.map((plan) => (
            <Card key={plan.id}>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatCurrency(plan.price)} · {plan.purchase_count ?? 0} achetée(s)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={plan.is_active ? "default" : "secondary"}>
                    {plan.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/dashboard/auto-trading/${plan.id}/edit`}>Modifier</Link>}
                  />
                  <Button variant="outline" size="sm" onClick={() => handleDeletePlan(plan.id)}>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mon auto-trading</h1>
        <p className="text-muted-foreground">Retrouvez vos licences d&apos;auto-trading actives.</p>
      </div>

      <div className="grid gap-4">
        {licenses === null && <p className="text-muted-foreground">Chargement...</p>}
        {licenses?.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Vous n&apos;avez pas encore de licence.{" "}
              <Link href="/auto-trading" className="font-medium text-primary hover:underline">
                Voir les offres
              </Link>
            </CardContent>
          </Card>
        )}
        {licenses?.map((license) => (
          <LicenseCard
            key={license.id}
            license={license}
            onUpdated={(updated) =>
              setLicenses((prev) => prev?.map((l) => (l.id === updated.id ? updated : l)) ?? prev)
            }
          />
        ))}
      </div>
    </div>
  );
}

function LicenseCard({
  license,
  onUpdated,
}: {
  license: UserLicense;
  onUpdated: (license: UserLicense) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">{license.license_plan.name}</CardTitle>
        <Badge variant={license.status === "active" ? "default" : "secondary"}>
          {license.status === "active" ? "Active" : license.status === "expired" ? "Expirée" : "Révoquée"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <LicenseExpiryGauge
          activatedAt={license.activated_at}
          expiresAt={license.expires_at}
          status={license.status}
        />

        {license.purchase_details && (
          <div className="grid gap-2 rounded-lg border border-border p-3 text-sm sm:grid-cols-2">
            <p><span className="text-muted-foreground">ID :</span> {license.purchase_details.id}</p>
            <p><span className="text-muted-foreground">Serveur :</span> {license.purchase_details.server}</p>
            <p>
              <span className="text-muted-foreground">WhatsApp :</span>{" "}
              {license.purchase_details.whatsapp_number}
            </p>
          </div>
        )}

        {license.pending_purchase_details && (
          <div className="rounded-lg border border-dashed border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
            Modification en attente d&apos;approbation
            {license.pending_purchase_details_submitted_at && (
              <> depuis le {formatDate(license.pending_purchase_details_submitted_at)}</>
            )}
            .
          </div>
        )}

        <div className="flex justify-end">
          <EditPurchaseDetailsDialog type="license_plan" license={license} onUpdated={onUpdated} />
        </div>
      </CardContent>
    </Card>
  );
}
