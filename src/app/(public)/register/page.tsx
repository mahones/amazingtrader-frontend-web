"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { usePostPurchaseFlow } from "@/hooks/usePostPurchaseFlow";
import { register as apiRegister } from "@/lib/api/auth";
import { extractApiError } from "@/lib/api/client";
import { purchase, type PurchasableType } from "@/lib/api/orders";
import { toast } from "@/lib/toast";

export default function RegisterPage() {
  const { refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handlePurchaseResult, modal } = usePostPurchaseFlow();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      await apiRegister({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      await refresh();
      toast.success("Votre compte a été créé avec succès. Bienvenue !");

      const purchaseParam = searchParams.get("purchase");
      const redirect = searchParams.get("redirect");

      if (purchaseParam) {
        const [type, id] = purchaseParam.split(":");
        const order = await purchase(type as PurchasableType, Number(id)).catch(() => null);
        if (order) handlePurchaseResult(order, type as PurchasableType);
        else router.push(redirect ?? "/dashboard");
        return;
      }

      router.push(redirect ?? "/dashboard");
    } catch (err) {
      setError(extractApiError(err, "Impossible de créer le compte. Vérifiez les informations saisies."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
              <Input
                id="password_confirmation"
                type="password"
                required
                minLength={8}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>
            {error && <Alert variant="error">{error}</Alert>}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Création..." : "Créer mon compte"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
      {modal}
    </div>
  );
}
