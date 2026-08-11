"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { fetchMyLicenses, updateBrokerConfig } from "@/lib/api/licenses";
import { deleteAdminLicensePlan, fetchAdminLicensePlans } from "@/lib/api/admin";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { UserLicense } from "@/types/license";
import type { LicensePlan } from "@/types/license";

export default function DashboardLicencesPage() {
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
              <Link href="/dashboard/licences/new">
                <Plus className="mr-1 size-4" /> Nouvelle licence
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
                    render={<Link href={`/dashboard/licences/${plan.id}/edit`}>Modifier</Link>}
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
        <h1 className="text-2xl font-bold">Mes licences</h1>
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
          <LicenseCard key={license.id} license={license} />
        ))}
      </div>
    </div>
  );
}

function LicenseCard({ license }: { license: UserLicense }) {
  const [brokerApiKey, setBrokerApiKey] = useState(
    (license.broker_config?.api_key as string) ?? ""
  );
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await updateBrokerConfig(license.id, { ...license.broker_config, api_key: brokerApiKey });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">{license.license_plan.name}</CardTitle>
        <Badge variant={license.status === "active" ? "default" : "secondary"}>
          {license.status === "active" ? "Active" : license.status === "expired" ? "Expirée" : "Révoquée"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <p><span className="text-muted-foreground">Clé de licence :</span> <code>{license.license_key}</code></p>
          <p><span className="text-muted-foreground">Expire le :</span> {formatDate(license.expires_at)}</p>
        </div>

        <div className="space-y-2 border-t border-border pt-4">
          <Label htmlFor={`broker-${license.id}`}>Clé API broker</Label>
          <div className="flex gap-2">
            <Input
              id={`broker-${license.id}`}
              value={brokerApiKey}
              onChange={(e) => setBrokerApiKey(e.target.value)}
              placeholder="Collez votre clé API broker"
            />
            <Button onClick={handleSave} variant="outline">
              {saved ? "Enregistré ✓" : "Enregistrer"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
