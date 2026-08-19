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
  price: number;
  is_active: boolean;
  purchase_count?: number;
}

export interface LicensePurchaseDetails {
  id: string;
  password: string;
  server: string;
  whatsapp_number: string;
}

export interface UserLicense {
  id: number;
  status: LicenseStatus;
  is_activated: boolean;
  purchase_details: LicensePurchaseDetails | null;
  activated_at: string | null;
  expires_at: string | null;
  license_plan: LicensePlan;
}
