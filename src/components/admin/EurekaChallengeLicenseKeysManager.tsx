"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractApiError } from "@/lib/api/client";
import { updateEurekaChallengeLicenseKeys } from "@/lib/api/admin";
import type { UserEurekaChallengeLicense } from "@/types/eurekaChallenge";

/**
 * Admin-only editor for the license_keys of each account on a purchased
 * Eureka Challenge license. id/password/server are self-reported by the
 * buyer and never editable here — only the license keys the admin issues.
 */
export function EurekaChallengeLicenseKeysManager({
  license,
  onChange,
}: {
  license: UserEurekaChallengeLicense;
  onChange: (next: UserEurekaChallengeLicense) => void;
}) {
  const accounts = license.purchase_details ?? [];
  const [drafts, setDrafts] = useState<string[]>(accounts.map(() => ""));
  const [pending, setPending] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (accounts.length === 0) {
    return null;
  }

  async function persist(accountIndex: number, nextKeys: string[]) {
    setPending(accountIndex);
    setError(null);
    try {
      const payload = accounts.map((account, index) => ({
        license_keys: index === accountIndex ? nextKeys : account.license_keys,
      }));
      const updated = await updateEurekaChallengeLicenseKeys(license.id, payload);
      onChange(updated);
    } catch (err) {
      setError(extractApiError(err, "Impossible de mettre à jour les license keys."));
    } finally {
      setPending(null);
    }
  }

  function handleAdd(accountIndex: number) {
    const value = drafts[accountIndex]?.trim();
    if (!value) return;
    const current = accounts[accountIndex].license_keys ?? [];
    persist(accountIndex, [...current, value]);
    setDrafts((prev) => prev.map((d, i) => (i === accountIndex ? "" : d)));
  }

  function handleRemove(accountIndex: number, keyIndex: number) {
    const current = accounts[accountIndex].license_keys ?? [];
    persist(accountIndex, current.filter((_, i) => i !== keyIndex));
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <p className="text-sm font-medium">License keys (par compte)</p>
      <div className="space-y-3">
        {accounts.map((account, accountIndex) => (
          <div key={accountIndex} className="space-y-2 rounded-md bg-muted/50 p-3">
            <Label className="text-xs text-muted-foreground">
              Compte {accountIndex + 1}
              {account.id ? ` — ID ${account.id}` : ""}
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {(account.license_keys ?? []).map((key, keyIndex) => (
                <Badge key={keyIndex} variant="secondary" className="gap-1 pr-1">
                  {key}
                  <button
                    type="button"
                    onClick={() => handleRemove(accountIndex, keyIndex)}
                    disabled={pending === accountIndex}
                    aria-label={`Retirer ${key}`}
                    className="rounded-full p-0.5 hover:bg-foreground/10"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              {(account.license_keys ?? []).length === 0 && (
                <span className="text-xs text-muted-foreground">Aucune license key.</span>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Nouvelle license key"
                value={drafts[accountIndex] ?? ""}
                onChange={(e) =>
                  setDrafts((prev) => prev.map((d, i) => (i === accountIndex ? e.target.value : d)))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdd(accountIndex);
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                disabled={pending === accountIndex || !drafts[accountIndex]?.trim()}
                onClick={() => handleAdd(accountIndex)}
              >
                Ajouter
              </Button>
            </div>
          </div>
        ))}
      </div>
      {error && <Alert variant="error">{error}</Alert>}
    </div>
  );
}
