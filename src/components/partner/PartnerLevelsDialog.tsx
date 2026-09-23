"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, formatPartnerAmount } from "@/lib/utils";
import type { Partner } from "@/types/partner";

export function PartnerLevelsDialog({
  partner,
  trigger,
}: {
  partner: Partner;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);

  if (!partner.levels) {
    return trigger;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} nativeButton={false} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Niveaux partenaire</DialogTitle>
          <DialogDescription>
            Cumulez des achats via votre code pour monter de niveau et augmenter vos avantages.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {partner.levels.map((level) => {
            const isCurrent = level.level === partner.level;
            const pointsToReach = Math.max(0, level.min_cumulative_purchases - partner.cumulative_referred_purchases);

            return (
              <div
                key={level.level}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg border p-3",
                  isCurrent ? "border-primary bg-primary/5" : "border-border",
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{level.name}</p>
                    {isCurrent && <Badge>Niveau actuel</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {level.gain_percentage}% de gain · {level.discount_percentage}% de réduction offerte
                  </p>
                </div>
                <p className="shrink-0 text-right text-sm text-muted-foreground">
                  {level.min_cumulative_purchases === 0
                    ? "Dès l'inscription"
                    : isCurrent || pointsToReach === 0
                      ? "Atteint"
                      : `${formatPartnerAmount(pointsToReach)} restants`}
                </p>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
