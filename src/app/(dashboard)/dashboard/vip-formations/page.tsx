"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CatalogCard, CatalogCardGrid } from "@/components/dashboard/CatalogListCard";
import { useAuth } from "@/context/AuthContext";
import { deleteAdminVipFormation, fetchAdminVipFormations } from "@/lib/api/admin";
import { fetchMyVipFormations } from "@/lib/api/vipFormations";
import { extractApiError } from "@/lib/api/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { UserVipFormation, VipFormation } from "@/types/vipFormation";

export default function DashboardVipFormationsPage() {
  const { isStaff } = useAuth();
  const [vipFormations, setVipFormations] = useState<VipFormation[] | null>(null);
  const [purchases, setPurchases] = useState<UserVipFormation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    const refreshed = await fetchAdminVipFormations();
    setVipFormations(refreshed);
  }

  useEffect(() => {
    async function load() {
      if (isStaff) {
        await reload();
      } else {
        setPurchases(await fetchMyVipFormations());
      }
    }

    load();
  }, [isStaff]);

  async function handleDelete(id: number) {
    if (!window.confirm("Supprimer définitivement cette formation VIP ?")) return;
    setError(null);
    try {
      await deleteAdminVipFormation(id);
      setVipFormations((prev) => prev?.filter((f) => f.id !== id) ?? prev);
    } catch (err) {
      setError(extractApiError(err, "Impossible de supprimer cette formation VIP."));
    }
  }

  if (isStaff) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Formations VIP</h1>
            <p className="text-muted-foreground">
              Formations premium sans leçons, achetées directement depuis la page Formations.
            </p>
          </div>
          <Button
            render={
              <Link href="/dashboard/vip-formations/new">
                <Plus className="mr-1 size-4" /> Nouvelle formation VIP
              </Link>
            }
          />
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {vipFormations === null && <p className="text-muted-foreground">Chargement...</p>}
        {vipFormations?.length === 0 && <p className="text-muted-foreground">Aucune formation VIP créée.</p>}

        <CatalogCardGrid>
          {vipFormations?.map((formation) => (
            <CatalogCard
              key={formation.id}
              title={formation.title}
              badges={
                <>
                  <Badge variant="outline">#{formation.position}</Badge>
                  <Badge variant={formation.is_active ? "default" : "secondary"}>
                    {formation.is_active ? "Active" : "Inactive"}
                  </Badge>
                  {formation.is_pinned && <Badge variant="success">Épinglée</Badge>}
                </>
              }
              caption={formatCurrency(formation.price)}
              actions={
                <>
                  <Button
                    size="sm"
                    render={<Link href={`/dashboard/vip-formations/${formation.id}/edit`}>Gérer</Link>}
                  />
                  <Tooltip>
                    <TooltipTrigger render={<span tabIndex={formation.has_active_subscribers ? 0 : undefined} />}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={formation.has_active_subscribers}
                        onClick={() => handleDelete(formation.id)}
                      >
                        Supprimer
                      </Button>
                    </TooltipTrigger>
                    {formation.has_active_subscribers && (
                      <TooltipContent>
                        Cette formation ne peut pas être supprimée car des utilisateurs l&apos;ont déjà achetée.
                      </TooltipContent>
                    )}
                  </Tooltip>
                </>
              }
            />
          ))}
        </CatalogCardGrid>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mes formations VIP</h1>
        <p className="text-muted-foreground">Retrouvez les formations premium que vous avez achetées.</p>
      </div>

      <div className="grid gap-4">
        {purchases === null && <p className="text-muted-foreground">Chargement...</p>}
        {purchases?.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Vous n&apos;avez pas encore de formation VIP.{" "}
              <Link href="/formations" className="font-medium text-primary hover:underline">
                Découvrir les formations
              </Link>
            </CardContent>
          </Card>
        )}
        {purchases?.map((purchase) => {
          const snapshot = purchase.product_snapshot ?? purchase.vip_formation;
          return (
            <Card key={purchase.id}>
              <CardContent className="space-y-3 pt-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold">{snapshot.title}</h3>
                  <span className="text-sm font-medium text-primary">{formatCurrency(snapshot.price)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{snapshot.description}</p>
                {snapshot.highlights.length > 0 && (
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {snapshot.highlights.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-muted-foreground/70">Acheté le {formatDate(purchase.created_at)}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
