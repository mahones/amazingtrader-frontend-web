"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignPartnerDialog } from "@/components/admin/AssignPartnerDialog";
import { PartnerLevelDialog } from "@/components/admin/PartnerLevelDialog";
import { useRequireRole } from "@/hooks/useRequireRole";
import {
  approvePartnerApplication,
  fetchApprovedPartners,
  fetchPartnerApplications,
  fetchPartnerLevels,
  rejectPartnerApplication,
} from "@/lib/api/admin";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { Partner, PartnerLevelConfig } from "@/types/partner";

function PartnerApplicationReviewCard({
  application,
  onReviewed,
}: {
  application: Partner;
  onReviewed: (id: number) => void;
}) {
  const [pending, setPending] = useState(false);

  async function handle(action: () => Promise<Partner>, successMessage: string) {
    setPending(true);
    try {
      await action();
      onReviewed(application.id);
      toast.success(successMessage);
    } catch {
      toast.error("Impossible de traiter cette demande.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-dashed border-amber-500/50 bg-amber-500/10 p-3 text-sm">
      <p className="font-medium text-amber-700 dark:text-amber-400">
        Demande de partenariat depuis le {formatDate(application.created_at)}
      </p>
      <p>
        <span className="text-muted-foreground">Nom :</span> {application.user?.name}
      </p>
      <p>
        <span className="text-muted-foreground">Email :</span> {application.user?.email}
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={pending}
          onClick={() => handle(() => approvePartnerApplication(application.id), "Partenaire approuvé.")}
        >
          Approuver
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => handle(() => rejectPartnerApplication(application.id), "Demande rejetée.")}
        >
          Rejeter
        </Button>
      </div>
    </div>
  );
}

export default function DashboardPartnersPage() {
  useRequireRole(["admin", "developer"]);

  const [applications, setApplications] = useState<Partner[] | null>(null);
  const [levels, setLevels] = useState<PartnerLevelConfig[] | null>(null);
  const [partners, setPartners] = useState<Partner[] | null>(null);

  useEffect(() => {
    fetchPartnerApplications().then(setApplications);
    fetchPartnerLevels().then(setLevels);
    fetchApprovedPartners().then(setPartners);
  }, []);

  function handleReviewed(id: number) {
    setApplications((prev) => prev?.filter((a) => a.id !== id) ?? null);
  }

  function handleLevelSaved(updated: PartnerLevelConfig) {
    setLevels((prev) => prev?.map((l) => (l.id === updated.id ? updated : l)) ?? null);
  }

  function handlePartnerUpdated(updated: Partner) {
    setPartners((prev) => prev?.map((p) => (p.id === updated.id ? updated : p)) ?? null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Partenaires</h1>
        <p className="text-muted-foreground">
          Gérez les demandes de partenariat, les codes sous contrat et la grille des niveaux (gain, réduction,
          seuils).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes en attente</CardTitle>
          <CardDescription>Approuvez ou rejetez les demandes pour devenir partenaire.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {applications === null && <p className="text-muted-foreground">Chargement...</p>}
          {applications?.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune demande en attente.</p>
          )}
          {applications?.map((application) => (
            <PartnerApplicationReviewCard
              key={application.id}
              application={application}
              onReviewed={handleReviewed}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Partenaires actifs</CardTitle>
          <CardDescription>
            Codes auto-inscrits (grille de niveaux) et codes sous contrat (pourcentages fixes, assignés directement
            depuis la fiche d&apos;un utilisateur).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {partners === null && <p className="text-muted-foreground">Chargement...</p>}
          {partners?.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun partenaire actif pour le moment.</p>
          )}
          {partners?.map((partner) => (
            <div
              key={partner.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-semibold tracking-wider">{partner.code}</p>
                  <Badge variant={partner.type === "assigned" ? "secondary" : "outline"}>
                    {partner.type === "assigned" ? "Sous contrat" : "Auto-inscription"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {partner.user?.name} ({partner.user?.email}) · {partner.gain_percentage ?? 0}% de gain ·{" "}
                  {partner.discount_percentage ?? 0}% de réduction
                  {partner.type === "self_service" && partner.level_name ? ` · niveau ${partner.level_name}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">Solde : {formatCurrency(partner.balance)}</p>
              </div>
              {partner.type === "assigned" && partner.user && (
                <AssignPartnerDialog
                  userId={partner.user.id}
                  existingPartner={partner}
                  onSaved={handlePartnerUpdated}
                  trigger={
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  }
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grille des niveaux</CardTitle>
          <CardDescription>
            Chaque partenaire progresse automatiquement selon le cumul des achats de ses filleuls.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {levels === null && <p className="text-muted-foreground">Chargement...</p>}
          {levels?.map((level) => (
            <div
              key={level.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3"
            >
              <div>
                <p className="font-semibold">{level.name}</p>
                <p className="text-sm text-muted-foreground">
                  {level.gain_percentage}% de gain · {level.discount_percentage}% de réduction · dès{" "}
                  {level.min_cumulative_purchases} $ cumulés
                </p>
              </div>
              <PartnerLevelDialog
                level={level}
                onSaved={handleLevelSaved}
                trigger={
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
