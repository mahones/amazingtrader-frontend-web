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

export type PartnerRewardClaimStatus = "pending" | "fulfilled";

export interface PartnerRewardClaim {
  id: number;
  status: PartnerRewardClaimStatus;
  claimed_at: string;
  fulfilled_at: string | null;
}

export interface PartnerReward {
  level: PartnerLevelName;
  name: string;
  min_cumulative_purchases: number;
  unlocked: boolean;
  progress_percent: number;
  claim: PartnerRewardClaim | null;
}

export interface AdminPartnerRewardClaim {
  id: number;
  level: PartnerLevelName;
  level_name: string | null;
  status: PartnerRewardClaimStatus;
  claimed_at: string;
  fulfilled_at: string | null;
  fulfilled_by: { id: number; name: string } | null;
  partner: {
    id: number;
    code: string | null;
    user: { id: number; name: string; email: string; whatsapp_number: string | null } | null;
  };
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
  rewards: PartnerReward[];
  levels: PartnerLevelConfig[] | null;
  user?: { id: number; name: string; email: string };
  reviewed_at: string | null;
  created_at: string;
}
