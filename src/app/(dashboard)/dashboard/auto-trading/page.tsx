"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LicenseExpiryGauge } from "@/components/licenses/LicenseExpiryGauge";
import { EditPurchaseDetailsDialog } from "@/components/licenses/EditPurchaseDetailsDialog";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import { fetchMyLicenses } from "@/lib/api/licenses";
import {
  deleteAdminLicensePlan,
  fetchAdminLicensePlans,
} from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils";
import type { UserLicense } from "@/types/license";
import type { LicensePlan } from "@/types/license";

export default function DashboardAutoTradingPage() {
  const { isStaff } = useAuth();
  const [licenses, setLicenses] = useState<UserLicense[] | null>(null);
  const [plans, setPlans] = useState<LicensePlan[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reloadPlans() {
    const refreshed = await fetchAdminLicensePlans();
    setPlans(refreshed);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (isStaff) {
        const refreshed = await fetchAdminLicensePlans();
        if (!cancelled) setPlans(refreshed);
      } else {
        const fetched = await fetchMyLicenses();
        if (!cancelled) setLicenses(fetched);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [isStaff]);

  async function handleDeletePlan(id: number) {
    if (!window.confirm("Supprimer définitivement cette licence ?")) return;
    setError(null);
    try {
      await deleteAdminLicensePlan(id);
      await reloadPlans();
    } catch (err) {
      setError(extractApiError(err, "Impossible de supprimer cette licence."));
    }
  }

  if (isStaff) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Licences auto-trading</h1>
            <p className="text-muted-foreground">
              Gérez les formules disponibles à la vente.
            </p>
          </div>
          <Button
            render={
              <Link href="/dashboard/auto-trading/new">
                <Plus className="mr-1 size-4" /> Nouvelle formule
              </Link>
            }
          />
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <div className="grid gap-4">
          {plans === null && (
            <p className="text-muted-foreground">Chargement...</p>
          )}
          {plans?.map((plan) => (
            <Card key={plan.id}>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatCurrency(plan.price)} · {plan.purchase_count ?? 0}{" "}
                    achetée(s)
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={plan.is_active ? "default" : "secondary"}>
                    {plan.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <Link href={`/auto-trading#${plan.slug}`}>
                        Voir la page
                      </Link>
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <Link href={`/dashboard/auto-trading/${plan.id}/edit`}>
                        Modifier
                      </Link>
                    }
                  />
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <span
                          tabIndex={plan.has_active_subscribers ? 0 : undefined}
                        />
                      }
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={plan.has_active_subscribers}
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        Supprimer
                      </Button>
                    </TooltipTrigger>
                    {plan.has_active_subscribers && (
                      <TooltipContent>
                        Ce produit ne peut pas être supprimé car des
                        utilisateurs y sont inscrits.
                      </TooltipContent>
                    )}
                  </Tooltip>
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
        <p className="text-muted-foreground">
          Retrouvez vos licences d&apos;auto-trading actives.
        </p>
      </div>

      <div className="grid gap-4">
        {licenses === null && (
          <p className="text-muted-foreground">Chargement...</p>
        )}
        {licenses?.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Vous n&apos;avez pas encore de licence.{" "}
              <Link
                href="/auto-trading"
                className="font-medium text-primary hover:underline"
              >
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
              setLicenses(
                (prev) =>
                  prev?.map((l) => (l.id === updated.id ? updated : l)) ?? prev,
              )
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
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{license.license_plan.name}</CardTitle>
        <CardAction className="flex items-center gap-3">
          <Link
            href={`/auto-trading#${license.license_plan.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Voir la page
          </Link>
          {license.status === "expired" || license.status === "revoked" ? (
            <Badge variant="secondary">
              {license.status === "expired" ? "Expirée" : "Révoquée"}
            </Badge>
          ) : license.is_activated ? (
            <Badge variant="success">Activé</Badge>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="pending">En attente d&apos;activation</Badge>
              <span className="text-xs text-muted-foreground">
                Votre licence sera activée dans moins de 24h
              </span>
            </div>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <LicenseExpiryGauge
          activatedAt={license.activated_at}
          expiresAt={license.expires_at}
          status={license.status}
        />

        {(license.purchase_details || user?.whatsapp_number) && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {license.purchase_details && (
                <>
                  <p>
                    <span className="text-muted-foreground">ID :</span>{" "}
                    {license.purchase_details.id}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Serveur :</span>{" "}
                    {license.purchase_details.server}
                  </p>
                </>
              )}
              {user?.whatsapp_number && (
                <p>
                  <span className="text-muted-foreground">WhatsApp :</span>{" "}
                  {user.whatsapp_number}
                </p>
              )}
            </div>
            <EditPurchaseDetailsDialog
              type="license_plan"
              license={license}
              onUpdated={onUpdated}
            />
          </div>
        )}

        {license.pending_purchase_details && (
          <div className="rounded-lg border border-dashed border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
            Modification en attente d&apos;approbation
            {license.pending_purchase_details_submitted_at && (
              <>
                {" "}
                depuis le{" "}
                {formatDate(license.pending_purchase_details_submitted_at)}
              </>
            )}
            .
          </div>
        )}

        {!license.purchase_details && !user?.whatsapp_number && (
          <div className="flex justify-end">
            <EditPurchaseDetailsDialog
              type="license_plan"
              license={license}
              onUpdated={onUpdated}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
