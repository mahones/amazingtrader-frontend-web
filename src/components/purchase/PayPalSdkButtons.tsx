"use client";

import { useEffect, useState } from "react";
import { FUNDING, PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { fetchPayPalConfig } from "@/lib/api/orders";

/**
 * PayPal + "Carte bancaire" buttons. Card payment opens PayPal's own popup and
 * does not require a PayPal account. The parent creates our Order and the PayPal
 * order (`createOrder`), and captures it once approved (`onApprove`).
 */
export function PayPalSdkButtons({
  disabled,
  currency,
  createOrder,
  onApprove,
  onError,
}: {
  disabled: boolean;
  currency: string;
  createOrder: () => Promise<string>;
  onApprove: () => Promise<void>;
  onError: (message: string) => void;
}) {
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    fetchPayPalConfig()
      .then(setClientId)
      .catch(() => onError("Impossible de charger PayPal. Veuillez réessayer."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!clientId) return <p className="text-sm text-muted-foreground">Chargement du paiement...</p>;

  const buttonProps = {
    disabled,
    style: { layout: "vertical", shape: "rect", height: 48 } as const,
    createOrder,
    onApprove: async () => {
      try {
        await onApprove();
      } catch (err) {
        onError(err instanceof Error ? err.message : "Le paiement a échoué. Veuillez réessayer.");
      }
    },
    onError: () => onError("Le paiement a échoué. Veuillez réessayer."),
  };

  return (
    <PayPalScriptProvider
      options={{ clientId, currency: currency.toUpperCase(), intent: "capture", components: "buttons", locale: "fr_FR" }}
    >
      <div className="space-y-3">
        <PayPalButtons {...buttonProps} fundingSource={FUNDING.PAYPAL} />
        <PayPalButtons {...buttonProps} fundingSource={FUNDING.CARD} />
      </div>
    </PayPalScriptProvider>
  );
}
