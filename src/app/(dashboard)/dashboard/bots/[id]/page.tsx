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
import { fetchBotAssignmentTrades } from "@/lib/api/bots";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { BotTrade } from "@/types/bot";

export default function BotTradesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [trades, setTrades] = useState<BotTrade[] | null>(null);

  useEffect(() => {
    fetchBotAssignmentTrades(Number(id)).then(setTrades);
  }, [id]);

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
          {trades && trades.length > 0 && (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
