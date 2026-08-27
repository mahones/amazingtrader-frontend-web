"use client";

import { Suspense, use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostPurchaseDetailsForm } from "@/components/purchase/PostPurchaseDetailsForm";
import { useAuth } from "@/context/AuthContext";
import { extractApiError } from "@/lib/api/client";
import {
  capturePayPalPayment,
  fetchOrder,
  fetchPayerUrlConfig,
  simulatePayerUrlPayment,
  type PurchasableType,
} from "@/lib/api/orders";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/types/order";

const PURCHASABLE_TYPE_BY_CLASS: Record<string, PurchasableType> = {
  Course: "course",
  LicensePlan: "license_plan",
  BotLicensePlan: "bot_license_plan",
};

// PayerURL is real crypto, not instant — a genuine webhook can take a
// little while to arrive. Poll for up to 2 minutes before giving up.
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40;

export default function CheckoutConfirmPage({ params }: { params: Promise<{ orderId: string }> }) {
  return (
    <Suspense fallback={null}>
      <CheckoutConfirmPageContent params={params} />
    </Suspense>
  );
}

function CheckoutConfirmPageContent({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId: orderIdParam } = use(params);
  const orderId = Number(orderIdParam);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [fakeMode, setFakeMode] = useState<boolean | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<"paid" | "cancel" | null>(null);
  const [simulateError, setSimulateError] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const hasHandledPaidRedirectRef = useRef(false);
  const hasCapturedPayPalRef = useRef(false);

  async function reload() {
    try {
      const fresh = await fetchOrder(orderId);
      setOrder(fresh);
      return fresh;
    } catch (err) {
      setLoadError(extractApiError(err, "Impossible de charger cette commande."));
      return null;
    }
  }

  useEffect(() => {
    if (authLoading || !user) return;
    fetchPayerUrlConfig()
      .then((config) => setFakeMode(config.fake_mode))
      .catch(() => setFakeMode(false));
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, orderId]);

  // Real (non-fake) PayerURL checkout confirms asynchronously via webhook —
  // poll until the status leaves "pending" instead of leaving the customer
  // staring at a stale page.
  useEffect(() => {
    if (fakeMode !== false || order?.gateway !== "payerurl" || order?.status !== "pending") return;

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      const fresh = await reload();
      if (attempts >= MAX_POLL_ATTEMPTS || fresh?.status !== "pending") {
        clearInterval(interval);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fakeMode, order?.gateway, order?.status]);

  // PayPal redirects the buyer back here after approval, with ?PayerID=...
  // in the URL (absent if they hit "cancel" on PayPal's page instead).
  // Capture immediately rather than waiting on the webhook, for a fast
  // confirmation — the webhook is only a fallback for abandoned tabs.
  useEffect(() => {
    if (order?.gateway !== "paypal" || order?.status !== "pending" || hasCapturedPayPalRef.current) return;
    if (!searchParams.get("PayerID")) return;

    hasCapturedPayPalRef.current = true;
    capturePayPalPayment(orderId)
      .then((fresh) => setOrder(fresh))
      .catch((err) => setCaptureError(extractApiError(err, "Impossible de finaliser le paiement PayPal.")));
  }, [order?.gateway, order?.status, orderId, searchParams]);

  // A course purchase has nothing to configure — send the buyer straight
  // into their new formation as soon as payment is confirmed.
  useEffect(() => {
    if (!order || order.status !== "paid" || hasHandledPaidRedirectRef.current) return;
    const purchasableClass = order.items?.[0]?.purchasable_type;
    if (PURCHASABLE_TYPE_BY_CLASS[purchasableClass ?? ""] !== "course" || !order.created_enrollment_id) return;

    hasHandledPaidRedirectRef.current = true;
    router.replace(`/dashboard/formations/${order.created_enrollment_id}`);
  }, [order, router]);

  async function handleSimulate(outcome: "paid" | "cancel") {
    setSimulating(outcome);
    setSimulateError(null);
    try {
      await simulatePayerUrlPayment(orderId, outcome);
      await reload();
    } catch (err) {
      setSimulateError(extractApiError(err, "Impossible de simuler ce paiement."));
    } finally {
      setSimulating(null);
    }
  }

  if (authLoading || !user) return null;

  const type = order ? PURCHASABLE_TYPE_BY_CLASS[order.items?.[0]?.purchasable_type ?? ""] : undefined;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-bold">Confirmation de commande</h1>
        <p className="text-muted-foreground">Commande #{orderId}</p>
      </div>

      {loadError && <Alert variant="error">{loadError}</Alert>}

      {!order && !loadError && <p className="text-muted-foreground">Chargement...</p>}

      {order && order.status === "pending" && order.gateway === "payerurl" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{formatCurrency(order.total_amount, order.currency)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fakeMode === true && (
              <div className="space-y-3 rounded-md border border-dashed border-border p-4">
                <p className="text-sm">
                  <span className="font-medium">Mode simulation</span> — PayerURL n&apos;a pas de sandbox,
                  aucune crypto n&apos;est dépensée ici. Choisissez une issue pour continuer :
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => handleSimulate("paid")} disabled={simulating !== null}>
                    {simulating === "paid" ? "Simulation..." : "Simuler un paiement réussi"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSimulate("cancel")}
                    disabled={simulating !== null}
                  >
                    {simulating === "cancel" ? "Simulation..." : "Simuler une annulation"}
                  </Button>
                </div>
                {simulateError && <Alert variant="error">{simulateError}</Alert>}
              </div>
            )}
            {fakeMode === false && <Alert>En attente de confirmation du paiement par PayerURL...</Alert>}
          </CardContent>
        </Card>
      )}

      {order && order.status === "pending" && order.gateway === "paypal" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{formatCurrency(order.total_amount, order.currency)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchParams.get("PayerID") ? (
              <Alert>Finalisation du paiement PayPal...</Alert>
            ) : (
              <Alert variant="error">
                Paiement PayPal annulé.{" "}
                <Link href="/" className="font-medium underline">
                  Retour à l&apos;accueil
                </Link>
              </Alert>
            )}
            {captureError && <Alert variant="error">{captureError}</Alert>}
          </CardContent>
        </Card>
      )}

      {order && order.status === "canceled" && (
        <Alert variant="error">
          Paiement annulé.{" "}
          <Link href="/" className="font-medium underline">
            Retour à l&apos;accueil
          </Link>
        </Alert>
      )}

      {order && order.status === "failed" && (
        <Alert variant="error">
          Le paiement a échoué.{" "}
          <Link href="/" className="font-medium underline">
            Retour à l&apos;accueil
          </Link>
        </Alert>
      )}

      {order && order.status === "paid" && type === "bot_license_plan" && order.created_bot_license_id && (
        <Card>
          <CardHeader>
            <CardTitle>Activer votre bot de trading</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Renseignez l&apos;identifiant de votre compte MT5 sur lequel le bot sera installé.
            </p>
            <PostPurchaseDetailsForm
              type="bot_license_plan"
              licenseId={order.created_bot_license_id}
              onSubmitted={() => router.push("/dashboard/bots")}
            />
          </CardContent>
        </Card>
      )}

      {order && order.status === "paid" && type === "license_plan" && order.created_license_id && (
        <Card>
          <CardHeader>
            <CardTitle>Activer votre licence auto-trading</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Renseignez vos identifiants de connexion de votre compte mt5 pour activer votre licence d&apos;auto-trading.
            </p>
            <PostPurchaseDetailsForm
              type="license_plan"
              licenseId={order.created_license_id}
              onSubmitted={() => router.push("/dashboard/auto-trading")}
            />
          </CardContent>
        </Card>
      )}

      {order && order.status === "paid" && type === "course" && (
        <p className="text-muted-foreground">Redirection vers votre formation...</p>
      )}
    </div>
  );
}
