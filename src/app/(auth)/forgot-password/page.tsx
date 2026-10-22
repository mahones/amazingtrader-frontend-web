"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard, authButtonClass, authFieldClass, authLinkClass } from "@/components/auth/AuthCard";
import { forgotPassword } from "@/lib/api/auth";
import { extractApiError } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
}

function ForgotPasswordPageContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      await forgotPassword(email);
      const params = new URLSearchParams({ email });
      router.push(`/reset-otp?${params.toString()}`);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'envoyer le code de vérification."));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="Saisissez l'adresse email de votre compte. Si elle correspond à un compte existant, un code de vérification vous sera envoyé."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="vous@exemple.com"
            className={authFieldClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && <Alert variant="error">{error}</Alert>}
        <Button type="submit" className={authButtonClass} disabled={pending}>
          {pending ? "Envoi..." : "Envoyer le code"}
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
