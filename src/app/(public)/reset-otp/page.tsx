"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPassword, verifyResetOtp } from "@/lib/api/auth";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";

const RESEND_COOLDOWN_SECONDS = 30;
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
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(extractApiError(err, "Impossible de renvoyer le code."));
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Vérification du code</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Un code à 6 chiffres a été envoyé à{" "}
            <span className="font-medium text-foreground">{email || "votre adresse email"}</span>. Saisissez-le
            ci-dessous pour réinitialiser votre mot de passe.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code de vérification</Label>
              <Input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                placeholder="000000"
                className="text-center text-lg tracking-[0.5em]"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
            </div>
            {error && <Alert variant="error">{error}</Alert>}
            <Button type="submit" className="w-full" disabled={pending || code.length !== 6}>
              {pending ? "Vérification..." : "Vérifier"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Vous n&apos;avez rien reçu ?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
            >
              {cooldown > 0 ? `Renvoyer le code (${cooldown}s)` : resending ? "Envoi..." : "Renvoyer le code"}
            </button>
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            <Link href="/login" className="font-medium text-primary hover:underline">
              Retour à la connexion
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
