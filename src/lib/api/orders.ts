import { apiClient } from "./client";
import type { Order } from "@/types/order";

export type PurchasableType =
  | "course"
  | "license_plan"
  | "bot_license_plan"
  | "eureka_challenge_license_plan"
  | "vip_formation";
export type PaymentGateway = "simulated";

export async function createOrder(
  items: { type: PurchasableType; id: number; quantity?: number }[],
  promoCode?: string,
  partnerCode?: string
) {
  const { data } = await apiClient.post<{ data: Order }>("/orders", {
    items,
    promo_code: promoCode,
    partner_code: partnerCode,
  });
  return data.data;
}

export interface PromoCodeValidationResult {
  valid: boolean;
  code: string;
  discount_percentage: number;
  subtotal: number;
  discount_amount: number;
  total: number;
}

export async function validatePromoCode(payload: { code: string; type: PurchasableType; id: number }) {
  const { data } = await apiClient.post<PromoCodeValidationResult>("/promo-codes/validate", payload);
  return data;
}

export async function validatePartnerCode(payload: { code: string; type: PurchasableType; id: number }) {
  const { data } = await apiClient.post<PromoCodeValidationResult>("/partner-codes/validate", payload);
  return data;
}

export async function payOrder(orderId: number, gateway?: PaymentGateway) {
  const { data } = await apiClient.post<{ data: Order }>(
    `/orders/${orderId}/pay`,
    gateway ? { gateway } : undefined
  );
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

/** Creates the PayPal order for the JS SDK buttons (PayPal / card popup, no redirect). */
export async function createPayPalSdkOrder(orderId: number) {
  const { data } = await apiClient.post<{ paypal_order_id: string }>(`/orders/${orderId}/pay/paypal/sdk-order`);
  return data.paypal_order_id;
}

export async function fetchPayPalConfig() {
  const { data } = await apiClient.get<{ client_id: string }>("/paypal/config");
  return data.client_id;
}

export async function capturePayPalPayment(orderId: number) {
  const { data } = await apiClient.post<{ data: Order }>(`/orders/${orderId}/pay/paypal/capture`);
  return data.data;
}

/**
 * CinetPay is redirect-based, not synchronous like payOrder(): returns the
 * hosted mobile-money checkout URL to send the browser to. Confirmation
 * happens via CinetPay's webhook, with verifyCinetPayPayment() as an
 * immediate re-check when the buyer lands back on the confirmation page.
 */
export async function payOrderWithCinetPay(orderId: number) {
  const { data } = await apiClient.post<{ redirect_url: string }>(`/orders/${orderId}/pay/cinetpay`);
  return data.redirect_url;
}

export async function verifyCinetPayPayment(orderId: number) {
  const { data } = await apiClient.post<{ data: Order }>(`/orders/${orderId}/pay/cinetpay/verify`);
  return data.data;
}
