export type LicenseStatus = "active" | "expired" | "revoked";
export type LicenseDurationUnit = "month" | "year";

export interface LicensePlan {
  id: number;
  name: string;
  slug: string;
  description: string;
  duration_value: number;
  duration_unit: LicenseDurationUnit;
  guarantees: string[];
  features: string[];
  /** Accounts (id / password / server) the buyer fills in for one license. */
  number_of_accounts: number;
  price: number;
  is_active: boolean;
  purchase_count?: number;
  has_active_subscribers?: boolean;
}

/** One trading account of an auto-trading license. */
export interface LicenseAccount {
  id: string;
  password: string;
  server: string;
}

export interface UserLicense {
  id: number;
  status: LicenseStatus;
  is_activated: boolean;
  purchase_details: LicenseAccount[] | null;
  pending_purchase_details: LicenseAccount[] | null;
  pending_purchase_details_submitted_at: string | null;
  activated_at: string | null;
  expires_at: string | null;
  product_snapshot?: Record<string, unknown> | null;
  number_of_accounts?: number;
  license_plan: LicensePlan;
}
