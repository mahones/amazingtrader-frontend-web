import { apiClient } from "./client";
import { formatCurrency, formatPartnerAmount } from "@/lib/utils";
import type { PaginatedResponse } from "./admin";

export const NOTIFICATION_TYPES = {
  paidOrder: "App\\Notifications\\NewPaidOrderNotification",
  newUser: "App\\Notifications\\NewUserRegisteredNotification",
  credentialsUpdate: "App\\Notifications\\PurchaseDetailsChangeRequestedNotification",
  partnerApplication: "App\\Notifications\\NewPartnerApplicationNotification",
  withdrawalRequested: "App\\Notifications\\WithdrawalRequestedNotification",
} as const;

export interface PaidOrderNotificationData {
  order_id: number;
  user_id: number;
  user_name: string;
  total_amount: number;
  item_types: string[];
  item_names: string[];
}

export interface NewUserNotificationData {
  user_id: number;
  user_name: string;
  user_email: string;
}

export interface CredentialsChangeNotificationData {
  license_id: number;
  license_type: "auto_trading" | "bot_trading";
  user_id: number;
  user_name: string;
  plan_name: string;
}

export interface PartnerApplicationNotificationData {
  partner_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
}

export interface WithdrawalRequestedNotificationData {
  withdrawal_id: number;
  partner_id: number;
  user_id: number;
  user_name: string;
  amount: number;
  payment_method: string;
  receiving_identifier: string;
}

export interface AdminNotification {
  id: string;
  type: string;
  data:
    | PaidOrderNotificationData
    | NewUserNotificationData
    | CredentialsChangeNotificationData
    | PartnerApplicationNotificationData
    | WithdrawalRequestedNotificationData;
  read_at: string | null;
  created_at: string;
}

export function formatNotificationMessage(notification: AdminNotification): {
  title: string;
  subtitle: string;
} {
  if (notification.type === NOTIFICATION_TYPES.newUser) {
    const data = notification.data as NewUserNotificationData;
    return {
      title: `Nouvelle inscription : ${data.user_name}`,
      subtitle: data.user_email,
    };
  }

  if (notification.type === NOTIFICATION_TYPES.credentialsUpdate) {
    const data = notification.data as CredentialsChangeNotificationData;
    return {
      title: `Modification d'identifiants : ${data.user_name}`,
      subtitle: data.plan_name,
    };
  }

  if (notification.type === NOTIFICATION_TYPES.partnerApplication) {
    const data = notification.data as PartnerApplicationNotificationData;
    return {
      title: `Demande de partenariat : ${data.user_name}`,
      subtitle: data.user_email,
    };
  }

  if (notification.type === NOTIFICATION_TYPES.withdrawalRequested) {
    const data = notification.data as WithdrawalRequestedNotificationData;
    return {
      title: `Demande de retrait : ${data.user_name}`,
      subtitle: formatPartnerAmount(data.amount),
    };
  }

  const data = notification.data as PaidOrderNotificationData;
  return {
    title: `Nouveau paiement de ${data.user_name}`,
    subtitle: `${formatCurrency(data.total_amount)} · ${data.item_names?.join(", ") ?? data.item_types.join(", ")}`,
  };
}

export const NOTIFICATION_BELL_LIMIT = 5;

export async function fetchAdminNotifications() {
  const { data } = await apiClient.get<{ data: AdminNotification[] }>("/admin/notifications", {
    params: { per_page: NOTIFICATION_BELL_LIMIT },
  });
  return data.data;
}

export interface NotificationFilters {
  type?: "purchase" | "registration" | "credentials_update" | "partner_application" | "withdrawal_request";
  date_from?: string;
  date_to?: string;
}

export async function fetchAdminNotificationsPaged(page = 1, filters: NotificationFilters = {}) {
  const { data } = await apiClient.get<PaginatedResponse<AdminNotification>>("/admin/notifications", {
    params: { page, ...filters },
  });
  return data;
}

export async function fetchAdminUnreadCount() {
  const { data } = await apiClient.get<{ count: number }>("/admin/notifications/unread-count");
  return data.count;
}

export async function markNotificationRead(id: string) {
  await apiClient.patch(`/admin/notifications/${id}/read`);
}

export async function markAllNotificationsRead() {
  await apiClient.patch("/admin/notifications/read-all");
}
