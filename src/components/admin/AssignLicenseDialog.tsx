"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WhatsappNumberField } from "@/components/shared/WhatsappNumberField";
import { assignBotLicenseToUser, assignLicenseToUser } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import type { BotLicensePlan, UserBotLicense } from "@/types/bot";
import type { LicensePlan, LicensePurchaseDetails, UserLicense } from "@/types/license";

type LicenseType = "auto_trading" | "bot_trading";

const emptyForm: LicensePurchaseDetails = { id: "", password: "", server: "", whatsapp_number: "" };

export function AssignLicenseDialog({
  userId,
  licensePlans,
  botLicensePlans,
  onLicenseAssigned,
  onBotLicenseAssigned,
}: {
  userId: number;
  licensePlans: LicensePlan[];
  botLicensePlans: (BotLicensePlan & { botName: string })[];
  onLicenseAssigned: (license: UserLicense) => void;
  onBotLicenseAssigned: (license: UserBotLicense) => void;
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<LicenseType>("auto_trading");
  const [planId, setPlanId] = useState("");
  const [form, setForm] = useState<LicensePurchaseDetails>(emptyForm);
  const [activate, setActivate] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setType("auto_trading");
    setPlanId("");
    setForm(emptyForm);
    setActivate(true);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!planId) {
      setError("Sélectionnez une licence.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      if (type === "auto_trading") {
        const license = await assignLicenseToUser(userId, {
          license_plan_id: Number(planId),
          activate,
          id: form.id,
          password: form.password,
          server: form.server,
          whatsapp_number: form.whatsapp_number,
        });
        onLicenseAssigned(license);
      } else {
        const license = await assignBotLicenseToUser(userId, {
          bot_license_plan_id: Number(planId),
          activate,
          id: form.id,
        });
        onBotLicenseAssigned(license);
      }
      toast.success("Licence assignée avec succès.");
      setOpen(false);
      reset();
    } catch (err) {
      setError(extractApiError(err, "Impossible d'assigner cette licence."));
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={<Button variant="outline" />}>Assigner une licence</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assigner une licence</DialogTitle>
          <DialogDescription>
            Choisissez un type de licence. Les identifiants sont facultatifs : l&apos;utilisateur pourra les
            renseigner lui-même plus tard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === "auto_trading" ? "default" : "outline"}
              className="flex-1"
              onClick={() => {
                setType("auto_trading");
                setPlanId("");
              }}
            >
              Auto-Trading
            </Button>
            <Button
              type="button"
              variant={type === "bot_trading" ? "default" : "outline"}
              className="flex-1"
              onClick={() => {
                setType("bot_trading");
                setPlanId("");
              }}
            >
              Bot de Trading
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Licence</Label>
            <Select
              items={
                type === "auto_trading"
                  ? licensePlans.map((plan) => ({ value: String(plan.id), label: plan.name }))
                  : botLicensePlans.map((plan) => ({
                      value: String(plan.id),
                      label: `${plan.botName} — ${plan.name}`,
                    }))
              }
              value={planId}
              onValueChange={(v) => setPlanId(v ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une licence" />
              </SelectTrigger>
              <SelectContent>
                {type === "auto_trading"
                  ? licensePlans.map((plan) => (
                      <SelectItem key={plan.id} value={String(plan.id)}>
                        {plan.name}
                      </SelectItem>
                    ))
                  : botLicensePlans.map((plan) => (
                      <SelectItem key={plan.id} value={String(plan.id)}>
                        {plan.botName} — {plan.name}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assign-id">ID (optionnel)</Label>
            <Input
              id="assign-id"
              value={form.id}
              onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
            />
          </div>

          {type === "auto_trading" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="assign-password">Mot de passe (optionnel)</Label>
                <Input
                  id="assign-password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assign-server">Serveur (optionnel)</Label>
                <Input
                  id="assign-server"
                  value={form.server}
                  onChange={(e) => setForm((f) => ({ ...f, server: e.target.value }))}
                />
              </div>
              <WhatsappNumberField
                idPrefix="assign-whatsapp"
                label="Numéro WhatsApp (optionnel)"
                value={form.whatsapp_number}
                onChange={(v) => setForm((f) => ({ ...f, whatsapp_number: v }))}
              />
            </>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-primary"
              checked={activate}
              onChange={(e) => setActivate(e.target.checked)}
            />
            Activer immédiatement
          </label>

          {error && <Alert variant="error">{error}</Alert>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Attribution..." : "Assigner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
