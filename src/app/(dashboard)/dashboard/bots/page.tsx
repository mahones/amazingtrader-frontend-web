"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { Download, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LicenseExpiryGauge } from "@/components/licenses/LicenseExpiryGauge";
import { useAuth } from "@/context/AuthContext";
import {
  downloadBotFile,
  fetchMyBotAssignments,
  fetchMyBotLicenses,
} from "@/lib/api/bots";
import { deleteAdminTradingBot, fetchAdminTradingBots } from "@/lib/api/admin";
import { formatCurrency } from "@/lib/utils";
import type {
  BotAssignment,
  BotFile,
  TradingBot,
  UserBotLicense,
} from "@/types/bot";

export default function DashboardBotsPage() {
  const { isStaff } = useAuth();
  const [assignments, setAssignments] = useState<BotAssignment[] | null>(null);
  const [botLicenses, setBotLicenses] = useState<UserBotLicense[] | null>(null);
  const [bots, setBots] = useState<TradingBot[] | null>(null);

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

        const [userAssignments, userLicenses] = await Promise.all([
          fetchMyBotAssignments(),
          fetchMyBotLicenses(),
        ]);

        if (isActive) {
          setAssignments(userAssignments);
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
    await deleteAdminTradingBot(id);
    await reloadBots();
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
                <div className="flex items-center gap-3">
                  <Badge variant={bot.is_active ? "default" : "secondary"}>
                    {bot.is_active ? "Actif" : "Inactif"}
                  </Badge>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteBot(bot.id)}
                  >
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

  return (
    <div className="space-y-8">
      {/* <div>
        <h1 className="text-2xl font-bold">Mes bots</h1>
        <p className="text-muted-foreground">Suivez les performances des bots qui vous sont attribués.</p>
      </div>

      <div className="grid gap-4">
        {assignments === null && <p className="text-muted-foreground">Chargement...</p>}
        {assignments?.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Aucun bot ne vous a été attribué pour le moment.
            </CardContent>
          </Card>
        )}
        {assignments?.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">{assignment.trading_bot.name}</CardTitle>
              <Badge variant={assignment.status === "active" ? "default" : "secondary"}>
                {assignment.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div
                className="line-clamp-3 text-sm text-muted-foreground [&_p]:inline"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(assignment.trading_bot.description) }}
              />
              <Button
                variant="outline"
                className="mt-3"
                render={<Link href={`/dashboard/bots/${assignment.id}`}>Voir l&apos;historique</Link>}
              />
            </CardContent>
          </Card>
        ))}
      </div> */}

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
            <BotLicenseCard key={license.id} license={license} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BotLicenseCard({ license }: { license: UserBotLicense }) {
  const bot = license.bot_license_plan.trading_bot;
  const files = bot?.bot_files ?? [];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">
          {license.bot_license_plan.name}
        </CardTitle>
        <Badge variant={license.status === "active" ? "default" : "secondary"}>
          {license.status === "active"
            ? "Active"
            : license.status === "expired"
              ? "Expirée"
              : "Révoquée"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <LicenseExpiryGauge
          activatedAt={license.activated_at}
          expiresAt={license.expires_at}
          status={license.status}
        />

        <p className="text-sm">
          <span className="text-muted-foreground">Clé de licence :</span>{" "}
          <code>{license.license_key}</code>
        </p>

        {files.length > 0 && (
          <div className="space-y-2 border-t border-border pt-4">
            <p className="text-sm font-medium">Fichiers du bot</p>
            <ul className="space-y-1.5">
              {files.map((file: BotFile) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{file.label}</span>
                  <Button
                    variant="outline"
                    size="sm"
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
