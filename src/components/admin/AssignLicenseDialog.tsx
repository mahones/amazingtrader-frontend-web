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
import { assignEurekaChallengeLicenseToUser, assignBotLicenseToUser, assignLicenseToUser } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { LicenseAccountsFields } from "@/components/licenses/LicenseAccountsFields";
import {
  AUTO_TRADING_FIELDS,
  BOT_FIELDS,
  fillAccounts,
  toAccountPayload,
  type AccountDraft,
} from "@/lib/license-accounts";
import { toast } from "@/lib/toast";
import type { BotLicensePlan, UserBotLicense } from "@/types/bot";
import type { EurekaChallengeLicensePlan, UserEurekaChallengeLicense } from "@/types/eurekaChallenge";
import type { LicensePlan, UserLicense } from "@/types/license";

type LicenseType = "auto_trading" | "bot_trading" | "eureka_challenge";

export function AssignLicenseDialog({
  userId,
  whatsappNumber,
  licensePlans,
  botLicensePlans,
  eurekaChallengeLicensePlans,
  onLicenseAssigned,
  onBotLicenseAssigned,
  onEurekaChallengeLicenseAssigned,
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: {
  userId: number;
  whatsappNumber: string | null;
  licensePlans: LicensePlan[];
  botLicensePlans: (BotLicensePlan & { botName: string })[];
  eurekaChallengeLicensePlans: (EurekaChallengeLicensePlan & { challengeName: string })[];
  onLicenseAssigned: (license: UserLicense) => void;
  onBotLicenseAssigned: (license: UserBotLicense) => void;
  onEurekaChallengeLicenseAssigned: (license: UserEurekaChallengeLicense) => void;
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = onOpenChangeProp ?? setOpenState;
  const [type, setType] = useState<LicenseType>("auto_trading");
  const [planId, setPlanId] = useState("");
  const [accounts, setAccounts] = useState<AccountDraft[]>(() => fillAccounts(null, 1));
  const [activate, setActivate] = useState(true);
  const [purchasedAt, setPurchasedAt] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setType("auto_trading");
    setPlanId("");
    setAccounts(fillAccounts(null, 1));
    setActivate(true);
    setPurchasedAt("");
    setSendEmail(false);
    setError(null);
  }

  const planOptions =
    type === "auto_trading"
      ? licensePlans.map((plan) => ({ value: String(plan.id), label: plan.name }))
      : type === "bot_trading"
        ? botLicensePlans.map((plan) => ({ value: String(plan.id), label: `${plan.botName} — ${plan.name}` }))
        : eurekaChallengeLicensePlans.map((plan) => ({
            value: String(plan.id),
            label: `${plan.challengeName} — ${plan.name}`,
          }));

  // One block of (optional) fields per account of the chosen plan.
  function selectPlan(nextType: LicenseType, nextPlanId: string) {
    const plan =
      nextType === "auto_trading"
        ? licensePlans.find((p) => String(p.id) === nextPlanId)
        : nextType === "bot_trading"
          ? botLicensePlans.find((p) => String(p.id) === nextPlanId)
          : undefined;
    setType(nextType);
    setPlanId(nextPlanId);
    setAccounts(fillAccounts(null, plan?.number_of_accounts ?? 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!planId) {
      setError("Sélectionnez une licence.");
      return;
    }
    setPending(true);
    setError(null);
    const dating = {
      ...(purchasedAt ? { purchased_at: purchasedAt } : {}),
      // Without a purchase date the activation email is sent as before; with a
      // past date (existing customer) it is opt-in.
      send_email: purchasedAt ? sendEmail : true,
    };
    try {
      if (type === "auto_trading") {
        const license = await assignLicenseToUser(userId, {
          license_plan_id: Number(planId),
          activate,
          ...dating,
          accounts: toAccountPayload(accounts, AUTO_TRADING_FIELDS),
        });
        onLicenseAssigned(license);
      } else if (type === "bot_trading") {
        const license = await assignBotLicenseToUser(userId, {
          bot_license_plan_id: Number(planId),
          activate,
          ...dating,
          accounts: toAccountPayload(accounts, BOT_FIELDS),
        });
        onBotLicenseAssigned(license);
      } else {
        const license = await assignEurekaChallengeLicenseToUser(userId, {
          eureka_challenge_license_plan_id: Number(planId),
          activate,
          ...dating,
        });
        onEurekaChallengeLicenseAssigned(license);
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
      {trigger ? (
        <DialogTrigger render={trigger} />
      ) : (
        <DialogTrigger render={<Button variant="outline" />}>Assigner une licence</DialogTrigger>
      )}
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Assigner une licence</DialogTitle>
          <DialogDescription>
            Choisissez un type de licence. Les identifiants sont facultatifs : l&apos;utilisateur pourra les
            renseigner lui-même plus tard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={type === "auto_trading" ? "default" : "outline"}
              className="min-w-fit flex-1"
              onClick={() => selectPlan("auto_trading", "")}
            >
              Auto-Trading
            </Button>
            <Button
              type="button"
              variant={type === "bot_trading" ? "default" : "outline"}
              className="min-w-fit flex-1"
              onClick={() => selectPlan("bot_trading", "")}
            >
              Bot de Trading
            </Button>
            <Button
              type="button"
              variant={type === "eureka_challenge" ? "default" : "outline"}
              className="min-w-fit flex-1"
              onClick={() => selectPlan("eureka_challenge", "")}
            >
              Challenge Eureka
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Licence</Label>
            <Select
              items={planOptions.map(({ value, label }) => ({ value, label }))}
              value={planId}
              onValueChange={(v) => selectPlan(type, v ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une licence" />
              </SelectTrigger>
              <SelectContent>
                {planOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type !== "eureka_challenge" && (
            <LicenseAccountsFields
              idPrefix="assign"
              accounts={accounts}
              onChange={setAccounts}
              fields={type === "auto_trading" ? AUTO_TRADING_FIELDS : BOT_FIELDS}
              required={false}
            />
          )}

          {type === "auto_trading" && (
            <div className="space-y-2">
              <Label htmlFor="assign-whatsapp">Numéro WhatsApp</Label>
              <Input id="assign-whatsapp" value={whatsappNumber ?? "Non renseigné"} disabled />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="assign-purchased-at">Date d&apos;achat d&apos;origine (optionnel)</Label>
            <Input
              id="assign-purchased-at"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={purchasedAt}
              onChange={(e) => setPurchasedAt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Pour un client qui avait payé avant la plateforme : la durée restante est calculée à partir de cette
              date. Laissez vide si la licence démarre aujourd&apos;hui.
            </p>
          </div>

          {purchasedAt && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-primary"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
              />
              Envoyer l&apos;email d&apos;activation au client
            </label>
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
