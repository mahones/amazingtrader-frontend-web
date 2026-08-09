"use client";

import { useRouter } from "next/navigation";
import { LicensePlanForm } from "@/components/forms/LicensePlanForm";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function NewLicensePlanPage() {
  useRequireRole(["admin", "developer"]);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Nouvelle licence auto-trading</h1>

      <LicensePlanForm onSaved={(plan) => router.push(`/dashboard/licences/${plan.id}/edit`)} />
    </div>
  );
}
