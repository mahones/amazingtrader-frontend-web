"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayPalSdkButtons } from "@/components/purchase/PayPalSdkButtons";
import { useAuth } from "@/context/AuthContext";
import { extractApiError } from "@/lib/api/client";
import { capturePayPalPayment, createPayPalSdkOrder, fetchOrder } from "@/lib/api/orders";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/types/order";

/**
 * Dedicated page for PayPal / card payment. PayPal renders its card form inline
 * (~950px tall), so it lives on a page of its own rather than inside the checkout.
 */
export default function CheckoutPayPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId: orderIdParam } = use(params);
  const orderId = Number(orderIdParam);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/checkout/${orderId}/pay`)}`);
      return;
    }
    fetchOrder(orderId)
      .then((fresh) => {
        if (fresh.status === "paid") router.replace(`/checkout/${orderId}/confirm`);
        else setOrder(fresh);
      })
      .catch((err) => setLoadError(extractApiError(err, "Impossible de charger cette commande.")));
  }, [authLoading, user, orderId, router]);

  async function handleApprove() {
    try {
      await capturePayPalPayment(orderId);
    } catch (err) {
      throw new Error(extractApiError(err, "Le paiement a été refusé. Veuillez réessayer."));
    }
    router.push(`/checkout/${orderId}/confirm`);
  }

  if (authLoading || !user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-bold">Paiement</h1>
        <p className="text-muted-foreground">Payez par carte bancaire (sans compte) ou avec PayPal.</p>
      </div>

      {loadError && <Alert variant="error">{loadError}</Alert>}
      {!order && !loadError && <p className="text-muted-foreground">Chargement...</p>}

      {order && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Total à payer</span>
                <span>{formatCurrency(order.total_amount, order.currency)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/orders" className="text-sm text-muted-foreground hover:text-primary">
                Annuler et revenir plus tard
              </Link>
            </CardContent>
          </Card>

          {payError && <Alert variant="error">{payError}</Alert>}

          <PayPalSdkButtons
            disabled={false}
            currency={order.currency}
            createOrder={() => createPayPalSdkOrder(orderId)}
            onApprove={handleApprove}
            onError={setPayError}
          />
        </>
      )}
    </div>
  );
}
