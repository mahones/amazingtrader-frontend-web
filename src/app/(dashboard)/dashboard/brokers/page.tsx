"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Plus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CatalogCard, CatalogCardGrid } from "@/components/dashboard/CatalogListCard";
import { BrokerDialog } from "@/components/admin/BrokerDialog";
import { useRequireRole } from "@/hooks/useRequireRole";
import {
  deleteAdminBroker,
  fetchAdminBrokers,
  fetchAdminBrokersPageSettings,
  updateAdminBrokersPageSettings,
} from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import type { Broker } from "@/types/broker";

function BrokersPageTextCard() {
  const [description, setDescription] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminBrokersPageSettings().then((settings) => {
      setDescription(settings.description);
      setLoaded(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await updateAdminBrokersPageSettings({ description });
      toast.success("Le texte de la page a été mis à jour.");
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer ce texte."));
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Texte de la page publique</CardTitle>
        <CardDescription>
          Cette description apparaît en haut de la page publique &quot;Courtier recommandés&quot;, sous le titre.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!loaded ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brokers-page-description">Description</Label>
              <Textarea
                id="brokers-page-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {error && <Alert variant="error">{error}</Alert>}
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

      <BrokersPageTextCard />

      {brokers === null && <p className="text-muted-foreground">Chargement...</p>}
      {brokers?.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Aucun courtier pour le moment.
          </CardContent>
        </Card>
      )}
      <CatalogCardGrid>
        {brokers?.map((broker) => (
          <CatalogCard
            key={broker.id}
            media={
              broker.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded logo, arbitrary host not known at build time
                <img
                  src={broker.logo_url}
                  alt={broker.name}
                  className="h-10 w-16 rounded-md border border-border object-contain p-1"
                />
              ) : (
                <span className="flex h-10 w-16 items-center justify-center rounded-md border border-border bg-muted text-xs text-muted-foreground">
                  Pas de logo
                </span>
              )
            }
            title={broker.name}
            badges={
              <>
                {broker.category && <Badge variant="outline">{broker.category}</Badge>}
                <Badge variant={broker.is_active ? "default" : "secondary"}>
                  {broker.is_active ? "Actif" : "Inactif"}
                </Badge>
              </>
            }
            caption={
              <a
                href={broker.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary"
              >
                <span className="truncate">{broker.affiliate_url}</span>
                <ExternalLink className="size-3 shrink-0" />
              </a>
            }
            actions={
              <>
                <BrokerDialog
                  broker={broker}
                  onSaved={handleSaved}
                  trigger={
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(broker.id)}
                >
                  Supprimer
                </Button>
              </>
            }
          />
        ))}
      </CatalogCardGrid>
    </div>
  );
}
