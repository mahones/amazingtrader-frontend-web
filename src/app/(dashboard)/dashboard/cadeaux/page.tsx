"use client";

import { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { AssignLicenseDialog } from "@/components/admin/AssignLicenseDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRequireRole } from "@/hooks/useRequireRole";
import {
  fetchAdminLicensePlans,
  fetchAdminPartnerRewardClaims,
  fetchAdminTradingBots,
  fulfillPartnerRewardClaim,
} from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { formatDateTime } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { BotLicensePlan } from "@/types/bot";
import type { LicensePlan } from "@/types/license";
import type { AdminPartnerRewardClaim } from "@/types/partner";

function RewardClaimCard({
  claim,
  licensePlans,
  botLicensePlans,
  onFulfilled,
}: {
  claim: AdminPartnerRewardClaim;
  licensePlans: LicensePlan[];
  botLicensePlans: (BotLicensePlan & { botName: string })[];
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
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
        <div>
          <p className="font-medium">
            {claim.partner.user?.name ?? "Utilisateur"} · Cadeau {claim.level_name ?? claim.level}
          </p>
          <p className="text-sm text-muted-foreground">
            {claim.partner.user?.email} · code {claim.partner.code}
          </p>
          <p className="text-xs text-muted-foreground/70">Réclamé le {formatDateTime(claim.claimed_at)}</p>
        </div>

        {claim.status === "pending" ? (
          <AssignLicenseDialog
            userId={claim.partner.user?.id ?? 0}
            whatsappNumber={claim.partner.user?.whatsapp_number ?? null}
            licensePlans={licensePlans}
            botLicensePlans={botLicensePlans}
            onLicenseAssigned={handleLicenseAssigned}
            onBotLicenseAssigned={handleLicenseAssigned}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            trigger={<Button size="sm">Traiter</Button>}
          />
        ) : (
          <div className="text-right">
            <Badge>Traité</Badge>
            {claim.fulfilled_by && (
              <p className="mt-1 text-xs text-muted-foreground">par {claim.fulfilled_by.name}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardRewardClaimsPage() {
  useRequireRole(["admin", "developer"]);

  const [claims, setClaims] = useState<AdminPartnerRewardClaim[] | null>(null);
  const [licensePlans, setLicensePlans] = useState<LicensePlan[]>([]);
  const [botLicensePlans, setBotLicensePlans] = useState<(BotLicensePlan & { botName: string })[]>([]);

  useEffect(() => {
    fetchAdminPartnerRewardClaims().then(setClaims);
    fetchAdminLicensePlans().then(setLicensePlans);
    fetchAdminTradingBots().then((bots) => {
      const plans = bots.flatMap((bot) =>
        (bot.license_plans ?? []).map((plan) => ({ ...plan, botName: bot.name }))
      );
      setBotLicensePlans(plans);
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
        {pending.map((claim) => (
          <RewardClaimCard
            key={claim.id}
            claim={claim}
            licensePlans={licensePlans}
            botLicensePlans={botLicensePlans}
            onFulfilled={handleFulfilled}
          />
        ))}
      </div>

      {fulfilled.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Traités</h2>
          {fulfilled.map((claim) => (
            <RewardClaimCard
              key={claim.id}
              claim={claim}
              licensePlans={licensePlans}
              botLicensePlans={botLicensePlans}
              onFulfilled={handleFulfilled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
