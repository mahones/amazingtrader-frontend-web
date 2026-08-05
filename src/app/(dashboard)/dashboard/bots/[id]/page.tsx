"use client";

import { use, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { extractApiError } from "@/lib/api/client";
import { fetchBotAssignmentTrades } from "@/lib/api/bots";
import {
  assignBotToUser,
  createAdminBotTrade,
  fetchAdminBotAssignments,
  fetchAdminTradingBot,
  fetchAdminUsers,
  updateAdminBotAssignment,
} from "@/lib/api/admin";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { BotAssignment, BotAssignmentStatus, BotTrade, TradingBot } from "@/types/bot";
import type { User } from "@/types/user";

export default function BotTradesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isStaff } = useAuth();

  if (isStaff) {
    return <AdminBotView botId={Number(id)} />;
  }

  return <StudentBotTradesView assignmentId={Number(id)} />;
}

function StudentBotTradesView({ assignmentId }: { assignmentId: number }) {
  const [trades, setTrades] = useState<BotTrade[] | null>(null);

  useEffect(() => {
    fetchBotAssignmentTrades(assignmentId).then(setTrades);
  }, [assignmentId]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Historique des transactions</h1>

      <Card>
        <CardHeader>
          <CardTitle>Trades récents</CardTitle>
        </CardHeader>
        <CardContent>
          {trades === null && <p className="text-muted-foreground">Chargement...</p>}
          {trades?.length === 0 && (
            <p className="text-muted-foreground">Aucun trade enregistré pour ce bot.</p>
          )}
          {trades && trades.length > 0 && <TradesTable trades={trades} />}
        </CardContent>
      </Card>
    </div>
  );
}

