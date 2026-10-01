"use client";

import { useRouter } from "next/navigation";
import { VipFormationPricingGrid } from "@/components/cards/VipFormationPricingGrid";
import { useAuth } from "@/context/AuthContext";
import type { VipFormation } from "@/types/vipFormation";

export function VipFormationPurchaseGrid({ formations }: { formations: VipFormation[] }) {
  const { user } = useAuth();
  const router = useRouter();

  function handleSelect(formation: VipFormation) {
    const checkoutUrl = `/checkout?type=vip_formation&id=${formation.id}`;
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(checkoutUrl)}`);
      return;
    }
    router.push(checkoutUrl);
  }

  return <VipFormationPricingGrid formations={formations} onSelect={handleSelect} />;
}
