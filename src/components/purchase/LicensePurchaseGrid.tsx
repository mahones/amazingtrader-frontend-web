"use client";

import { useRouter } from "next/navigation";
import { LicensePricingGrid } from "@/components/cards/LicensePricingGrid";
import { useAuth } from "@/context/AuthContext";
import type { LicensePlan } from "@/types/license";

export function LicensePurchaseGrid({ plans }: { plans: LicensePlan[] }) {
  const { user } = useAuth();
  const router = useRouter();

  function handleSelect(plan: LicensePlan) {
    const checkoutUrl = `/checkout?type=license_plan&id=${plan.id}`;
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(checkoutUrl)}`);
      return;
    }
    router.push(checkoutUrl);
  }

  return <LicensePricingGrid plans={plans} onSelect={handleSelect} />;
}
