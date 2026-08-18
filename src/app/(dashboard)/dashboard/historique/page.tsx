"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRequireRole } from "@/hooks/useRequireRole";
import {
  NOTIFICATION_TYPES,
  fetchAdminNotificationsPaged,
  formatNotificationMessage,
  type AdminNotification,
} from "@/lib/api/notifications";

const TYPE_FILTERS = [
  { value: "tout", label: "Tous les évènements" },
  { value: "purchase", label: "Achats" },
  { value: "registration", label: "Inscriptions" },
];

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));
}

function eventLabel(type: string) {
  return type === NOTIFICATION_TYPES.newUser ? "Inscription" : "Achat";
}

export default function DashboardHistoriquePage() {
  useRequireRole(["admin", "developer"]);

  const [type, setType] = useState("tout");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<AdminNotification[] | null>(null);
  const [meta, setMeta] = useState<{ current_page: number; last_page: number } | null>(null);

  useEffect(() => {
    fetchAdminNotificationsPaged(page, {
      type: type === "tout" ? undefined : (type as "purchase" | "registration"),
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    }).then((res) => {
      setNotifications(res.data);
      setMeta(res.meta);
    });
  }, [page, type, dateFrom, dateTo]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historique</h1>
        <p className="text-muted-foreground">
          Journal chronologique de toutes les notifications reçues (achats, inscriptions...).
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Select
          value={type}
          onValueChange={(value) => {
            setType(value ?? "tout");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_FILTERS.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-col gap-1">
          <label htmlFor="date_from" className="text-xs text-muted-foreground">
            Du
          </label>
          <Input
            id="date_from"
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className="w-[160px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="date_to" className="text-xs text-muted-foreground">
            Au
          </label>
          <Input
            id="date_to"
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="w-[160px]"
          />
        </div>
        {(type !== "tout" || dateFrom || dateTo) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setType("tout");
              setDateFrom("");
              setDateTo("");
              setPage(1);
            }}
          >
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications === null && <p className="text-muted-foreground">Chargement...</p>}
        {notifications?.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Aucun évènement pour le moment.
            </CardContent>
          </Card>
        )}
        {notifications?.map((notification) => {
          const { title, subtitle } = formatNotificationMessage(notification);
          return (
            <Card key={notification.id}>
              <CardContent className="flex items-center justify-between gap-4 pt-6">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{eventLabel(notification.type)}</Badge>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDateTime(notification.created_at)}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={meta.current_page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.current_page} / {meta.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.current_page >= meta.last_page}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
