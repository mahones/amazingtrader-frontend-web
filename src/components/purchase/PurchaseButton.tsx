"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import type { PurchasableType } from "@/lib/api/orders";

export function PurchaseButton({
  type,
  id,
  label = "Acheter maintenant",
  className,
}: {
  type: PurchasableType;
  id: number;
  label?: string;
  className?: string;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  function handleClick() {
    const checkoutUrl = `/checkout?type=${type}&id=${id}`;
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(checkoutUrl)}`);
      return;
    }
    router.push(checkoutUrl);
  }

  return (
    <Button onClick={handleClick} disabled={isLoading} className={className}>
      {label}
    </Button>
  );
}
