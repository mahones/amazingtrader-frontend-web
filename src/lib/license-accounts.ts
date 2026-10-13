/**
 * Helpers for licenses that hold several accounts (auto-trading: id / password
 * / server per account; bots: id only). The Eureka Challenge has its own
 * components and does not use these.
 */

export type AccountField = "id" | "password" | "server";

export const AUTO_TRADING_FIELDS = ["id", "password", "server"] as const;
export const BOT_FIELDS = ["id"] as const;

/** An account being typed: every field is a string ("" while empty). */
export type AccountDraft = Record<AccountField, string>;

type MaybeAccount = Partial<Record<AccountField, string | null>>;

/**
 * The API always returns a list. A single flat object (response of a backend
 * that has not been upgraded yet) is tolerated and wrapped.
 */
export function toAccountList<T extends MaybeAccount>(details: T[] | T | null | undefined): T[] {
  if (!details) return [];
  return Array.isArray(details) ? details : [details];
}

/** Exactly `count` drafts (at least 1), pre-filled by position from `initial`. */
export function fillAccounts(
  initial: Array<MaybeAccount> | MaybeAccount | null | undefined,
  count: number
): AccountDraft[] {
  const existing = toAccountList(initial);
  return Array.from({ length: Math.max(1, count) }, (_, index) => ({
    id: existing[index]?.id ?? "",
    password: existing[index]?.password ?? "",
    server: existing[index]?.server ?? "",
  }));
}

/** Keeps only the fields a license type collects (bots: `id` only). */
export function toAccountPayload<F extends AccountField>(
  drafts: AccountDraft[],
  fields: readonly F[]
): Array<Pick<AccountDraft, F>> {
  return drafts.map((draft) => Object.fromEntries(fields.map((field) => [field, draft[field]])) as Pick<AccountDraft, F>);
}

/**
 * True once the buyer or an admin typed something. An admin-assigned license
 * carries empty (null) accounts, so a non-empty list does not mean "filled".
 */
export function hasFilledAccounts(
  details: Array<MaybeAccount> | MaybeAccount | null | undefined,
  fields: readonly AccountField[] = AUTO_TRADING_FIELDS
): boolean {
  return toAccountList(details).some((account) =>
    fields.some((field) => (account[field] ?? "").toString().trim() !== "")
  );
}
