export type PromoCodeProductType = "course" | "license_plan" | "bot_license_plan";

export interface PromoCodeProduct {
  id: number;
  name: string;
}

export interface PromoCode {
  id: number;
  code: string;
  discount_percentage: number;
  expires_at: string | null;
  is_active: boolean;
  product_type: PromoCodeProductType | null;
  product_ids: number[];
  products: PromoCodeProduct[];
}
