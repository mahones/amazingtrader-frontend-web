"use client";

import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { authButtonClass } from "@/components/auth/AuthCard";

/** Cases du code à 6 chiffres, style maquette (la case active a la bordure orange). */
const otpBoxClass =
  "h-14 w-full min-w-0 rounded-xl border-input bg-background text-xl font-semibold dark:border-[#3A3A3A] dark:bg-background";

export function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Formulaire commun « code à 6 chiffres + renvoi après compte à rebours ».
 * Le parent fournit la soumission et le renvoi ; ce composant gère la saisie et le chrono.
 */
export function OtpCodeForm({
  submitLabel,
  pendingLabel,
  pending,
  error,
  resending,
  initialCooldown,
  resendCooldown,
  onSubmit,
  onResend,
}: {
  submitLabel: string;
  pendingLabel: string;
  pending: boolean;
  error: string | null;
  resending: boolean;
  /** Secondes avant que « Renvoyer » soit actif à l'arrivée (0 si aucun code vient d'être envoyé). */
  initialCooldown: number;
  resendCooldown: number;
  onSubmit: (code: string) => void;
  onResend: () => Promise<boolean>;
}) {
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(initialCooldown);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleResend() {
    if (await onResend()) setCooldown(resendCooldown);
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(code);
        }}
        className="space-y-5"
      >
        <OtpInput
          id="code"
          length={6}
          value={code}
          onChange={setCode}
          disabled={pending}
          autoFocus
          containerClassName="gap-2 sm:gap-3"
          className={otpBoxClass}
        />
        {error && <Alert variant="error">{error}</Alert>}
        <Button type="submit" className={authButtonClass} disabled={pending || code.length !== 6}>
          {pending ? pendingLabel : submitLabel}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {cooldown > 0 ? (
          <>
            Renvoyer le code dans{" "}
            <span className="font-medium tabular-nums text-primary">{formatCountdown(cooldown)}</span>
          </>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
          >
            {resending ? "Envoi..." : "Renvoyer le code"}
          </button>
        )}
      </p>
    </>
  );
}
