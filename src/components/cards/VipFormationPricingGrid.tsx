"use client";

import { AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { VipFormation } from "@/types/vipFormation";

export function VipFormationPricingGrid({
  formations,
  onSelect,
  isPending,
}: {
  formations: VipFormation[];
  onSelect: (formation: VipFormation) => void;
  isPending?: number | null;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {formations.map((formation) => (
        <Card
          key={formation.id}
          className={`flex flex-col ${formation.is_pinned ? "border-primary shadow-lg shadow-primary/10" : ""}`}
        >
          <CardHeader>
            {formation.is_pinned && (
              <span className="mb-2 inline-block w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {formation.pinned_label || "Populaire"}
              </span>
            )}
            <CardTitle className="text-xl">{formation.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{formation.description}</p>
            <div className="mt-2">
              <span className="text-3xl font-bold text-primary">{formatCurrency(formation.price)}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-2 text-sm">
              {formation.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {formation.note && (
              <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                <p>
                  <span className="font-semibold">Note : </span>
                  {formation.note}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={formation.is_pinned ? "default" : "outline"}
              onClick={() => onSelect(formation)}
              disabled={isPending === formation.id}
            >
              {isPending === formation.id ? "Traitement..." : "S'inscrire"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
