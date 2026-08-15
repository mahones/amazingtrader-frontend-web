import { apiClient } from "./client";
import type { Order } from "@/types/order";

export type PurchasableType = "course" | "license_plan" | "bot_license_plan";
export type PaymentGateway = "simulated" | "paypal" | "moneyfusion";

export async function createOrder(items: { type: PurchasableType; id: number; quantity?: number }[]) {
  const { data } = await apiClient.post<{ data: Order }>("/orders", { items });
  return data.data;
}

export async function payOrder(orderId: number, gateway?: PaymentGateway) {
  const { data } = await apiClient.post<{ data: Order }>(
    `/orders/${orderId}/pay`,
    gateway ? { gateway } : undefined
  );
  return data.data;
}

export async function fetchMyOrders() {
  const { data } = await apiClient.get<{ data: Order[] }>("/orders");
  return data.data;
}

export async function fetchOrder(orderId: number) {
  const { data } = await apiClient.get<{ data: Order }>(`/orders/${orderId}`);
  return data.data;
}

/**
 * PayerURL is redirect-based, not synchronous like payOrder(): returns the
 * URL to send the browser to (PayerURL's hosted checkout, or — while the
 * backend's PAYERURL_FAKE_MODE is on, since PayerURL has no sandbox —
 * straight to the checkout confirmation page's simulate controls).
 */
export async function payOrderWithPayerUrl(orderId: number) {
  const { data } = await apiClient.post<{ redirect_url: string }>(`/orders/${orderId}/pay/payerurl`);
  return data.redirect_url;
}

export async function fetchPayerUrlConfig() {
  const { data } = await apiClient.get<{ fake_mode: boolean }>("/payerurl/config");
  return data;
}

export async function simulatePayerUrlPayment(orderId: number, outcome: "paid" | "cancel") {
  const { data } = await apiClient.post<{ status: string }>(`/orders/${orderId}/pay/payerurl/simulate`, { outcome });
  return data;
}
