"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { EurekaChallengeLicenseOfferType, EurekaChallengeLicensePlan } from "@/types/eurekaChallenge";

function getPlanIdFromHash(): number | null {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/^#plan-(\d+)$/);
  return match ? Number(match[1]) : null;
}

function PlanCard({
  plan,
  onSelect,
  isPending,
}: {
  plan: EurekaChallengeLicensePlan;
  onSelect: (plan: EurekaChallengeLicensePlan) => void;
  isPending?: number | null;
}) {
  return (
    <Card
      id={`plan-${plan.id}`}
      className={`flex flex-col ${plan.is_featured ? "border-primary shadow-lg shadow-primary/10" : ""}`}
    >
      <CardHeader>
        {plan.is_featured && (
          <span className="mb-2 inline-block w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Populaire
          </span>
        )}
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        {plan.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}
        <div className="mt-2">
          <span className="text-3xl font-bold text-primary">{formatCurrency(plan.price)}</span>
          {plan.duration_value && plan.duration_unit && (
            <span className="text-sm text-muted-foreground">
              {" "}
              / {formatDuration(plan.duration_value, plan.duration_unit)}
            </span>
          )}
        </div>
        <Badge variant="secondary" className="mt-2 w-fit">
          {plan.number_of_accounts} compte{plan.number_of_accounts > 1 ? "s" : ""} inclus
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <ul className="space-y-2 text-sm">
          {plan.features.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={plan.is_featured ? "default" : "outline"}
          onClick={() => onSelect(plan)}
          disabled={isPending === plan.id}
        >
          {isPending === plan.id ? "Traitement..." : "Choisir cette licence"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function EurekaChallengeLicensePricingGrid({
  plans,
  onSelect,
  isPending,
}: {
  plans: EurekaChallengeLicensePlan[];
  onSelect: (plan: EurekaChallengeLicensePlan) => void;
  isPending?: number | null;
}) {
  const timeLimited = plans.filter((p) => p.offer_type === "time_limited");
  const lifetime = plans.filter((p) => p.offer_type === "lifetime");

  const targetPlanId = getPlanIdFromHash();
  const initialOffer: EurekaChallengeLicenseOfferType = lifetime.some((p) => p.id === targetPlanId)
    ? "lifetime"
    : "time_limited";

  useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash) return;
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (timeLimited.length === 0 && lifetime.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune licence disponible pour ce challenge pour le moment.
      </p>
    );
  }

  if (timeLimited.length === 0 || lifetime.length === 0) {
    const only = timeLimited.length > 0 ? timeLimited : lifetime;
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        {only.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={onSelect} isPending={isPending} />
        ))}
      </div>
    );
  }

  return (
    <OfferTabs
      timeLimited={timeLimited}
      lifetime={lifetime}
      onSelect={onSelect}
      isPending={isPending}
      initialOffer={initialOffer}
    />
  );
}

// This project's Tabs primitive ships without CSS for its inert/transition panel
// states, so TabsContent renders both panels stacked at once. Drive visibility
// from local state instead of relying on that built-in show/hide behavior.
function OfferTabs({
  timeLimited,
  lifetime,
  onSelect,
  isPending,
  initialOffer,
}: {
  timeLimited: EurekaChallengeLicensePlan[];
  lifetime: EurekaChallengeLicensePlan[];
  onSelect: (plan: EurekaChallengeLicensePlan) => void;
  isPending?: number | null;
  initialOffer: EurekaChallengeLicenseOfferType;
}) {
  const [activeOffer, setActiveOffer] = useState<EurekaChallengeLicenseOfferType>(initialOffer);
  const plans = activeOffer === "time_limited" ? timeLimited : lifetime;

  return (
    <div>
      <Tabs
        value={activeOffer}
        onValueChange={(value) => value && setActiveOffer(value as EurekaChallengeLicenseOfferType)}
      >
        <TabsList>
          <TabsTrigger value="time_limited">Time-limited Offer</TabsTrigger>
          <TabsTrigger value="lifetime">Lifetime Offer</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={onSelect} isPending={isPending} />
        ))}
      </div>
    </div>
  );
}