function TradesTable({ trades }: { trades: BotTrade[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Paire</TableHead>
          <TableHead>Sens</TableHead>
          <TableHead>Entrée</TableHead>
          <TableHead>Sortie</TableHead>
          <TableHead>P&amp;L</TableHead>
          <TableHead>Ouvert le</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.map((trade) => (
          <TableRow key={trade.id}>
            <TableCell>{trade.pair}</TableCell>
            <TableCell>
              <Badge variant={trade.direction === "buy" ? "default" : "secondary"}>
                {trade.direction === "buy" ? "Achat" : "Vente"}
              </Badge>
            </TableCell>
            <TableCell>{trade.entry_price}</TableCell>
            <TableCell>{trade.exit_price ?? "-"}</TableCell>
            <TableCell className={Number(trade.profit_loss) >= 0 ? "text-primary" : "text-destructive"}>
              {trade.profit_loss !== null ? formatCurrency(trade.profit_loss) : "-"}
            </TableCell>
            <TableCell>{formatDate(trade.opened_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AdminBotView({ botId }: { botId: number }) {
  const [bot, setBot] = useState<TradingBot | null>(null);
  const [assignments, setAssignments] = useState<BotAssignment[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);

  async function reloadAssignments() {
    const refreshed = await fetchAdminBotAssignments(botId);
    setAssignments(refreshed);
  }

  useEffect(() => {
    fetchAdminTradingBot(botId).then(setBot);
    reloadAssignments();
    fetchAdminUsers().then(setUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botId]);

  if (!bot) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{bot.name}</h1>
        <Badge variant={bot.is_active ? "default" : "secondary"}>
          {bot.is_active ? "Actif" : "Inactif"}
        </Badge>
      </div>
      <p className="text-muted-foreground">{bot.description}</p>

      <Card>
        <CardHeader>
          <CardTitle>Attributions ({assignments?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AssignUserForm
            users={users}
            onAssigned={reloadAssignments}
            assign={(userId) => assignBotToUser(botId, userId)}
          />

          {assignments === null && <p className="text-muted-foreground">Chargement...</p>}
          {assignments?.length === 0 && (
            <p className="text-muted-foreground">Aucun utilisateur n&apos;a ce bot pour le moment.</p>
          )}
          {assignments?.map((assignment) => (
            <AssignmentRow key={assignment.id} assignment={assignment} onChanged={reloadAssignments} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function AssignUserForm({
  users,
  assign,
  onAssigned,
}: {
  users: User[] | null;
  assign: (userId: number) => Promise<unknown>;
  onAssigned: () => void;
}) {
  const [selected, setSelected] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAssign() {
    if (!selected) return;
    setError(null);
    setPending(true);
    try {
      await assign(Number(selected));
      setSelected("");
      onAssigned();
    } catch (err) {
      setError(extractApiError(err, "Impossible d'attribuer le bot."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-border pb-4">
      <div className="space-y-2">
        <Label>Attribuer à un utilisateur</Label>
        <Select value={selected} onValueChange={(value) => setSelected(value ?? "")}>
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="Choisir un utilisateur" />
          </SelectTrigger>
          <SelectContent>
            {users?.map((user) => (
              <SelectItem key={user.id} value={String(user.id)}>
                {user.name} ({user.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleAssign} disabled={!selected || pending}>
        {pending ? "Attribution..." : "Attribuer"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function AssignmentRow({
  assignment,
  onChanged,
}: {
  assignment: BotAssignment;
  onChanged: () => void;
}) {
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [statusPending, setStatusPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(status: BotAssignmentStatus) {
    setError(null);
    setStatusPending(true);
    try {
      await updateAdminBotAssignment(assignment.id, status);
      onChanged();
    } catch (err) {
      setError(extractApiError(err, "Impossible de mettre à jour le statut."));
    } finally {
      setStatusPending(false);
    }
  }

  return (
    <div className="rounded-md border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">{assignment.user?.name ?? `Utilisateur #${assignment.id}`}</p>
          <p className="text-sm text-muted-foreground">{assignment.user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={assignment.status}
            onValueChange={(value) => value && handleStatusChange(value as BotAssignmentStatus)}
            disabled={statusPending}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="paused">En pause</SelectItem>
              <SelectItem value="stopped">Arrêté</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setShowTradeForm((v) => !v)}>
            {showTradeForm ? "Fermer" : "Ajouter un trade"}
          </Button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      {showTradeForm && (
        <LogTradeForm
          assignmentId={assignment.id}
          onLogged={() => setShowTradeForm(false)}
        />
      )}
    </div>
  );
}

function LogTradeForm({ assignmentId, onLogged }: { assignmentId: number; onLogged: () => void }) {
  const [pair, setPair] = useState("EUR/USD");
  const [direction, setDirection] = useState<"buy" | "sell">("buy");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [profitLoss, setProfitLoss] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await createAdminBotTrade(assignmentId, {
        pair,
        direction,
        entry_price: Number(entryPrice),
        exit_price: exitPrice ? Number(exitPrice) : null,
        profit_loss: profitLoss ? Number(profitLoss) : null,
        opened_at: new Date().toISOString(),
      });
      setEntryPrice("");
      setExitPrice("");
      setProfitLoss("");
      onLogged();
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer le trade."));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor={`pair-${assignmentId}`}>Paire</Label>
        <Input id={`pair-${assignmentId}`} required value={pair} onChange={(e) => setPair(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Sens</Label>
        <Select value={direction} onValueChange={(v) => v && setDirection(v as "buy" | "sell")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buy">Achat</SelectItem>
            <SelectItem value="sell">Vente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`entry-${assignmentId}`}>Prix d&apos;entrée</Label>
        <Input
          id={`entry-${assignmentId}`}
          type="number"
          step="any"
          required
          value={entryPrice}
          onChange={(e) => setEntryPrice(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`exit-${assignmentId}`}>Prix de sortie</Label>
        <Input
          id={`exit-${assignmentId}`}
          type="number"
          step="any"
          value={exitPrice}
          onChange={(e) => setExitPrice(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`pnl-${assignmentId}`}>P&amp;L</Label>
        <Input
          id={`pnl-${assignmentId}`}
          type="number"
          step="any"
          value={profitLoss}
          onChange={(e) => setProfitLoss(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive sm:col-span-4">{error}</p>}
      <Button type="submit" disabled={pending} className="sm:col-span-4">
        {pending ? "Enregistrement..." : "Enregistrer le trade"}
      </Button>
    </form>
  );
}
