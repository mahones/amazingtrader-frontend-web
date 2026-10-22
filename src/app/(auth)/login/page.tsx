"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { AuthCard, authButtonClass, authFieldClass, authLinkClass } from "@/components/auth/AuthCard";
import { useAuth } from "@/context/AuthContext";
import { extractApiError } from "@/lib/api/client";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      await login(email, password);
      router.push(searchParams.get("redirect") ?? "/dashboard");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.requires_verification) {
        const params = new URLSearchParams({ email: err.response.data.email ?? email });
        router.push(`/verify-otp?${params.toString()}`);
        return;
      }
      setError(extractApiError(err, "Identifiants incorrects."));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard title="Bon retour" subtitle="Connectez-vous pour accéder à votre espace.">
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link href="/forgot-password" className={`${authLinkClass} text-sm`}>
              Mot de passe oublié ?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className={`${authFieldClass} pr-12`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <Alert variant="error">{error}</Alert>}
        <Button type="submit" className={authButtonClass} disabled={pending}>
          {pending ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/register" className={authLinkClass}>
          Créer un compte
        </Link>
      </p>
    </AuthCard>
  );
}
