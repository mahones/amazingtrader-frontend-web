"use client";

import { useRouter } from "next/navigation";
import { VipFormationForm } from "@/components/forms/VipFormationForm";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function NewVipFormationPage() {
  useRequireRole(["admin", "developer"]);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Nouvelle formation VIP</h1>

      <VipFormationForm onSaved={() => router.push("/dashboard/vip-formations")} />
    </div>
  );
}
