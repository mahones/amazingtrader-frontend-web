"use client";

import { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { AssignLicenseDialog } from "@/components/admin/AssignLicenseDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CatalogCard, CatalogCardGrid } from "@/components/dashboard/CatalogListCard";
import { useRequireRole } from "@/hooks/useRequireRole";
import {
  fetchAdminBarronsChallenges,
  fetchAdminLicensePlans,
  fetchAdminPartnerRewardClaims,
  fetchAdminTradingBots,
  fulfillPartnerRewardClaim,
} from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { formatDateTime } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { BotLicensePlan } from "@/types/bot";
import type { BarronsChallengeLicensePlan } from "@/types/barronsChallenge";
import type { LicensePlan } from "@/types/license";
import type { AdminPartnerRewardClaim } from "@/types/partner";

function RewardClaimCard({
  claim,
  licensePlans,
  botLicensePlans,
  barronsChallengeLicensePlans,
  onFulfilled,
}: {
  claim: AdminPartnerRewardClaim;
  licensePlans: LicensePlan[];
  botLicensePlans: (BotLicensePlan & { botName: string })[];
  barronsChallengeLicensePlans: (BarronsChallengeLicensePlan & { challengeName: string })[];
  onFulfilled: (claim: AdminPartnerRewardClaim) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fulfilling, setFulfilling] = useState(false);

  async function markFulfilled() {
    setFulfilling(true);
    try {
      const updated = await fulfillPartnerRewardClaim(claim.id);
      onFulfilled(updated);
      toast.success("Cadeau marqué comme traité.");
    } catch (err) {
      toast.error(extractApiError(err, "Impossible de marquer ce cadeau comme traité."));
    } finally {
      setFulfilling(false);
    }
  }

  function handleLicenseAssigned() {
    setDialogOpen(false);
    void markFulfilled();
  }

  return (
    <CatalogCard
      title={`${claim.partner.user?.name ?? "Utilisateur"} · Cadeau ${claim.level_name ?? claim.level}`}
      badges={claim.status === "fulfilled" && <Badge>Traité</Badge>}
      caption={
        <>
          <p>
            {claim.partner.user?.email} · code {claim.partner.code}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">Réclamé le {formatDateTime(claim.claimed_at)}</p>
          {claim.fulfilled_by && (
            <p className="text-xs text-muted-foreground/70">par {claim.fulfilled_by.name}</p>
          )}
        </>
      }
      actions={
        claim.status === "pending" && (
          <AssignLicenseDialog
            userId={claim.partner.user?.id ?? 0}
            whatsappNumber={claim.partner.user?.whatsapp_number ?? null}
            licensePlans={licensePlans}
            botLicensePlans={botLicensePlans}
            barronsChallengeLicensePlans={barronsChallengeLicensePlans}
            onLicenseAssigned={handleLicenseAssigned}
            onBotLicenseAssigned={handleLicenseAssigned}
            onBarronsChallengeLicenseAssigned={handleLicenseAssigned}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            trigger={<Button size="sm">Traiter</Button>}
          />
        )
      }
    />
  );
}

export default function DashboardRewardClaimsPage() {
  useRequireRole(["admin", "developer"]);

  const [claims, setClaims] = useState<AdminPartnerRewardClaim[] | null>(null);
  const [licensePlans, setLicensePlans] = useState<LicensePlan[]>([]);
  const [botLicensePlans, setBotLicensePlans] = useState<(BotLicensePlan & { botName: string })[]>([]);
  const [barronsChallengeLicensePlans, setBarronsChallengeLicensePlans] = useState<
    (BarronsChallengeLicensePlan & { challengeName: string })[]
  >([]);

  useEffect(() => {
    fetchAdminPartnerRewardClaims().then(setClaims);
    fetchAdminLicensePlans().then(setLicensePlans);
    fetchAdminTradingBots().then((bots) => {
      const plans = bots.flatMap((bot) =>
        (bot.license_plans ?? []).map((plan) => ({ ...plan, botName: bot.name }))
      );
      setBotLicensePlans(plans);
    });
    fetchAdminBarronsChallenges().then((challenges) => {
      const plans = challenges.flatMap((challenge) =>
        (challenge.license_plans ?? []).map((plan) => ({ ...plan, challengeName: challenge.name }))
      );
      setBarronsChallengeLicensePlans(plans);
    });
  }, []);

  function handleFulfilled(updated: AdminPartnerRewardClaim) {
    setClaims((prev) => prev?.map((c) => (c.id === updated.id ? updated : c)) ?? null);
  }

  const pending = claims?.filter((c) => c.status === "pending") ?? [];
  const fulfilled = claims?.filter((c) => c.status === "fulfilled") ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Gift className="size-6 text-primary" /> Cadeaux partenaires
        </h1>
        <p className="text-muted-foreground">
          Suivez les cadeaux réclamés par les partenaires et assignez-leur une licence.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">En attente</h2>
        {claims === null && <p className="text-muted-foreground">Chargement...</p>}
        {claims !== null && pending.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Aucun cadeau en attente de traitement.
            </CardContent>
          </Card>
        )}
        <CatalogCardGrid>
          {pending.map((claim) => (
            <RewardClaimCard
              key={claim.id}
              claim={claim}
              licensePlans={licensePlans}
              botLicensePlans={botLicensePlans}
              barronsChallengeLicensePlans={barronsChallengeLicensePlans}
              onFulfilled={handleFulfilled}
            />
          ))}
        </CatalogCardGrid>
      </div>

      {fulfilled.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Traités</h2>
          <CatalogCardGrid>
            {fulfilled.map((claim) => (
              <RewardClaimCard
                key={claim.id}
                claim={claim}
                licensePlans={licensePlans}
                botLicensePlans={botLicensePlans}
                barronsChallengeLicensePlans={barronsChallengeLicensePlans}
                onFulfilled={handleFulfilled}
              />
            ))}
          </CatalogCardGrid>
        </div>
      )}
    </div>
  );
}
