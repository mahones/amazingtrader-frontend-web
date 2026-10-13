"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminUpdateBotLicensePurchaseDetails,
  adminUpdateEurekaChallengeLicensePurchaseDetails,
  adminUpdateLicensePurchaseDetails,
} from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import { fillAccounts } from "@/lib/license-accounts";
import type { UserBotLicense } from "@/types/bot";
import type { UserEurekaChallengeLicense } from "@/types/eurekaChallenge";
import type { UserLicense } from "@/types/license";

type Account = { id: string; password: string; server: string };

type Props =
  | {
      kind: "auto";
      licenseId: number;
      initial: Partial<Account>[] | null;
      accountCount: number;
      onSaved: (license: UserLicense) => void;
    }
  | {
      kind: "bot";
      licenseId: number;
      initial: Partial<Account>[] | null;
      accountCount: number;
      onSaved: (license: UserBotLicense) => void;
    }
  | {
      kind: "eureka";
      licenseId: number;
      initial: Partial<Account>[] | null;
      accountCount: number;
      onSaved: (license: UserEurekaChallengeLicense) => void;
    };

const blank = (a?: Partial<Account> | null): Account => ({
  id: a?.id ?? "",
  password: a?.password ?? "",
  server: a?.server ?? "",
});

/**
 * Admin-only direct edit of a license's accounts (id/password/server per
 * account). Applied immediately (no approval step) and supersedes any pending
 * user change.
 */
export function AdminEditCredentialsDialog(props: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialAccounts = (): Account[] => {
    if (props.kind === "eureka") {
      const existing = props.initial ?? [];
      const count = Math.max(props.accountCount, existing.length, 1);
      return Array.from({ length: count }, (_, i) => blank(existing[i]));
    }
    // Exactly the plan's number of accounts: that is what the API accepts.
    return fillAccounts(props.initial, props.accountCount);
  };
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);

  function setField(index: number, field: keyof Account, value: string) {
    setAccounts((prev) => prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (props.kind === "auto") {
        props.onSaved(await adminUpdateLicensePurchaseDetails(props.licenseId, accounts));
      } else if (props.kind === "bot") {
        props.onSaved(
          await adminUpdateBotLicensePurchaseDetails(
            props.licenseId,
            accounts.map(({ id }) => ({ id }))
          )
        );
      } else {
        props.onSaved(await adminUpdateEurekaChallengeLicensePurchaseDetails(props.licenseId, accounts));
      }
      toast.success("Identifiants mis à jour.");
      setOpen(false);
    } catch (err) {
      setError(extractApiError(err, "Impossible de mettre à jour les identifiants."));
    } finally {
      setSaving(false);
    }
  }

  const withCredentials = props.kind !== "bot";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setAccounts(initialAccounts());
        setError(null);
        setOpen(next);
      }}
    >
      <DialogTrigger render={<Button size="sm" variant="outline" />}>Modifier les identifiants</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier les identifiants</DialogTitle>
          <DialogDescription>
            La modification est appliquée immédiatement et remplace toute demande en attente de l&apos;utilisateur.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {accounts.map((account, index) => (
            <div key={index} className="space-y-3 rounded-md bg-muted/50 p-3">
              {accounts.length > 1 && <p className="text-sm font-medium">Compte {index + 1}</p>}
              <div className="space-y-1.5">
                <Label htmlFor={`cred-id-${index}`}>ID</Label>
                <Input
                  id={`cred-id-${index}`}
                  required
                  value={account.id}
                  onChange={(e) => setField(index, "id", e.target.value)}
                />
              </div>
              {withCredentials && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor={`cred-password-${index}`}>Mot de passe</Label>
                    <Input
                      id={`cred-password-${index}`}
                      required
                      value={account.password}
                      onChange={(e) => setField(index, "password", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`cred-server-${index}`}>Serveur</Label>
                    <Input
                      id={`cred-server-${index}`}
                      required
                      value={account.server}
                      onChange={(e) => setField(index, "server", e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
          {error && <Alert variant="error">{error}</Alert>}
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
