"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Gift, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { claimPartnerReward } from "@/lib/api/partners";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { Partner, PartnerReward } from "@/types/partner";

function RewardCard({
  reward,
  onClaimed,
}: {
  reward: PartnerReward;
  onClaimed: (partner: Partner) => void;
}) {
  const [pending, setPending] = useState(false);
  const claim = reward.claim;

  async function handleClaim() {
    setPending(true);
    try {
      const partner = await claimPartnerReward(reward.level);
      onClaimed(partner);
      toast.success("Cadeau réclamé ! Notre équipe vous contactera bientôt.");
    } catch (err) {
      toast.error(extractApiError(err, "Impossible de réclamer ce cadeau."));
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className={cn(!reward.unlocked && "opacity-70")}>
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              reward.unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}
          >
            {reward.unlocked ? <Gift className="size-5" /> : <Lock className="size-4" />}
          </div>
          <Badge variant={reward.unlocked ? "default" : "secondary"} className="text-[10px] tracking-wide uppercase">
            {claim?.status === "fulfilled"
              ? "Reçu"
              : claim?.status === "pending"
                ? "En attente"
                : reward.unlocked
                  ? "Débloqué"
                  : "Verrouillé"}
          </Badge>
        </div>

        <p className="font-semibold">Cadeau {reward.name}</p>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progression</span>
            <span>{Math.round(reward.progress_percent)}%</span>
          </div>
          <Progress value={reward.progress_percent} />
        </div>

        {reward.unlocked && !claim && (
          <Button size="sm" className="w-full" onClick={handleClaim} disabled={pending}>
            {pending ? "Réclamation..." : "Réclamer"}
          </Button>
        )}
        {claim?.status === "pending" && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" /> Réclamé, en attente de traitement.
          </p>
        )}
        {claim?.status === "fulfilled" && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-600">
            <CheckCircle2 className="size-3.5" /> Cadeau reçu.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function PartnerRewardsCard({
  partner,
  onUpdated,
}: {
  partner: Partner;
  onUpdated: (partner: Partner) => void;
}) {
  if (partner.rewards.length === 0) return null;

  const claimedCount = partner.rewards.filter((r) => r.claim !== null).length;
  const remaining = partner.rewards.length - claimedCount;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
              <Gift className="size-3.5" /> Cadeaux
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-bold">Mes récompenses</h2>
              <span className="text-sm text-muted-foreground">
                {claimedCount}/{partner.rewards.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Atteignez chaque niveau partenaire pour débloquer un cadeau surprise.
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">À gagner</p>
            <p className="text-2xl font-bold">{remaining}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {partner.rewards.map((reward) => (
          <RewardCard key={reward.level} reward={reward} onClaimed={onUpdated} />
        ))}
      </div>
    </div>
  );
}
