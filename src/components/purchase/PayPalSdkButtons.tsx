"use client";

import { useEffect, useRef, useState } from "react";
import { FUNDING, PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { extractApiError } from "@/lib/api/client";
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
  // PayPal expands the card button's iframe in place (absolutely positioned, ~950px tall)
  // instead of opening a popup, so it would cover the content below. Reserve that room.
  const [cardFormOpen, setCardFormOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  // The SDK's onError only receives a generic wrapper error; keep our API's real message.
  const lastCreateError = useRef<string | null>(null);

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
    createOrder: async () => {
      lastCreateError.current = null;
      try {
        return await createOrder();
      } catch (err) {
        lastCreateError.current = extractApiError(err, "Impossible de créer le paiement.");
        throw err;
      }
    },
    onApprove: async () => {
      try {
        await onApprove();
      } catch (err) {
        setCardFormOpen(false);
        onError(err instanceof Error ? err.message : "Le paiement a échoué. Veuillez réessayer.");
      }
    },
    onCancel: () => setCardFormOpen(false),
    onError: (err: unknown) => {
      console.error("PayPal error", err);
      setCardFormOpen(false);
      onError(lastCreateError.current ?? "Le paiement a échoué ou a été refusé par PayPal. Veuillez réessayer ou utiliser une autre carte.");
    },
  };

  function handleCardClick() {
    setCardFormOpen(true);
    setTimeout(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  return (
    <PayPalScriptProvider
      options={{ clientId, currency: currency.toUpperCase(), intent: "capture", components: "buttons", locale: "fr_FR" }}
    >
      <div className="isolate space-y-3">
        <PayPalButtons {...buttonProps} fundingSource={FUNDING.PAYPAL} />
        <div ref={cardRef} className="scroll-mt-32" style={{ minHeight: cardFormOpen ? 1000 : undefined }}>
          <PayPalButtons {...buttonProps} fundingSource={FUNDING.CARD} onClick={handleCardClick} />
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
