"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import type { AccountDraft, AccountField } from "@/lib/license-accounts";
import { digitsOnly } from "@/lib/utils";

const FIELD_LABELS: Record<AccountField, string> = {
  id: "ID",
  password: "Mot de passe",
  server: "Serveur",
};

/**
 * Controlled fields for the accounts of one license (one block per account).
 * The "Compte N" title only appears when the license has several accounts, so
 * single-account licenses keep their usual layout.
 */
export function LicenseAccountsFields({
  idPrefix,
  accounts,
  onChange,
  fields,
  required = true,
  idDigitsOnly = true,
  plainPassword = false,
  compact = false,
}: {
  idPrefix: string;
  accounts: AccountDraft[];
  onChange: (next: AccountDraft[]) => void;
  fields: readonly AccountField[];
  /** Required inputs; when false the labels get an "(optionnel)" suffix. */
  required?: boolean;
  /** Restrict the ID to digits (MT5 logins). */
  idDigitsOnly?: boolean;
  /** Show the password as plain text (admin screens) instead of a masked input. */
  plainPassword?: boolean;
  /** Smaller labels and a two-column grid, for dense admin forms. */
  compact?: boolean;
}) {
  const several = accounts.length > 1;

  function update(index: number, field: AccountField, value: string) {
    onChange(accounts.map((account, i) => (i === index ? { ...account, [field]: value } : account)));
  }

  function renderField(index: number, field: AccountField) {
    const inputId = `${idPrefix}-${field}-${index}`;
    const value = accounts[index][field];
    const label = FIELD_LABELS[field] + (required ? "" : " (optionnel)");

    let input;
    if (field === "id") {
      input = (
        <Input
          id={inputId}
          inputMode={idDigitsOnly ? "numeric" : undefined}
          pattern={idDigitsOnly ? "[0-9]*" : undefined}
          value={value}
          onChange={(e) => update(index, field, idDigitsOnly ? digitsOnly(e.target.value) : e.target.value)}
          required={required}
        />
      );
    } else if (field === "password" && !plainPassword) {
      input = (
        <PasswordInput
          id={inputId}
          value={value}
          onChange={(e) => update(index, field, e.target.value)}
          required={required}
        />
      );
    } else {
      input = (
        <Input id={inputId} value={value} onChange={(e) => update(index, field, e.target.value)} required={required} />
      );
    }

    return (
      <div key={field} className={compact ? "space-y-1" : "space-y-2"}>
        <Label htmlFor={inputId} className={compact ? "text-xs" : undefined}>
          {label}
        </Label>
        {input}
      </div>
    );
  }

  const fieldsLayout = compact ? "grid gap-2 sm:grid-cols-2" : "space-y-4";

  return (
    <div className={several ? "space-y-4" : undefined}>
      {accounts.map((_, index) =>
        several ? (
          <div key={index} className="space-y-4 rounded-lg border border-border p-4">
            <p className="text-sm font-medium">Compte {index + 1}</p>
            <div className={fieldsLayout}>{fields.map((field) => renderField(index, field))}</div>
          </div>
        ) : (
          <div key={index} className={fieldsLayout}>
            {fields.map((field) => renderField(index, field))}
          </div>
        )
      )}
    </div>
  );
}
