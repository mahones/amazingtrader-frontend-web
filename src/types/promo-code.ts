export type PromoCodeApplicability = "courses" | "bot_licenses" | "auto_trading_licenses" | "all";

export interface PromoCode {
  id: number;
  code: string;
  discount_percentage: number;
  expires_at: string | null;
  is_active: boolean;
  applicable_to: PromoCodeApplicability;
}
