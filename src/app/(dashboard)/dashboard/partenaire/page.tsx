"use client";

import { useEffect, useState } from "react";
import { Copy, Handshake, TrendingUp, Wallet } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { EditPartnerCodeDialog } from "@/components/partner/EditPartnerCodeDialog";
import { PartnerLevelsDialog } from "@/components/partner/PartnerLevelsDialog";
import { RequestWithdrawalDialog } from "@/components/partner/RequestWithdrawalDialog";
import { useRequireRole } from "@/hooks/useRequireRole";
import { applyForPartnerProgram, fetchMyPartnerProfile, fetchMyWithdrawals } from "@/lib/api/partners";
import { extractApiError } from "@/lib/api/client";
import { formatCurrency, formatDate, formatPartnerAmount } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { Partner } from "@/types/partner";
import type { Withdrawal, WithdrawalStatus } from "@/types/withdrawal";

const withdrawalStatusVariant: Record<WithdrawalStatus, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

const withdrawalStatusLabel: Record<WithdrawalStatus, string> = {
  pending: "En attente",
  approved: "Approuvé",
  rejected: "Rejeté",
};

export default function DashboardPartnerPage() {
  useRequireRole(["user"]);

  const [partner, setPartner] = useState<Partner | null | undefined>(undefined);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [applyPending, setApplyPending] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  async function reload() {
    const profile = await fetchMyPartnerProfile();
    setPartner(profile);
    if (profile?.status === "approved") {
      setWithdrawals(await fetchMyWithdrawals());
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  async function handleApply() {
    setApplyPending(true);
    setApplyError(null);
    try {
      await applyForPartnerProgram();
      toast.success("Votre demande a été envoyée.");
      await reload();
    } catch (err) {
      setApplyError(extractApiError(err, "Impossible d'envoyer votre demande."));
    } finally {
      setApplyPending(false);
    }
  }

  function handleCopyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast.success("Code copié.");
  }

  function handleWithdrawalRequested(withdrawal: Withdrawal) {
    // Balance is only actually deducted once an admin approves the request
    // (see backend ApproveWithdrawalAction), so it's left untouched here —
    // only the pending request itself is reflected.
    setWithdrawals((prev) => [withdrawal, ...prev]);
  }

  if (partner === undefined) {
    return <p className="text-muted-foreground">Chargement...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Espace Partenaire</h1>
        <p className="text-muted-foreground">
          Partagez votre code partenaire, suivez vos gains et demandez vos retraits.
        </p>
      </div>

      {partner === null && (
        <Card>
          <CardHeader>
            <CardTitle>Devenez partenaire</CardTitle>
            <CardDescription>
              Obtenez un code personnel : vos filleuls bénéficient d&apos;une réduction sur leurs achats, et vous
              touchez une commission sur chaque vente réalisée grâce à votre code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {applyError && <Alert variant="error">{applyError}</Alert>}
            <Button onClick={handleApply} disabled={applyPending}>
              <Handshake className="mr-1 size-4" />
              {applyPending ? "Envoi..." : "Devenir partenaire"}
            </Button>
          </CardContent>
        </Card>
      )}

      {partner?.status === "pending" && (
        <Alert>Votre demande est en cours d&apos;examen par notre équipe.</Alert>
      )}

      {partner?.status === "rejected" && (
        <Card>
          <CardHeader>
            <CardTitle>Demande refusée</CardTitle>
            <CardDescription>Votre précédente demande de partenariat n&apos;a pas été approuvée.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {applyError && <Alert variant="error">{applyError}</Alert>}
            <Button onClick={handleApply} disabled={applyPending}>
              {applyPending ? "Envoi..." : "Réessayer"}
            </Button>
          </CardContent>
        </Card>
      )}

      {partner?.status === "approved" && (
        <>
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Votre code partenaire</p>
                <div className="flex items-center gap-1">
                  <p className="font-mono text-2xl font-bold tracking-wider">{partner.code}</p>
                  {partner.type !== "assigned" && partner.is_code_editable && (
                    <EditPartnerCodeDialog code={partner.code!} onUpdated={setPartner} />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PartnerLevelsDialog
                  partner={partner}
                  trigger={
                    <Badge className={partner.type === "assigned" ? undefined : "cursor-pointer"}>
                      {partner.type === "assigned" ? "Partenaire sous contrat" : (partner.level_name ?? "-")}
                    </Badge>
                  }
                />
                <Button variant="outline" size="sm" onClick={() => handleCopyCode(partner.code!)}>
                  <Copy className="mr-1 size-4" /> Copier
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex h-full flex-col gap-3 pt-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Wallet className="size-5" />
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold">{formatCurrency(partner.balance)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Solde disponible</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex h-full flex-col gap-3 pt-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold">{formatCurrency(partner.total_earned)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Total gagné</p>
                </div>
              </CardContent>
            </Card>
            <PartnerLevelsDialog
              partner={partner}
              trigger={
                <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                  <CardContent className="flex h-full flex-col justify-center gap-1 pt-6">
                    <p className="text-sm text-muted-foreground">
                      {partner.type === "assigned" ? "Type de partenariat" : "Votre niveau"}
                    </p>
                    <p className="text-lg font-semibold">
                      {partner.type === "assigned" ? "Sous contrat" : (partner.level_name ?? "-")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {partner.gain_percentage}% de gain · {partner.discount_percentage}% de réduction offerte
                    </p>
                  </CardContent>
                </Card>
              }
            />
            <Card>
              <CardContent className="flex h-full flex-col items-center justify-center gap-2 pt-6 text-center">
                {partner.type === "assigned" ? (
                  <p className="text-sm text-muted-foreground">Pourcentages fixes définis par contrat</p>
                ) : partner.next_level ? (
                  <>
                    <div className="relative flex items-center justify-center">
                      <ProgressRing
                        percent={
                          (partner.cumulative_referred_purchases / partner.next_level.min_cumulative_purchases) * 100
                        }
                        size={72}
                        strokeWidth={7}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatPartnerAmount(partner.next_level.amount_remaining)} avant {partner.next_level.name}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Niveau maximum atteint</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Retraits</CardTitle>
                <CardDescription>Historique de vos demandes de retrait.</CardDescription>
              </div>
              <RequestWithdrawalDialog
                balance={partner.balance}
                onRequested={handleWithdrawalRequested}
                trigger={<Button disabled={partner.balance <= 0}>Demander un retrait</Button>}
              />
            </CardHeader>
            <CardContent className="space-y-3">
              {withdrawals.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucune demande de retrait pour le moment.</p>
              )}
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{formatCurrency(withdrawal.amount)}</p>
                    <p className="text-muted-foreground">
                      {withdrawal.payment_method} · {withdrawal.receiving_identifier} ·{" "}
                      {formatDate(withdrawal.created_at)}
                    </p>
                  </div>
                  <Badge variant={withdrawalStatusVariant[withdrawal.status]}>
                    {withdrawalStatusLabel[withdrawal.status]}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
