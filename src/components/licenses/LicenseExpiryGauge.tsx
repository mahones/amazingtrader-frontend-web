import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

const DAY_MS = 24 * 60 * 60 * 1000;
const EXPIRY_WARNING_DAYS = 7;

export function LicenseExpiryGauge({
  activatedAt,
  expiresAt,
  status,
}: {
  activatedAt: string | null;
  expiresAt: string | null;
  status: "active" | "expired" | "revoked";
}) {
  const [now] = useState(() => Date.now());

  if (!expiresAt) {
    return <Badge variant="secondary">Licence à vie</Badge>;
  }

  const expires = new Date(expiresAt).getTime();
  const activated = activatedAt ? new Date(activatedAt).getTime() : null;

  const daysRemaining = Math.ceil((expires - now) / DAY_MS);
  const isExpired = status !== "active" || now > expires;
  const isExpiringSoon = !isExpired && daysRemaining <= EXPIRY_WARNING_DAYS;

  let percentElapsed = 0;
  if (activated !== null && expires > activated) {
    percentElapsed = Math.min(100, Math.max(0, ((now - activated) / (expires - activated)) * 100));
  }
  if (isExpired) {
    percentElapsed = 100;
  }

  return (
    <div className="space-y-1.5">
      <Progress
        value={percentElapsed}
        className={isExpired ? "[&_[data-slot=progress-indicator]]:bg-destructive" : undefined}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDate(activatedAt)}</span>
        <span className={isExpired ? "font-medium text-destructive" : "font-medium text-foreground"}>
          {isExpired
            ? `Expirée depuis ${Math.abs(daysRemaining)} jour${Math.abs(daysRemaining) > 1 ? "s" : ""}`
            : daysRemaining === 0
              ? "Expire aujourd'hui"
              : `${daysRemaining} jour${daysRemaining > 1 ? "s" : ""} restant${daysRemaining > 1 ? "s" : ""}`}
        </span>
        <span>{formatDate(expiresAt)}</span>
      </div>
      {isExpired && (
        <Alert variant="error" className="gap-2 py-2 text-xs [&>svg]:size-3.5">
          Cette licence a expiré. Renouvelez-la pour continuer à en profiter.
        </Alert>
      )}
      {isExpiringSoon && (
        <Alert variant="warning" className="gap-2 py-2 text-xs [&>svg]:size-3.5">
          Cette licence expire bientôt, pensez à la renouveler.
        </Alert>
      )}
    </div>
  );
}
