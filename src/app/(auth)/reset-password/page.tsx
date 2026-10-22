"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { AuthCard, authButtonClass, authFieldClass, authLinkClass } from "@/components/auth/AuthCard";
import { useAuth } from "@/context/AuthContext";
import { resetPassword } from "@/lib/api/auth";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";

const RESET_TICKET_STORAGE_KEY = "password_reset_ticket";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}

function ResetPasswordPageContent() {
  const { refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const resetTicket = sessionStorage.getItem(RESET_TICKET_STORAGE_KEY);
    if (!resetTicket) {
      setError("Votre session de réinitialisation a expiré. Veuillez recommencer.");
      setPending(false);
      return;
    }

    try {
      await resetPassword(email, resetTicket, password, passwordConfirmation);
      sessionStorage.removeItem(RESET_TICKET_STORAGE_KEY);
      await refresh();
      toast.success("Votre mot de passe a été réinitialisé.");
      router.push("/dashboard");
    } catch (err) {
      setError(extractApiError(err, "Impossible de réinitialiser le mot de passe."));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard title="Nouveau mot de passe" subtitle="Choisissez un nouveau mot de passe pour votre compte.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">Nouveau mot de passe</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="8 caractères minimum"
            className={`${authFieldClass} pr-12`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
          <PasswordInput
            id="password_confirmation"
            autoComplete="new-password"
            required
            minLength={8}
            className={`${authFieldClass} pr-12`}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </div>
        {error && <Alert variant="error">{error}</Alert>}
        <Button type="submit" className={authButtonClass} disabled={pending}>
          {pending ? "Enregistrement..." : "Réinitialiser le mot de passe"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className={authLinkClass}>
          Retour à la connexion
        </Link>
      </p>
    </AuthCard>
  );
}
