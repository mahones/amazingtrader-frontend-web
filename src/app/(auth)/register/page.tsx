"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { AuthCard, authButtonClass, authFieldClass, authLinkClass } from "@/components/auth/AuthCard";
import { WhatsappNumberField } from "@/components/shared/WhatsappNumberField";
import { register as apiRegister } from "@/lib/api/auth";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageContent />
    </Suspense>
  );
}

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptedTerms) return;
    setPending(true);
    setError(null);

    try {
      await apiRegister({
        name,
        email,
        whatsapp_number: whatsappNumber,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success("Un code de vérification a été envoyé à votre adresse email.");
      const redirect = searchParams.get("redirect");
      const params = new URLSearchParams({ email, sent: "1" });
      if (redirect) params.set("redirect", redirect);
      router.push(`/verify-otp?${params.toString()}`);
    } catch (err) {
      setError(extractApiError(err, "Impossible de créer le compte. Vérifiez les informations saisies."));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard title="Créer un compte" wide>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            autoComplete="name"
            required
            placeholder="Nom complet"
            className={authFieldClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
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
          <WhatsappNumberField
            idPrefix="whatsapp"
            label="WhatsApp"
            value={whatsappNumber}
            onChange={setWhatsappNumber}
            required
            fieldClassName={authFieldClass}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
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
            <Label htmlFor="password_confirmation">Confirmation</Label>
            <PasswordInput
              id="password_confirmation"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Confirmer le mot de passe"
              className={`${authFieldClass} pr-12`}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            required
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
          />
          <span>
            J&apos;accepte les{" "}
            <Link href="/termes-et-conditions" target="_blank" className={authLinkClass}>
              conditions d&apos;utilisation
            </Link>
            .
          </span>
        </label>
        {error && <Alert variant="error">{error}</Alert>}
        <Button type="submit" className={authButtonClass} disabled={pending || !acceptedTerms}>
          {pending ? "Création..." : "Créer mon compte"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/login" className={authLinkClass}>
          Se connecter
        </Link>
      </p>
    </AuthCard>
  );
}
