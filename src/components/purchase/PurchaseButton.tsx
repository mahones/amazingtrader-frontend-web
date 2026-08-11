"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { usePostPurchaseFlow } from "@/hooks/usePostPurchaseFlow";
import { purchase, type PurchasableType } from "@/lib/api/orders";

export function PurchaseButton({
  type,
  id,
  redirectTo,
  label = "Acheter maintenant",
  className,
}: {
  type: PurchasableType;
  id: number;
  redirectTo: string;
  label?: string;
  className?: string;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { handlePurchaseResult, modal } = usePostPurchaseFlow();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(redirectTo)}&purchase=${type}:${id}`);
      return;
    }

    setPending(true);
    setError(null);
    try {
      const order = await purchase(type, id);
      handlePurchaseResult(order, type);
    } catch {
      setError("Le paiement a échoué. Veuillez réessayer.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={className}>
      <Button onClick={handleClick} disabled={pending || isLoading} className="w-full">
        {pending ? "Traitement..." : label}
      </Button>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      {modal}
    </div>
  );
}
