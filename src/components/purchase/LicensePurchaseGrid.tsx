"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { LicensePricingGrid } from "@/components/cards/LicensePricingGrid";
import { useAuth } from "@/context/AuthContext";
import { usePostPurchaseFlow } from "@/hooks/usePostPurchaseFlow";
import { purchase } from "@/lib/api/orders";
import { toast } from "@/lib/toast";
import type { LicensePlan } from "@/types/license";

export function LicensePurchaseGrid({ plans }: { plans: LicensePlan[] }) {
  const { user } = useAuth();
  const router = useRouter();
  const { handlePurchaseResult, modal } = usePostPurchaseFlow();
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
      const order = await purchase("license_plan", plan.id);
      toast.success("Achat effectué avec succès !");
      handlePurchaseResult(order, "license_plan");
    } catch {
      setError("Le paiement a échoué. Veuillez réessayer.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <LicensePricingGrid plans={plans} onSelect={handleSelect} isPending={pendingId} />
      {error && <Alert variant="error" className="mt-4">{error}</Alert>}
      {modal}
    </div>
  );
}
