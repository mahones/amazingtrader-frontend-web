"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { LicensePlan } from "@/types/license";

export function LicensePricingGrid({
  plans,
  onSelect,
  isPending,
}: {
  plans: LicensePlan[];
  onSelect: (plan: LicensePlan) => void;
  isPending?: number | null;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan, index) => (
        <Card
          key={plan.id}
          className={`flex flex-col ${index === 1 ? "border-primary shadow-lg shadow-primary/10" : ""}`}
        >
          <CardHeader>
            {index === 1 && (
              <span className="mb-2 inline-block w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Populaire
              </span>
            )}
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
            <div className="mt-2">
              <span className="text-3xl font-bold text-primary">{formatCurrency(plan.price)}</span>
              <span className="text-sm text-muted-foreground"> / {formatDuration(plan.duration_value, plan.duration_unit)}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            <ul className="space-y-2 text-sm">
              {[...plan.features, ...plan.guarantees].map((item) => (
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
              variant={index === 1 ? "default" : "outline"}
              onClick={() => onSelect(plan)}
              disabled={isPending === plan.id}
            >
              {isPending === plan.id ? "Traitement..." : "Acheter cette licence"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
