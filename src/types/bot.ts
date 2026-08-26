import type { Broker } from "./broker";
import type { LicenseDurationUnit } from "./license";
import type { User } from "./user";

export type BotAssignmentStatus = "active" | "paused" | "stopped";
export type TradeDirection = "buy" | "sell";
export type PerformancePlatform = "myfxbook" | "mql5" | "other";
export type BotLicenseOfferType = "time_limited" | "lifetime";

export interface BotRequirement {
  id: number;
  label: string;
  position: number;
}

export interface BotInstruction {
  id: number;
  title: string;
  url: string;
  position: number;
}

export interface BotPerformanceLink {
  id: number;
  platform: PerformancePlatform;
  label: string;
  url: string;
  position: number;
}

export interface BotLicensePlan {
  id: number;
  trading_bot_id: number;
  offer_type: BotLicenseOfferType;
  name: string;
  description: string | null;
  duration_value: number | null;
  duration_unit: LicenseDurationUnit | null;
  price: number;
  features: string[];
  is_featured: boolean;
  is_active: boolean;
  position: number;
  purchase_count?: number;
  trading_bot?: TradingBot;
}

export interface BotFile {
  id: number;
  label: string;
  original_filename: string;
  size_bytes: number | null;
  mime_type: string | null;
  position: number;
  created_at: string;
}

export interface TradingBot {
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
  requirements?: BotRequirement[];
  performance_links?: BotPerformanceLink[];
  license_plans?: BotLicensePlan[];
  bot_instructions?: BotInstruction[];
  brokers?: Broker[];
}

export interface BotLicensePurchaseDetails {
  id: string;
}

export interface UserBotLicense {
  id: number;
  status: "active" | "expired" | "revoked";
  is_activated: boolean;
  purchase_details: BotLicensePurchaseDetails | null;
  pending_purchase_details: BotLicensePurchaseDetails | null;
  pending_purchase_details_submitted_at: string | null;
  activated_at: string | null;
  expires_at: string | null;
  bot_license_plan: BotLicensePlan;
  files?: BotFile[];
}

export interface BotAssignment {
  id: number;
  status: BotAssignmentStatus;
  assigned_at: string | null;
  trading_bot: TradingBot;
  user?: User;
}

export interface BotTrade {
  id: number;
  pair: string;
  direction: TradeDirection;
  entry_price: number;
  exit_price: number | null;
  profit_loss: number | null;
  opened_at: string;
  closed_at: string | null;
}
