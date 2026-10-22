"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard, authLinkClass } from "@/components/auth/AuthCard";
import { OtpCodeForm } from "@/components/auth/OtpCodeForm";
import { forgotPassword, verifyResetOtp } from "@/lib/api/auth";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";

const RESEND_COOLDOWN_SECONDS = 60;
const RESET_TICKET_STORAGE_KEY = "password_reset_ticket";

export default function ResetOtpPage() {
  return (
    <Suspense fallback={null}>
      <ResetOtpPageContent />
    </Suspense>
  );
}

function ResetOtpPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(code: string) {
    setPending(true);
    setError(null);

    try {
      const { reset_ticket } = await verifyResetOtp(email, code);
      sessionStorage.setItem(RESET_TICKET_STORAGE_KEY, reset_ticket);
      const params = new URLSearchParams({ email });
      router.push(`/reset-password?${params.toString()}`);
    } catch (err) {
      setError(extractApiError(err, "Code de vérification invalide."));
    } finally {
      setPending(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError(null);
    try {
      await forgotPassword(email);
      toast.success("Un nouveau code a été envoyé.");
      return true;
    } catch (err) {
      setError(extractApiError(err, "Impossible de renvoyer le code."));
      return false;
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthCard
      title="Vérification"
      subtitle={
        <>
          Saisissez le code envoyé à{" "}
          <span className="font-medium text-foreground">{email || "votre adresse email"}</span> pour réinitialiser
          votre mot de passe.
        </>
      }
    >
      <OtpCodeForm
        submitLabel="Vérifier le code"
        pendingLabel="Vérification..."
        pending={pending}
        error={error}
        resending={resending}
        initialCooldown={RESEND_COOLDOWN_SECONDS}
        resendCooldown={RESEND_COOLDOWN_SECONDS}
        onSubmit={handleSubmit}
        onResend={handleResend}
      />
      <p className="mt-3 text-center text-sm text-muted-foreground">
        <Link href="/login" className={authLinkClass}>
          Retour à la connexion
        </Link>
      </p>
    </AuthCard>
  );
}
