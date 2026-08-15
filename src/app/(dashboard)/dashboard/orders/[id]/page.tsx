"use client";

import { use, useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { extractApiError } from "@/lib/api/client";
import { fetchOrder } from "@/lib/api/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "En attente",
  paid: "Payée",
  failed: "Échouée",
  refunded: "Remboursée",
  canceled: "Annulée",
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const orderId = Number(id);
  const { user, isLoading: authLoading } = useRequireAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchOrder(orderId)
      .then(setOrder)
      .catch((err) => setLoadError(extractApiError(err, "Impossible de charger cette commande.")));
  }, [user, orderId]);

  if (authLoading || !user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Commande #{orderId}</h1>
        <p className="text-muted-foreground">Reçu de votre commande.</p>
      </div>

      {loadError && <Alert variant="error">{loadError}</Alert>}

      {!order && !loadError && <p className="text-muted-foreground">Chargement...</p>}

      {order && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">{formatCurrency(order.total_amount, order.currency)}</CardTitle>
            <Badge
              variant={
                order.status === "paid"
                  ? "default"
                  : order.status === "pending"
                    ? "secondary"
                    : "destructive"
              }
            >
              {STATUS_LABEL[order.status]}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1 text-sm">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-muted-foreground">
                  <span>
                    {item.quantity} × {item.purchasable_type}
                  </span>
                  <span>{formatCurrency(item.unit_price, order.currency)}</span>
                </div>
              ))}
            </div>

            <div className="grid gap-1 border-t border-border pt-3 text-sm text-muted-foreground">
              <p>Moyen de paiement : {order.gateway === "payerurl" ? "PayerURL (crypto)" : order.gateway}</p>
              {order.paid_at && <p>Payée le {formatDate(order.paid_at)}</p>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
