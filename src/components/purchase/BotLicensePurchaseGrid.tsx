"use client";

import { useRouter } from "next/navigation";
import { BotLicensePricingGrid } from "@/components/cards/BotLicensePricingGrid";
import { useAuth } from "@/context/AuthContext";
import type { BotLicensePlan } from "@/types/bot";

export function BotLicensePurchaseGrid({ plans }: { plans: BotLicensePlan[] }) {
  const { user } = useAuth();
  const router = useRouter();

  function handleSelect(plan: BotLicensePlan) {
    const checkoutUrl = `/checkout?type=bot_license_plan&id=${plan.id}`;
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(checkoutUrl)}`);
      return;
    }
    router.push(checkoutUrl);
  }

  return <BotLicensePricingGrid plans={plans} onSelect={handleSelect} />;
}
