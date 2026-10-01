import type { Broker } from "./broker";
import type { LicenseDurationUnit } from "./license";

export type EurekaChallengeLicenseOfferType = "time_limited" | "lifetime";
export type PerformancePlatform = "myfxbook" | "mql5" | "other";

export interface EurekaChallengeRequirement {
  id: number;
  label: string;
  position: number;
}

export interface EurekaChallengeInstruction {
  id: number;
  title: string;
  url: string;
  position: number;
}

export interface EurekaChallengePerformanceLink {
  id: number;
  platform: PerformancePlatform;
  label: string;
  url: string;
  position: number;
}

export interface EurekaChallengeLicensePlan {
  id: number;
  eureka_challenge_id: number;
  offer_type: EurekaChallengeLicenseOfferType;
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
  eureka_challenge?: EurekaChallenge;
}

export interface EurekaChallengeFile {
  id: number;
  label: string;
  original_filename: string;
  size_bytes: number | null;
  mime_type: string | null;
  position: number;
  created_at: string;
}

export interface EurekaChallenge {
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
  requirements?: EurekaChallengeRequirement[];
  performance_links?: EurekaChallengePerformanceLink[];
  license_plans?: EurekaChallengeLicensePlan[];
  instructions?: EurekaChallengeInstruction[];
  brokers?: Broker[];
}

export interface EurekaChallengeAccountCredentials {
  id: string;
  password: string;
  server: string;
  license_keys: string[];
}

export type EurekaChallengePurchaseDetails = EurekaChallengeAccountCredentials[];

export interface UserEurekaChallengeLicense {
  id: number;
  status: "active" | "expired" | "revoked";
  is_activated: boolean;
  purchase_details: EurekaChallengePurchaseDetails | null;
  pending_purchase_details: Array<Pick<EurekaChallengeAccountCredentials, "id" | "password" | "server">> | null;
  pending_purchase_details_submitted_at: string | null;
  activated_at: string | null;
  expires_at: string | null;
  product_snapshot?: Record<string, unknown> | null;
  number_of_accounts?: number;
  eureka_challenge_license_plan: EurekaChallengeLicensePlan;
  files?: EurekaChallengeFile[];
}
