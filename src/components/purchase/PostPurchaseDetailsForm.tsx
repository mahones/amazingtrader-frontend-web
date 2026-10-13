"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LicenseAccountsFields } from "@/components/licenses/LicenseAccountsFields";
import { extractApiError } from "@/lib/api/client";
import { updatePurchaseDetails } from "@/lib/api/licenses";
import { updateBotLicensePurchaseDetails } from "@/lib/api/bots";
import type { PurchasableType } from "@/lib/api/orders";
import {
  AUTO_TRADING_FIELDS,
  BOT_FIELDS,
  fillAccounts,
  toAccountPayload,
  type AccountDraft,
} from "@/lib/license-accounts";
import type { LicenseAccount, UserLicense } from "@/types/license";
import type { UserBotLicense } from "@/types/bot";

export function PostPurchaseDetailsForm({
  type,
  licenseId,
  numberOfAccounts = 1,
  initialValues,
  onSubmitted,
}: {
  type: Extract<PurchasableType, "license_plan" | "bot_license_plan">;
  licenseId: number;
  /** How many accounts the plan includes (one block of fields per account). */
  numberOfAccounts?: number;
  initialValues?: Array<Partial<LicenseAccount>> | null;
  onSubmitted: (result: UserLicense | UserBotLicense) => void;
}) {
  const fields = type === "license_plan" ? AUTO_TRADING_FIELDS : BOT_FIELDS;
  const [accounts, setAccounts] = useState<AccountDraft[]>(() => fillAccounts(initialValues, numberOfAccounts));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      if (type === "license_plan") {
        onSubmitted(await updatePurchaseDetails(licenseId, toAccountPayload(accounts, AUTO_TRADING_FIELDS)));
      } else {
        onSubmitted(await updateBotLicensePurchaseDetails(licenseId, toAccountPayload(accounts, BOT_FIELDS)));
      }
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer ces informations."));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LicenseAccountsFields idPrefix="ppd" accounts={accounts} onChange={setAccounts} fields={fields} />

      {error && <Alert variant="error">{error}</Alert>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enregistrement..." : "Valider"}
      </Button>
    </form>
  );
}
