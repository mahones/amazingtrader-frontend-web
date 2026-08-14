"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { BotLicensePricingGrid } from "@/components/cards/BotLicensePricingGrid";
import { useAuth } from "@/context/AuthContext";
import { usePostPurchaseFlow } from "@/hooks/usePostPurchaseFlow";
import { purchase } from "@/lib/api/orders";
import { toast } from "@/lib/toast";
import type { BotLicensePlan } from "@/types/bot";

export function BotLicensePurchaseGrid({ plans, botSlug }: { plans: BotLicensePlan[]; botSlug: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const { handlePurchaseResult, modal } = usePostPurchaseFlow();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(plan: BotLicensePlan) {
    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(`/bot-trading/${botSlug}`)}&purchase=bot_license_plan:${plan.id}`
      );
      return;
    }

    setPendingId(plan.id);
    setError(null);
    try {
      const order = await purchase("bot_license_plan", plan.id);
      toast.success("Achat effectué avec succès !");
      handlePurchaseResult(order, "bot_license_plan");
    } catch {
      setError("Le paiement a échoué. Veuillez réessayer.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <BotLicensePricingGrid plans={plans} onSelect={handleSelect} isPending={pendingId} />
      {error && <Alert variant="error" className="mt-4">{error}</Alert>}
      {modal}
    </div>
  );
}
