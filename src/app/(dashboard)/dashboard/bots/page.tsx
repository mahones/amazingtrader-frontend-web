"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { extractApiError } from "@/lib/api/client";
import { fetchMyBotAssignments } from "@/lib/api/bots";
import { deleteAdminTradingBot, fetchAdminTradingBots, createAdminTradingBot } from "@/lib/api/admin";
import type { BotAssignment, TradingBot } from "@/types/bot";

export default function DashboardBotsPage() {
  const { isStaff } = useAuth();
  const [assignments, setAssignments] = useState<BotAssignment[] | null>(null);
  const [bots, setBots] = useState<TradingBot[] | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  async function reloadBots() {
    const refreshed = await fetchAdminTradingBots();
    setBots(refreshed);
  }

  useEffect(() => {
    if (isStaff) reloadBots();
    else fetchMyBotAssignments().then(setAssignments);
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
            <p className="text-muted-foreground">Gérez les bots proposés et leurs attributions.</p>
          </div>
          <Button onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? "Annuler" : "Nouveau bot"}
          </Button>
        </div>

        {showCreate && (
          <CreateBotForm
            onCreated={async () => {
              setShowCreate(false);
              await reloadBots();
            }}
          />
        )}

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
                <div className="flex items-center gap-3">
                  <Badge variant={bot.is_active ? "default" : "secondary"}>
                    {bot.is_active ? "Actif" : "Inactif"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/dashboard/bots/${bot.id}`}>Gérer</Link>}
                  />
                  <Button variant="outline" size="sm" onClick={() => handleDeleteBot(bot.id)}>
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

function CreateBotForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await createAdminTradingBot({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description,
        is_active: true,
      });
      setName("");
      setDescription("");
      onCreated();
    } catch (err) {
      setError(extractApiError(err, "Impossible de créer le bot."));
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouveau bot</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Nom</Label>
            <Input id="bot-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bot-description">Description</Label>
            <Textarea
              id="bot-description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={pending}>
            {pending ? "Création..." : "Créer le bot"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
