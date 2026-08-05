export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "canceled";

export interface OrderItem {
  id: number;
  purchasable_type: string;
  purchasable_id: number;
  unit_price: number;
  quantity: number;
}

export interface Order {
  id: number;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  gateway: string;
  gateway_reference: string | null;
  paid_at: string | null;
  items?: OrderItem[];
  created_at: string;
}
