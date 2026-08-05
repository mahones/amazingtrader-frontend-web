"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LicensePricingGrid } from "@/components/cards/LicensePricingGrid";
import { useAuth } from "@/context/AuthContext";
import { purchase } from "@/lib/api/orders";
import type { LicensePlan } from "@/types/license";

export function LicensePurchaseGrid({ plans }: { plans: LicensePlan[] }) {
  const { user } = useAuth();
  const router = useRouter();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(plan: LicensePlan) {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/auto-trading")}&purchase=license_plan:${plan.id}`);
      return;
    }

    setPendingId(plan.id);
    setError(null);
    try {
      await purchase("license_plan", plan.id);
      router.push("/dashboard/licences");
    } catch {
      setError("Le paiement a échoué. Veuillez réessayer.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <LicensePricingGrid plans={plans} onSelect={handleSelect} isPending={pendingId} />
      {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}
