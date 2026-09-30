import type { Broker } from "./broker";
import type { LicenseDurationUnit } from "./license";

export type BarronsChallengeLicenseOfferType = "time_limited" | "lifetime";
export type PerformancePlatform = "myfxbook" | "mql5" | "other";

export interface BarronsChallengeRequirement {
  id: number;
  label: string;
  position: number;
}

export interface BarronsChallengeInstruction {
  id: number;
  title: string;
  url: string;
  position: number;
}

export interface BarronsChallengePerformanceLink {
  id: number;
  platform: PerformancePlatform;
  label: string;
  url: string;
  position: number;
}

export interface BarronsChallengeLicensePlan {
  id: number;
  barrons_challenge_id: number;
  offer_type: BarronsChallengeLicenseOfferType;
  name: string;
  description: string | null;
  duration_value: number | null;
  duration_unit: LicenseDurationUnit | null;
  price: number;
  features: string[];
  number_of_accounts: number;
  is_featured: boolean;
  is_active: boolean;
  position: number;
  purchase_count?: number;
  has_active_subscribers?: boolean;
  barrons_challenge?: BarronsChallenge;
}

export interface BarronsChallengeFile {
  id: number;
  label: string;
  original_filename: string;
  size_bytes: number | null;
  mime_type: string | null;
  position: number;
  created_at: string;
}

export interface BarronsChallenge {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  preview_image: string | null;
  managed_capital: number | null;
  description: string;
  excerpt: string | null;
  strategy_summary: string | null;
  pairs_traded: string[];
  is_active: boolean;
  position: number;
  has_active_subscribers?: boolean;
  requirements?: BarronsChallengeRequirement[];
  performance_links?: BarronsChallengePerformanceLink[];
  license_plans?: BarronsChallengeLicensePlan[];
  instructions?: BarronsChallengeInstruction[];
  brokers?: Broker[];
}

export interface BarronsChallengeAccountCredentials {
  id: string;
  password: string;
  server: string;
  license_keys: string[];
}

export type BarronsChallengePurchaseDetails = BarronsChallengeAccountCredentials[];

export interface UserBarronsChallengeLicense {
  id: number;
  status: "active" | "expired" | "revoked";
  is_activated: boolean;
  purchase_details: BarronsChallengePurchaseDetails | null;
  pending_purchase_details: Array<Pick<BarronsChallengeAccountCredentials, "id" | "password" | "server">> | null;
  pending_purchase_details_submitted_at: string | null;
  activated_at: string | null;
  expires_at: string | null;
  product_snapshot?: Record<string, unknown> | null;
  number_of_accounts?: number;
  barrons_challenge_license_plan: BarronsChallengeLicensePlan;
  files?: BarronsChallengeFile[];
}
