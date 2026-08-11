import { apiClient } from "./client";
import { formatCurrency } from "@/lib/utils";
import type { PaginatedResponse } from "./admin";

export const NOTIFICATION_TYPES = {
  paidOrder: "App\\Notifications\\NewPaidOrderNotification",
  newUser: "App\\Notifications\\NewUserRegisteredNotification",
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

export interface AdminNotification {
  id: string;
  type: string;
  data: PaidOrderNotificationData | NewUserNotificationData;
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

  const data = notification.data as PaidOrderNotificationData;
  return {
    title: `Nouveau paiement de ${data.user_name}`,
    subtitle: `${formatCurrency(data.total_amount)} · ${data.item_names?.join(", ") ?? data.item_types.join(", ")}`,
  };
}

export async function fetchAdminNotifications() {
  const { data } = await apiClient.get<{ data: AdminNotification[] }>("/admin/notifications");
  return data.data;
}

export async function fetchAdminNotificationsPaged(page = 1) {
  const { data } = await apiClient.get<PaginatedResponse<AdminNotification>>("/admin/notifications", {
    params: { page },
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
