"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchAdminNotifications,
  fetchAdminUnreadCount,
  formatNotificationMessage,
  markAllNotificationsRead,
  markNotificationRead,
  type AdminNotification,
} from "@/lib/api/notifications";

const POLL_INTERVAL_MS = 20_000;

export function NotificationBell() {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<AdminNotification[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const count = await fetchAdminUnreadCount();
        if (!cancelled) setUnreadCount(count);
      } catch {
        // ignore transient polling errors
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  async function handleOpenChange(open: boolean) {
    if (open && notifications === null) {
      const items = await fetchAdminNotifications();
      setNotifications(items);
    }
  }

  async function handleSelect(notification: AdminNotification) {
    if (!notification.read_at) {
      await markNotificationRead(notification.id);
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    router.push(`/dashboard/users/${notification.data.user_id}`);
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    setUnreadCount(0);
    setNotifications((items) => items?.map((n) => ({ ...n, read_at: new Date().toISOString() })) ?? null);
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="relative" />}>
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
        <span className="sr-only">Notifications</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-1.5 py-1">
          <span className="px-1.5 py-1 text-xs font-medium text-muted-foreground">Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
              Tout marquer lu
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications === null && (
          <p className="px-1.5 py-2 text-sm text-muted-foreground">Chargement...</p>
        )}
        {notifications?.length === 0 && (
          <p className="px-1.5 py-2 text-sm text-muted-foreground">Aucune notification.</p>
        )}
        {notifications?.map((notification) => {
          const { title, subtitle } = formatNotificationMessage(notification);
          return (
            <DropdownMenuItem
              key={notification.id}
              onClick={() => handleSelect(notification)}
              className="flex-col items-start gap-0.5"
            >
              <span className={notification.read_at ? "font-normal" : "font-medium"}>{title}</span>
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
