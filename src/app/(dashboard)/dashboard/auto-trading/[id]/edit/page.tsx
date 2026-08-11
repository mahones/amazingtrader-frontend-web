"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LicensePlanForm } from "@/components/forms/LicensePlanForm";
import { useRequireRole } from "@/hooks/useRequireRole";
import { deleteAdminLicensePlan, fetchAdminLicensePlans } from "@/lib/api/admin";
import type { LicensePlan } from "@/types/license";

export default function EditLicensePlanPage({ params }: { params: Promise<{ id: string }> }) {
  useRequireRole(["admin", "developer"]);
  const { id } = use(params);
  const router = useRouter();
  const [plan, setPlan] = useState<LicensePlan | null>(null);

  useEffect(() => {
    fetchAdminLicensePlans().then((plans) => {
      setPlan(plans.find((p) => p.id === Number(id)) ?? null);
    });
  }, [id]);

  async function handleDelete() {
    if (!plan) return;
    if (!window.confirm("Supprimer définitivement cette licence ?")) return;
    await deleteAdminLicensePlan(plan.id);
    router.push("/dashboard/auto-trading");
  }

  if (!plan) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Modifier {plan.name}</h1>
        <Button type="button" variant="destructive" onClick={handleDelete}>
          Supprimer
        </Button>
      </div>

      <LicensePlanForm plan={plan} onSaved={setPlan} />
    </div>
  );
}
