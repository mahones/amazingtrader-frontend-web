"use client";

import { useRouter } from "next/navigation";
import { BarronsChallengeLicensePricingGrid } from "@/components/cards/BarronsChallengeLicensePricingGrid";
import { useAuth } from "@/context/AuthContext";
import type { BarronsChallengeLicensePlan } from "@/types/barronsChallenge";

export function BarronsChallengeLicensePurchaseGrid({ plans }: { plans: BarronsChallengeLicensePlan[] }) {
  const { user } = useAuth();
  const router = useRouter();

  function handleSelect(plan: BarronsChallengeLicensePlan) {
    const checkoutUrl = `/checkout?type=barrons_challenge_license_plan&id=${plan.id}`;
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(checkoutUrl)}`);
      return;
    }
    router.push(checkoutUrl);
  }

  return <BarronsChallengeLicensePricingGrid plans={plans} onSelect={handleSelect} />;
}
