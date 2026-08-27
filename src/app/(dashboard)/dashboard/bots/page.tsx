"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LicenseExpiryGauge } from "@/components/licenses/LicenseExpiryGauge";
import { EditPurchaseDetailsDialog } from "@/components/licenses/EditPurchaseDetailsDialog";
import { useAuth } from "@/context/AuthContext";
import { downloadBotFile, fetchMyBotLicenses } from "@/lib/api/bots";
import { deleteAdminTradingBot, fetchAdminTradingBots } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { BotFile, TradingBot, UserBotLicense } from "@/types/bot";

export default function DashboardBotsPage() {
  const { isStaff } = useAuth();
  const [botLicenses, setBotLicenses] = useState<UserBotLicense[] | null>(null);
  const [bots, setBots] = useState<TradingBot[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reloadBots() {
    const refreshed = await fetchAdminTradingBots();
    setBots(refreshed);
  }

  useEffect(() => {
    let isActive = true;

    async function loadData() {
      try {
        if (isStaff) {
          const refreshed = await fetchAdminTradingBots();
          if (isActive) {
            setBots(refreshed);
          }
          return;
        }

        const userLicenses = await fetchMyBotLicenses();

        if (isActive) {
          setBotLicenses(userLicenses);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des bots", error);
      }
    }

    void loadData();

    return () => {
      isActive = false;
    };
  }, [isStaff]);

  async function handleDeleteBot(id: number) {
    if (!window.confirm("Supprimer définitivement ce bot ?")) return;
    setError(null);
    try {
      await deleteAdminTradingBot(id);
      await reloadBots();
    } catch (err) {
      setError(extractApiError(err, "Impossible de supprimer ce bot."));
    }
  }

  if (isStaff) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bots de trading</h1>
            <p className="text-muted-foreground">
              Gérez les bots proposés et leurs attributions.
            </p>
          </div>
          <Button
            render={
              <Link href="/dashboard/bots/new">
                <Plus className="mr-1 size-4" /> Nouveau bot
              </Link>
            }
          />
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <div className="grid gap-4">
          {bots === null && (
            <p className="text-muted-foreground">Chargement...</p>
          )}
          {bots?.map((bot) => (
            <Card key={bot.id}>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <h3 className="font-semibold">{bot.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Capital géré :{" "}
                    {bot.managed_capital !== null
                      ? formatCurrency(bot.managed_capital)
                      : "-"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={bot.is_active ? "default" : "secondary"}>
                    {bot.is_active ? "Actif" : "Inactif"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/bot-trading/${bot.slug}`}>Voir la page</Link>}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <Link href={`/dashboard/bots/${bot.id}/edit`}>
                        Modifier le contenu
                      </Link>
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <Link href={`/dashboard/bots/${bot.id}`}>
                        Attributions
                      </Link>
                    }
                  />
                  <Tooltip>
                    <TooltipTrigger render={<span tabIndex={bot.has_active_subscribers ? 0 : undefined} />}>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={bot.has_active_subscribers}
                        onClick={() => handleDeleteBot(bot.id)}
                      >
                        Supprimer
                      </Button>
                    </TooltipTrigger>
                    {bot.has_active_subscribers && (
                      <TooltipContent>
                        Ce produit ne peut pas être supprimé car des utilisateurs y sont inscrits.
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Mes licences de bot</h2>
          <p className="text-muted-foreground">
            Vos licences achetées et les fichiers associés.
          </p>
        </div>

        <div className="grid gap-4">
          {botLicenses === null && (
            <p className="text-muted-foreground">Chargement...</p>
          )}
          {botLicenses?.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Vous n&apos;avez pas encore de licence de bot.
              </CardContent>
            </Card>
          )}
          {botLicenses?.map((license) => (
            <BotLicenseCard
              key={license.id}
              license={license}
              onUpdated={(updated) =>
                setBotLicenses((prev) => prev?.map((l) => (l.id === updated.id ? updated : l)) ?? prev)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BotLicenseCard({
  license,
  onUpdated,
}: {
  license: UserBotLicense;
  onUpdated: (license: UserBotLicense) => void;
}) {
  const { user } = useAuth();
  const bot = license.bot_license_plan.trading_bot;
  const files = license.files ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {license.bot_license_plan.name}
        </CardTitle>
        <CardAction className="flex items-center gap-3">
          {bot?.slug && (
            <Link
              href={`/bot-trading/${bot.slug}#plan-${license.bot_license_plan.id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Voir la page
            </Link>
          )}
          {license.status === "expired" || license.status === "revoked" ? (
            <Badge variant="secondary">{license.status === "expired" ? "Expirée" : "Révoquée"}</Badge>
          ) : license.is_activated ? (
            <Badge variant="success">Activé</Badge>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="pending">En attente d&apos;activation</Badge>
              <span className="text-xs text-muted-foreground">Le bot sera envoyé dans moins de 24h</span>
            </div>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <LicenseExpiryGauge
          activatedAt={license.activated_at}
          expiresAt={license.expires_at}
          status={license.status}
        />

        {(license.purchase_details || user?.whatsapp_number) && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {license.purchase_details && (
                <p>
                  <span className="text-muted-foreground">ID :</span> {license.purchase_details.id}
                </p>
              )}
              {user?.whatsapp_number && (
                <p>
                  <span className="text-muted-foreground">WhatsApp :</span> {user.whatsapp_number}
                </p>
              )}
            </div>
            <EditPurchaseDetailsDialog type="bot_license_plan" license={license} onUpdated={onUpdated} />
          </div>
        )}

        {license.pending_purchase_details && (
          <div className="rounded-lg border border-dashed border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
            Modification en attente d&apos;approbation
            {license.pending_purchase_details_submitted_at && (
              <> depuis le {formatDate(license.pending_purchase_details_submitted_at)}</>
            )}
            .
          </div>
        )}

        {bot?.bot_instructions && bot.bot_instructions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {bot.bot_instructions.map((instruction) => (
              <Button
                key={instruction.id}
                size="sm"
                className="bg-foreground text-background hover:bg-foreground/80"
                render={
                  <a href={instruction.url} target="_blank" rel="noopener noreferrer">
                    {instruction.title}
                  </a>
                }
              />
            ))}
          </div>
        )}

        {!license.purchase_details && !user?.whatsapp_number && (
          <div className="flex justify-end">
            <EditPurchaseDetailsDialog type="bot_license_plan" license={license} onUpdated={onUpdated} />
          </div>
        )}

        {files.length > 0 && (
          <div className="space-y-2 border-t border-border pt-4">
            <p className="text-sm font-medium">Mes fichiers</p>
            <ul className="space-y-1.5">
              {files.map((file: BotFile) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{file.label}</span>
                  <Button
                    size="sm"
                    className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30"
                    onClick={() => downloadBotFile(file)}
                  >
                    <Download className="mr-1 size-3.5" /> Télécharger
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
