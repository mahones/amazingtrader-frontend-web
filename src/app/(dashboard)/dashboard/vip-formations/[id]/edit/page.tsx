"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VipFormationForm } from "@/components/forms/VipFormationForm";
import { useRequireRole } from "@/hooks/useRequireRole";
import { deleteAdminVipFormation, fetchAdminVipFormations } from "@/lib/api/admin";
import type { VipFormation } from "@/types/vipFormation";

export default function EditVipFormationPage({ params }: { params: Promise<{ id: string }> }) {
  useRequireRole(["admin", "developer"]);
  const { id } = use(params);
  const router = useRouter();
  const [vipFormation, setVipFormation] = useState<VipFormation | null>(null);

  useEffect(() => {
    fetchAdminVipFormations().then((items) => {
      setVipFormation(items.find((f) => f.id === Number(id)) ?? null);
    });
  }, [id]);

  async function handleDelete() {
    if (!vipFormation) return;
    if (!window.confirm("Supprimer définitivement cette formation VIP ?")) return;
    await deleteAdminVipFormation(vipFormation.id);
    router.push("/dashboard/vip-formations");
  }

  if (!vipFormation) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Modifier {vipFormation.title}</h1>
        <Button
          type="button"
          variant="outline"
          className="text-destructive hover:text-destructive"
          onClick={handleDelete}
        >
          Supprimer
        </Button>
      </div>

      <VipFormationForm vipFormation={vipFormation} onSaved={setVipFormation} />
    </div>
  );
}
