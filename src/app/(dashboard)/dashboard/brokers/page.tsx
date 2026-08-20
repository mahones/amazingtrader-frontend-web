"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BrokerDialog } from "@/components/admin/BrokerDialog";
import { useRequireRole } from "@/hooks/useRequireRole";
import { deleteAdminBroker, fetchAdminBrokers } from "@/lib/api/admin";
import { toast } from "@/lib/toast";
import type { Broker } from "@/types/broker";

export default function DashboardBrokersPage() {
  useRequireRole(["admin", "developer"]);

  const [brokers, setBrokers] = useState<Broker[] | null>(null);

  async function reload() {
    const refreshed = await fetchAdminBrokers();
    setBrokers(refreshed);
  }

  useEffect(() => {
    void reload();
  }, []);

  function handleSaved(broker: Broker) {
    setBrokers((prev) => {
      if (!prev) return [broker];
      const exists = prev.some((b) => b.id === broker.id);
      return exists ? prev.map((b) => (b.id === broker.id ? broker : b)) : [...prev, broker];
    });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Supprimer définitivement ce courtier ?")) return;
    try {
      await deleteAdminBroker(id);
      setBrokers((prev) => prev?.filter((b) => b.id !== id) ?? null);
      toast.success("Courtier supprimé.");
    } catch {
      toast.error("Impossible de supprimer ce courtier.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Courtiers recommandés</h1>
          <p className="text-muted-foreground">
            Gérez les courtiers partenaires affichés sur les pages bots de trading.
          </p>
        </div>
        <BrokerDialog
          onSaved={handleSaved}
          trigger={
            <Button>
              <Plus className="mr-1 size-4" /> Nouveau courtier
            </Button>
          }
        />
      </div>

      <div className="grid gap-4">
        {brokers === null && <p className="text-muted-foreground">Chargement...</p>}
        {brokers?.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Aucun courtier pour le moment.
            </CardContent>
          </Card>
        )}
        {brokers?.map((broker) => (
          <Card key={broker.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div className="flex min-w-0 items-center gap-4">
                {broker.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded logo, arbitrary host not known at build time
                  <img
                    src={broker.logo_url}
                    alt={broker.name}
                    className="h-10 w-16 shrink-0 rounded-md border border-border object-contain p-1"
                  />
                ) : (
                  <span className="flex h-10 w-16 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-xs text-muted-foreground">
                    Pas de logo
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold">{broker.name}</h3>
                  <a
                    href={broker.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                  >
                    <span className="truncate">{broker.affiliate_url}</span>
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Badge variant={broker.is_active ? "default" : "secondary"}>
                  {broker.is_active ? "Actif" : "Inactif"}
                </Badge>
                <BrokerDialog
                  broker={broker}
                  onSaved={handleSaved}
                  trigger={
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  }
                />
                <Button variant="outline" size="sm" onClick={() => handleDelete(broker.id)}>
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
