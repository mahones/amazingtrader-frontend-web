export type PartnerStatus = "pending" | "approved" | "rejected";
export type PartnerLevelName = "bronze" | "silver" | "gold" | "platinum";
export type PartnerAccountType = "self_service" | "assigned";

export interface PartnerLevelConfig {
  id: number;
  level: PartnerLevelName;
  name: string;
  gain_percentage: number;
  discount_percentage: number;
  min_cumulative_purchases: number;
}

export interface NextLevelInfo {
  level: PartnerLevelName;
  name: string;
  min_cumulative_purchases: number;
  amount_remaining: number;
}

export interface Partner {
  id: number;
  type: PartnerAccountType;
  status: PartnerStatus;
  code: string | null;
  is_code_editable: boolean;
  level: PartnerLevelName | null;
  level_name: string | null;
  gain_percentage: number | null;
  discount_percentage: number | null;
  cumulative_referred_purchases: number;
  balance: number;
  total_earned: number;
  next_level: NextLevelInfo | null;
  levels: PartnerLevelConfig[] | null;
  user?: { id: number; name: string; email: string };
  reviewed_at: string | null;
  created_at: string;
}
