"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentMethodSelector, type CheckoutPaymentMethod } from "@/components/purchase/PaymentMethodSelector";
import { useAuth } from "@/context/AuthContext";
import { extractApiError } from "@/lib/api/client";
import { fetchCourses } from "@/lib/api/courses";
import { fetchLicensePlans } from "@/lib/api/licenses";
import { fetchTradingBots } from "@/lib/api/bots";
import { createOrder, payOrder, payOrderWithPayerUrl, payOrderWithPayPal, type PurchasableType } from "@/lib/api/orders";
import { formatCurrency, formatDuration, stripHtml } from "@/lib/utils";

type Recap = {
  title: string;
  description: string;
  price: number;
  durationLabel: string | null;
};

export default function CheckoutPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawType = searchParams.get("type");
  const type: PurchasableType | null =
    rawType === "course" || rawType === "license_plan" || rawType === "bot_license_plan" ? rawType : null;
  const rawId = searchParams.get("id");
  const id = rawId ? Number(rawId) : NaN;
  const isValidTarget = type !== null && Number.isFinite(id);

  const [recap, setRecap] = useState<Recap | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [method, setMethod] = useState<CheckoutPaymentMethod | null>(null);
  const [pending, setPending] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || user || !isValidTarget) return;
    const redirect = `/checkout?type=${type}&id=${id}`;
    router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
  }, [authLoading, user, isValidTarget, type, id, router]);

  useEffect(() => {
    if (!isValidTarget) return;

    let cancelled = false;

    async function load() {
      try {
        if (type === "course") {
          const course = (await fetchCourses()).find((c) => c.id === id);
          if (!course) throw new Error("not_found");
          if (!cancelled) {
            setRecap({
              title: course.title,
              description: stripHtml(course.description),
              price: course.price,
              durationLabel: `${course.duration_minutes} min de contenu`,
            });
          }
        } else if (type === "license_plan") {
          const plan = (await fetchLicensePlans()).find((p) => p.id === id);
          if (!plan) throw new Error("not_found");
          if (!cancelled) {
            setRecap({
              title: plan.name,
              description: plan.description,
              price: plan.price,
              durationLabel: formatDuration(plan.duration_value, plan.duration_unit),
            });
          }
        } else if (type === "bot_license_plan") {
          const plan = (await fetchTradingBots()).flatMap((b) => b.license_plans ?? []).find((p) => p.id === id);
          if (!plan) throw new Error("not_found");
          if (!cancelled) {
            setRecap({
              title: plan.name,
              description: plan.description ?? "",
              price: plan.price,
              durationLabel:
                plan.duration_value && plan.duration_unit
                  ? formatDuration(plan.duration_value, plan.duration_unit)
                  : "Accès à vie",
            });
          }
        }
      } catch {
        if (!cancelled) setLoadError("Cet élément est introuvable.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [type, id, isValidTarget]);

  async function handlePay() {
    if (!type || !method) return;
    setPending(true);
    setPayError(null);
    try {
      const order = await createOrder([{ type, id }]);
      if (method === "payerurl") {
        window.location.href = await payOrderWithPayerUrl(order.id);
        return;
      }
      if (method === "paypal") {
        window.location.href = await payOrderWithPayPal(order.id);
        return;
      }
      await payOrder(order.id, method);
      router.push(`/checkout/${order.id}/confirm`);
    } catch (err) {
      setPayError(extractApiError(err, "Le paiement a échoué. Veuillez réessayer."));
      setPending(false);
    }
  }

  if (authLoading || !user) return null;

  if (!isValidTarget) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Alert variant="error">Aucun article à acheter n&apos;a été spécifié.</Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-bold">Finaliser votre achat</h1>
        <p className="text-muted-foreground">Vérifiez le récapitulatif et choisissez votre moyen de paiement.</p>
      </div>

      {loadError && <Alert variant="error">{loadError}</Alert>}

      {!recap && !loadError && <p className="text-muted-foreground">Chargement...</p>}

      {recap && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{recap.title}</CardTitle>
              <CardDescription className="line-clamp-3">{recap.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {recap.durationLabel && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Durée</span>
                  <span>{recap.durationLabel}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(recap.price)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h2 className="text-lg font-medium">Moyen de paiement</h2>
            <PaymentMethodSelector value={method} onChange={setMethod} />
          </div>

          {payError && <Alert variant="error">{payError}</Alert>}

          <Button onClick={handlePay} disabled={!method || pending} className="w-full" size="lg">
            {pending ? "Traitement..." : "Payer maintenant"}
          </Button>
        </>
      )}
    </div>
  );
}
