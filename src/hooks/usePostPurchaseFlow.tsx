"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostPurchaseDetailsModal } from "@/components/purchase/PostPurchaseDetailsModal";
import type { PurchasableType } from "@/lib/api/orders";
import type { Order } from "@/types/order";

export function resolvePurchaseRedirect(type: PurchasableType) {
  if (type === "course") return "/dashboard/formations";
  if (type === "bot_license_plan") return "/dashboard/bots";
  return "/dashboard/auto-trading";
}

export function usePostPurchaseFlow() {
  const router = useRouter();
  const [modalState, setModalState] = useState<{
    type: "license_plan" | "bot_license_plan";
    licenseId: number;
    redirectTo: string;
  } | null>(null);

  function handlePurchaseResult(order: Order, type: PurchasableType) {
    const redirectTo = resolvePurchaseRedirect(type);

    if (type === "license_plan" && order.created_license_id) {
      setModalState({ type, licenseId: order.created_license_id, redirectTo });
      return;
    }

    if (type === "bot_license_plan" && order.created_bot_license_id) {
      setModalState({ type, licenseId: order.created_bot_license_id, redirectTo });
      return;
    }

    router.push(redirectTo);
  }

  function closeModal() {
    if (modalState) router.push(modalState.redirectTo);
    setModalState(null);
  }

  const modal = modalState ? (
    <PostPurchaseDetailsModal
      type={modalState.type}
      licenseId={modalState.licenseId}
      open
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
      onSubmitted={closeModal}
    />
  ) : null;

  return { handlePurchaseResult, modal };
}
