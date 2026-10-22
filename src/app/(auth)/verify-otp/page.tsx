"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard, authLinkClass } from "@/components/auth/AuthCard";
import { OtpCodeForm } from "@/components/auth/OtpCodeForm";
import { useAuth } from "@/context/AuthContext";
import { resendOtp, verifyOtp } from "@/lib/api/auth";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpPageContent />
    </Suspense>
  );
}

function VerifyOtpPageContent() {
  const { refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  // `sent=1` : on arrive de l'inscription, un code vient d'être envoyé.
  const justSent = searchParams.get("sent") === "1";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(code: string) {
    setPending(true);
    setError(null);

    try {
      await verifyOtp(email, code);
      await refresh();
      toast.success("Votre adresse email a été vérifiée. Bienvenue !");
      router.push(searchParams.get("redirect") ?? "/dashboard");
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
      await resendOtp(email);
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
          <span className="font-medium text-foreground">{email || "votre adresse email"}</span>.
        </>
      }
    >
      <OtpCodeForm
        submitLabel="Vérifier le code"
        pendingLabel="Vérification..."
        pending={pending}
        error={error}
        resending={resending}
        initialCooldown={justSent ? RESEND_COOLDOWN_SECONDS : 0}
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
