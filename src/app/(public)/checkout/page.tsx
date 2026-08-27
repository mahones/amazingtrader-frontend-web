"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaymentMethodSelector, type CheckoutPaymentMethod } from "@/components/purchase/PaymentMethodSelector";
import { useAuth } from "@/context/AuthContext";
import { extractApiError } from "@/lib/api/client";
import { fetchCourses } from "@/lib/api/courses";
import { fetchLicensePlans } from "@/lib/api/licenses";
import { fetchTradingBots } from "@/lib/api/bots";
import {
  createOrder,
  payOrder,
  payOrderWithPayerUrl,
  payOrderWithPayPal,
  validatePromoCode,
  type PurchasableType,
} from "@/lib/api/orders";
import { formatCurrency, formatDuration, stripHtml } from "@/lib/utils";

type Recap = {
  title: string;
  description: string;
  price: number;
  durationLabel: string | null;
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutPageContent />
    </Suspense>
  );
}

function CheckoutPageContent() {
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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedContract, setAcceptedContract] = useState(false);
  const [pending, setPending] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercentage: number;
    discountAmount: number;
    total: number;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoPending, setPromoPending] = useState(false);

  const requiresContract = type === "license_plan" || type === "bot_license_plan";
  const contractLabel =
    type === "license_plan" ? (
      <>
        J&apos;accepte le{" "}
        <Link href="/contrat-du-trading-automatique" target="_blank" className="text-primary hover:underline">
          Contrat du trading automatique
        </Link>
      </>
    ) : (
      <>
        J&apos;accepte le{" "}
        <Link href="/contrat-dutilisation" target="_blank" className="text-primary hover:underline">
          Contrat d&apos;utilisation
        </Link>
      </>
    );
  const canPay = acceptedTerms && (!requiresContract || acceptedContract);

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

  async function handleApplyPromo() {
    if (!type || !promoCodeInput.trim()) return;
    setPromoPending(true);
    setPromoError(null);
    try {
      const result = await validatePromoCode({ code: promoCodeInput.trim(), type, id });
      setAppliedPromo({
        code: result.code,
        discountPercentage: result.discount_percentage,
        discountAmount: result.discount_amount,
        total: result.total,
      });
    } catch (err) {
      setAppliedPromo(null);
      setPromoError(extractApiError(err, "Ce code promo n'est pas valide."));
    } finally {
      setPromoPending(false);
    }
  }

  function handleRemovePromo() {
    setAppliedPromo(null);
    setPromoCodeInput("");
    setPromoError(null);
  }

  async function handlePay() {
    if (!type || !method || !canPay) return;
    setPending(true);
    setPayError(null);
    try {
      const order = await createOrder([{ type, id }], appliedPromo?.code);
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

              <div className="space-y-1.5 border-t border-border pt-2">
                <label htmlFor="promo-code" className="text-muted-foreground">
                  Code promo
                </label>
                <div className="flex gap-2">
                  <Input
                    id="promo-code"
                    value={promoCodeInput}
                    onChange={(e) => {
                      setPromoCodeInput(e.target.value);
                      setPromoError(null);
                    }}
                    placeholder="ex. PROMO20"
                    disabled={!!appliedPromo}
                    className="uppercase"
                  />
                  {appliedPromo ? (
                    <Button type="button" variant="outline" size="sm" onClick={handleRemovePromo}>
                      Retirer
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={promoPending || !promoCodeInput.trim()}
                      onClick={handleApplyPromo}
                    >
                      {promoPending ? "..." : "Appliquer"}
                    </Button>
                  )}
                </div>
                {promoError && <p className="text-sm text-destructive">{promoError}</p>}
                {appliedPromo && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Code {appliedPromo.code} appliqué (-{appliedPromo.discountPercentage}%)
                  </p>
                )}
              </div>

              {appliedPromo && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Réduction</span>
                  <span>-{formatCurrency(appliedPromo.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(appliedPromo ? appliedPromo.total : recap.price)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h2 className="text-lg font-medium">Moyen de paiement</h2>
            <PaymentMethodSelector value={method} onChange={setMethod} />
          </div>

          <div className="space-y-2 rounded-lg border border-border p-4 text-sm">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-0.5 accent-primary"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <span>
                J&apos;accepte les{" "}
                <Link href="/termes-et-conditions" target="_blank" className="text-primary hover:underline">
                  Termes et conditions
                </Link>
              </span>
            </label>
            {requiresContract && (
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-primary"
                  checked={acceptedContract}
                  onChange={(e) => setAcceptedContract(e.target.checked)}
                />
                <span>{contractLabel}</span>
              </label>
            )}
          </div>

          {payError && <Alert variant="error">{payError}</Alert>}

          <Button onClick={handlePay} disabled={!method || !canPay || pending} className="w-full" size="lg">
            {pending ? "Traitement..." : "Payer maintenant"}
          </Button>
        </>
      )}
    </div>
  );
}
