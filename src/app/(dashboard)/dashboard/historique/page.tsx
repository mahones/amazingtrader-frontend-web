"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  { value: "partner_application", label: "Demandes partenaires" },
  { value: "withdrawal_request", label: "Demandes de retrait" },
  { value: "community_message", label: "Messages communauté" },
  { value: "event", label: "Évènements créés" },
];

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));
}

function eventLabel(type: string) {
  if (type === NOTIFICATION_TYPES.newUser) return "Inscription";
  if (type === NOTIFICATION_TYPES.partnerApplication) return "Partenariat";
  if (type === NOTIFICATION_TYPES.withdrawalRequested) return "Retrait";
  if (type === NOTIFICATION_TYPES.communityMessage) return "Communauté";
  if (type === NOTIFICATION_TYPES.event) return "Évènement";
  return "Achat";
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
      type:
        type === "tout"
          ? undefined
          : (type as
              | "purchase"
              | "registration"
              | "partner_application"
              | "withdrawal_request"
              | "community_message"
              | "event"),
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

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-end gap-3 p-4">
          <Select
            items={TYPE_FILTERS}
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

        <div className="overflow-x-auto border-t border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Évènement</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications === null && (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    Chargement...
                  </TableCell>
                </TableRow>
              )}
              {notifications?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    Aucun évènement pour le moment.
                  </TableCell>
                </TableRow>
              )}
              {notifications?.map((notification) => {
                const { title, subtitle } = formatNotificationMessage(notification);
                return (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <Badge variant="outline">{eventLabel(notification.type)}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <p className="font-medium">{title}</p>
                      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                    </TableCell>
                    <TableCell>{formatDateTime(notification.created_at)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-border p-4 text-sm text-muted-foreground">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.current_page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Précédent
            </Button>
            <span>
              Page {meta.current_page} sur {meta.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
