"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { fetchMyBotAssignments } from "@/lib/api/bots";
import { fetchAdminTradingBots } from "@/lib/api/admin";
import type { BotAssignment, TradingBot } from "@/types/bot";

export default function DashboardBotsPage() {
  const { isStaff } = useAuth();
  const [assignments, setAssignments] = useState<BotAssignment[] | null>(null);
  const [bots, setBots] = useState<TradingBot[] | null>(null);

  useEffect(() => {
    if (isStaff) fetchAdminTradingBots().then(setBots);
    else fetchMyBotAssignments().then(setAssignments);
  }, [isStaff]);

  if (isStaff) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Bots de trading</h1>
          <p className="text-muted-foreground">Gérez les bots proposés et leurs attributions.</p>
        </div>

        <div className="grid gap-4">
          {bots === null && <p className="text-muted-foreground">Chargement...</p>}
          {bots?.map((bot) => (
            <Card key={bot.id}>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <h3 className="font-semibold">{bot.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Rendement {bot.yield_percent}% · Win rate {bot.win_rate_percent}%
                  </p>
                </div>
                <Badge variant={bot.is_active ? "default" : "secondary"}>
                  {bot.is_active ? "Actif" : "Inactif"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
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
              <p className="text-sm text-muted-foreground">{assignment.trading_bot.description}</p>
              <Button
                variant="outline"
                className="mt-3"
                render={<Link href={`/dashboard/bots/${assignment.id}`}>Voir l&apos;historique</Link>}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
