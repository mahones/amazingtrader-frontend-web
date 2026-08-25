"use client";

import { useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { extractApiError } from "@/lib/api/client";
import { updatePurchaseDetails } from "@/lib/api/licenses";
import { updateBotLicensePurchaseDetails } from "@/lib/api/bots";
import type { PurchasableType } from "@/lib/api/orders";
import type { UserLicense } from "@/types/license";
import type { UserBotLicense } from "@/types/bot";

export function PostPurchaseDetailsForm({
  type,
  licenseId,
  initialValues,
  onSubmitted,
}: {
  type: Extract<PurchasableType, "license_plan" | "bot_license_plan">;
  licenseId: number;
  initialValues?: Partial<{ id: string; password: string; server: string; whatsapp_number: string }>;
  onSubmitted: (result: UserLicense | UserBotLicense) => void;
}) {
  const { user } = useAuth();
  const [id, setId] = useState(initialValues?.id ?? "");
  const [password, setPassword] = useState(initialValues?.password ?? "");
  const [server, setServer] = useState(initialValues?.server ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      if (type === "license_plan") {
        const result = await updatePurchaseDetails(licenseId, {
          id,
          password,
          server,
          whatsapp_number: user?.whatsapp_number ?? "",
        });
        onSubmitted(result);
      } else {
        const result = await updateBotLicensePurchaseDetails(licenseId, { id });
        onSubmitted(result);
      }
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer ces informations."));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ppd-id">ID</Label>
        <Input id="ppd-id" value={id} onChange={(e) => setId(e.target.value)} required />
      </div>

      {type === "license_plan" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="ppd-password">Mot de passe</Label>
            <Input
              id="ppd-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ppd-server">Serveur</Label>
            <Input id="ppd-server" value={server} onChange={(e) => setServer(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ppd-whatsapp">Numéro WhatsApp</Label>
            <Input id="ppd-whatsapp" value={user?.whatsapp_number ?? ""} disabled />
            <p className="text-xs text-muted-foreground">
              Numéro associé à votre compte. Modifiable depuis{" "}
              <Link href="/dashboard/settings" className="font-medium text-primary hover:underline">
                vos paramètres
              </Link>
              .
            </p>
          </div>
        </>
      )}

      {error && <Alert variant="error">{error}</Alert>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enregistrement..." : "Valider"}
      </Button>
    </form>
  );
}
