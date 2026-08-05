import { apiClient } from "./client";
import type { Order } from "@/types/order";

export type PurchasableType = "course" | "license_plan";

export async function createOrder(items: { type: PurchasableType; id: number; quantity?: number }[]) {
  const { data } = await apiClient.post<{ data: Order }>("/orders", { items });
  return data.data;
}

export async function payOrder(orderId: number) {
  const { data } = await apiClient.post<{ data: Order }>(`/orders/${orderId}/pay`);
  return data.data;
}

export async function fetchMyOrders() {
  const { data } = await apiClient.get<{ data: Order[] }>("/orders");
  return data.data;
}

export async function purchase(type: PurchasableType, id: number) {
  const order = await createOrder([{ type, id }]);
  return payOrder(order.id);
}
