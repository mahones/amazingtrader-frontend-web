export type LicenseStatus = "active" | "expired" | "revoked";
export type LicenseDurationUnit = "month" | "year";

export interface LicensePlan {
  id: number;
  name: string;
  slug: string;
  description: string;
  duration_value: number;
  duration_unit: LicenseDurationUnit;
  managed_capital_min: number | null;
  managed_capital_max: number | null;
  guarantees: string[];
  features: string[];
  price: number;
  is_active: boolean;
  purchase_count?: number;
}

export interface UserLicense {
  id: number;
  license_key: string;
  status: LicenseStatus;
  broker_config: Record<string, unknown> | null;
  activated_at: string | null;
  expires_at: string | null;
  license_plan: LicensePlan;
}
