"use client";

import { useRouter } from "next/navigation";
import { EurekaChallengeLicensePricingGrid } from "@/components/cards/EurekaChallengeLicensePricingGrid";
import { useAuth } from "@/context/AuthContext";
import type { EurekaChallengeLicensePlan } from "@/types/eurekaChallenge";

export function EurekaChallengeLicensePurchaseGrid({ plans }: { plans: EurekaChallengeLicensePlan[] }) {
  const { user } = useAuth();
  const router = useRouter();

  function handleSelect(plan: EurekaChallengeLicensePlan) {
    const checkoutUrl = `/checkout?type=eureka_challenge_license_plan&id=${plan.id}`;
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(checkoutUrl)}`);
      return;
    }
    router.push(checkoutUrl);
  }

  return <EurekaChallengeLicensePricingGrid plans={plans} onSelect={handleSelect} />;
}
