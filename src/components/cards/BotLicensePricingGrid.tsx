"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import type { BotLicenseOfferType, BotLicensePlan } from "@/types/bot";

function PlanCard({
  plan,
  onSelect,
  isPending,
}: {
  plan: BotLicensePlan;
  onSelect: (plan: BotLicensePlan) => void;
  isPending?: number | null;
}) {
  return (
    <Card className={`flex flex-col ${plan.is_featured ? "border-primary shadow-lg shadow-primary/10" : ""}`}>
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
          {plan.duration_days && (
            <span className="text-sm text-muted-foreground"> / {plan.duration_days} jours</span>
          )}
        </div>
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

export function BotLicensePricingGrid({
  plans,
  onSelect,
  isPending,
}: {
  plans: BotLicensePlan[];
  onSelect: (plan: BotLicensePlan) => void;
  isPending?: number | null;
}) {
  const timeLimited = plans.filter((p) => p.offer_type === "time_limited");
  const lifetime = plans.filter((p) => p.offer_type === "lifetime");

  if (timeLimited.length === 0 && lifetime.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune licence disponible pour ce bot pour le moment.
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
}: {
  timeLimited: BotLicensePlan[];
  lifetime: BotLicensePlan[];
  onSelect: (plan: BotLicensePlan) => void;
  isPending?: number | null;
}) {
  const [activeOffer, setActiveOffer] = useState<BotLicenseOfferType>("time_limited");
  const plans = activeOffer === "time_limited" ? timeLimited : lifetime;

  return (
    <div>
      <Tabs
        value={activeOffer}
        onValueChange={(value) => value && setActiveOffer(value as BotLicenseOfferType)}
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
