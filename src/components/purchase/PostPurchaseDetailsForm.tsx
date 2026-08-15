"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractApiError } from "@/lib/api/client";
import { updatePurchaseDetails } from "@/lib/api/licenses";
import { updateBotLicensePurchaseDetails } from "@/lib/api/bots";
import type { PurchasableType } from "@/lib/api/orders";

export function PostPurchaseDetailsForm({
  type,
  licenseId,
  onSubmitted,
}: {
  type: Extract<PurchasableType, "license_plan" | "bot_license_plan">;
  licenseId: number;
  onSubmitted: () => void;
}) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [server, setServer] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      if (type === "license_plan") {
        await updatePurchaseDetails(licenseId, {
          id,
          password,
          server,
          whatsapp_number: whatsapp,
        });
      } else {
        await updateBotLicensePurchaseDetails(licenseId, { id });
      }
      onSubmitted();
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
            <Input
              id="ppd-whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
            />
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
