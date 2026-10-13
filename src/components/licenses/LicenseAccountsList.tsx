import { toAccountList, type AccountField } from "@/lib/license-accounts";

const FIELD_LABELS: Record<AccountField, string> = {
  id: "ID",
  password: "Mot de passe",
  server: "Serveur",
};

type MaybeAccount = Partial<Record<AccountField, string | null>>;

/**
 * Read-only view of a license's accounts. The "Compte N —" prefix only shows
 * when the license has several accounts.
 */
export function LicenseAccountsList({
  accounts,
  fields,
  className,
}: {
  accounts: MaybeAccount[] | MaybeAccount | null | undefined;
  fields: readonly AccountField[];
  className?: string;
}) {
  const list = toAccountList(accounts);
  const several = list.length > 1;

  return (
    <div className={className ?? "space-y-1.5"}>
      {list.map((account, index) => (
        <div key={index} className="flex flex-wrap gap-x-6 gap-y-1">
          {fields.map((field, fieldIndex) => (
            <p key={field}>
              <span className="text-muted-foreground">
                {several && fieldIndex === 0 ? `Compte ${index + 1} — ` : ""}
                {FIELD_LABELS[field]} :
              </span>{" "}
              {account[field] || "-"}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
