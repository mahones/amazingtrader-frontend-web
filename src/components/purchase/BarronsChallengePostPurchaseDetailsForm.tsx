"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { extractApiError } from "@/lib/api/client";
import { updateBarronsChallengeLicensePurchaseDetails } from "@/lib/api/barronsChallenges";
import { digitsOnly } from "@/lib/utils";
import type { BarronsChallengeAccountCredentials, UserBarronsChallengeLicense } from "@/types/barronsChallenge";

type AccountDraft = Pick<BarronsChallengeAccountCredentials, "id" | "password" | "server">;

function buildInitialDrafts(
  numberOfAccounts: number,
  initialValues?: AccountDraft[]
): AccountDraft[] {
  return Array.from({ length: numberOfAccounts }, (_, index) => ({
    id: initialValues?.[index]?.id ?? "",
    password: initialValues?.[index]?.password ?? "",
    server: initialValues?.[index]?.server ?? "",
  }));
}

export function BarronsChallengePostPurchaseDetailsForm({
  licenseId,
  numberOfAccounts,
  initialValues,
  onSubmitted,
}: {
  licenseId: number;
  numberOfAccounts: number;
  initialValues?: AccountDraft[];
  onSubmitted: (result: UserBarronsChallengeLicense) => void;
}) {
  const [accounts, setAccounts] = useState<AccountDraft[]>(buildInitialDrafts(numberOfAccounts, initialValues));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateAccount(index: number, field: keyof AccountDraft, value: string) {
    setAccounts((prev) => prev.map((account, i) => (i === index ? { ...account, [field]: value } : account)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const result = await updateBarronsChallengeLicensePurchaseDetails(licenseId, accounts);
      onSubmitted(result);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer ces informations."));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {accounts.map((account, index) => (
        <div key={index} className="space-y-4 rounded-lg border border-border p-4">
          <p className="text-sm font-medium">Compte {index + 1}</p>

          <div className="space-y-2">
            <Label htmlFor={`ppd-id-${index}`}>ID</Label>
            <Input
              id={`ppd-id-${index}`}
              inputMode="numeric"
              pattern="[0-9]*"
              value={account.id}
              onChange={(e) => updateAccount(index, "id", digitsOnly(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`ppd-password-${index}`}>Mot de passe</Label>
            <PasswordInput
              id={`ppd-password-${index}`}
              value={account.password}
              onChange={(e) => updateAccount(index, "password", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`ppd-server-${index}`}>Serveur</Label>
            <Input
              id={`ppd-server-${index}`}
              value={account.server}
              onChange={(e) => updateAccount(index, "server", e.target.value)}
              required
            />
          </div>
        </div>
      ))}

      {error && <Alert variant="error">{error}</Alert>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enregistrement..." : "Valider"}
      </Button>
    </form>
  );
}
