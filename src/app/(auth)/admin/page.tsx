"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { AuthCard, authButtonClass, authFieldClass } from "@/components/auth/AuthCard";
import { useAuth } from "@/context/AuthContext";
import { extractApiError } from "@/lib/api/client";

export default function AdminLoginPage() {
  const { user, isLoading, isStaff, adminLogin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!isLoading && user && isStaff) router.replace("/dashboard");
  }, [isLoading, user, isStaff, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      await adminLogin(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(extractApiError(err, "Identifiants incorrects."));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard badge="ACCÈS ADMINISTRATEUR" title="Connexion à l'administration">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            required
            placeholder="admin@amazingtraders.com"
            className={authFieldClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
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
      <p className="mt-6 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground dark:bg-[#262626]">
        Un compte client ne peut pas accéder à cet espace.
      </p>
    </AuthCard>
  );
}
