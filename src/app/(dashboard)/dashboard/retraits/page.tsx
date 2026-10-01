"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CatalogCard, CatalogCardGrid } from "@/components/dashboard/CatalogListCard";
import { useRequireRole } from "@/hooks/useRequireRole";
import { approveWithdrawal, fetchAdminWithdrawals, rejectWithdrawal } from "@/lib/api/admin";
import { formatDate, formatPartnerAmount } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { Withdrawal, WithdrawalStatus } from "@/types/withdrawal";

const statusVariant: Record<WithdrawalStatus, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

const statusLabel: Record<WithdrawalStatus, string> = {
  pending: "En attente",
  approved: "Approuvé",
  rejected: "Rejeté",
};

function WithdrawalReviewCard({
  withdrawal,
  onUpdated,
}: {
  withdrawal: Withdrawal;
  onUpdated: (withdrawal: Withdrawal) => void;
}) {
  const [pending, setPending] = useState(false);

  async function handle(action: () => Promise<Withdrawal>, successMessage: string) {
    setPending(true);
    try {
      const updated = await action();
      onUpdated(updated);
      toast.success(successMessage);
    } catch {
      toast.error("Impossible de traiter cette demande.");
    } finally {
      setPending(false);
    }
  }

  return (
    <CatalogCard
      title={`${withdrawal.partner?.user?.name ?? "Partenaire"} · ${formatPartnerAmount(withdrawal.amount)}`}
      badges={
        withdrawal.status !== "pending" && (
          <Badge variant={statusVariant[withdrawal.status]}>{statusLabel[withdrawal.status]}</Badge>
        )
      }
      caption={
        <>
          <p>
            {withdrawal.partner?.user?.email} · code {withdrawal.partner?.code}
          </p>
          <p>
            {withdrawal.payment_method} · {withdrawal.receiving_identifier}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">Demandé le {formatDate(withdrawal.created_at)}</p>
        </>
      }
      actions={
        withdrawal.status === "pending" && (
          <>
            <Button
              size="sm"
              disabled={pending}
              onClick={() => handle(() => approveWithdrawal(withdrawal.id), "Retrait approuvé.")}
            >
              Approuver
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => handle(() => rejectWithdrawal(withdrawal.id), "Retrait rejeté.")}
            >
              Rejeter
            </Button>
          </>
        )
      }
    />
  );
}

export default function DashboardWithdrawalsPage() {
  useRequireRole(["admin", "developer"]);

  const [withdrawals, setWithdrawals] = useState<Withdrawal[] | null>(null);

  async function reload() {
    setWithdrawals(await fetchAdminWithdrawals());
  }

  useEffect(() => {
    void reload();
  }, []);

  function handleUpdated(updated: Withdrawal) {
    setWithdrawals((prev) => prev?.map((w) => (w.id === updated.id ? updated : w)) ?? null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Demandes de retrait</h1>
        <p className="text-muted-foreground">Approuvez ou rejetez les demandes de retrait des partenaires.</p>
      </div>

      {withdrawals === null && <p className="text-muted-foreground">Chargement...</p>}
      {withdrawals?.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Aucune demande de retrait pour le moment.
          </CardContent>
        </Card>
      )}
      <CatalogCardGrid>
        {withdrawals?.map((withdrawal) => (
          <WithdrawalReviewCard key={withdrawal.id} withdrawal={withdrawal} onUpdated={handleUpdated} />
        ))}
      </CatalogCardGrid>
    </div>
  );
}
