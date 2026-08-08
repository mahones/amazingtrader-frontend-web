import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { stripHtml } from "@/lib/utils";
import type { TradingBot } from "@/types/bot";

export function BotPerformanceCard({ bot }: { bot: TradingBot }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/10">
      {bot.image_url && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time */}
          <img src={bot.image_url} alt={bot.name} className="size-full object-cover" />
        </div>
      )}
      <CardHeader>
        <div className="flex flex-wrap gap-1">
          {bot.pairs_traded.map((pair) => (
            <Badge key={pair} variant="secondary">{pair}</Badge>
          ))}
        </div>
        <CardTitle className="mt-2 text-lg">{bot.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="line-clamp-3 text-sm text-muted-foreground">{stripHtml(bot.description)}</p>

        <div className="mt-5 flex items-baseline divide-x divide-border">
          <div className="pr-4">
            <div className="font-mono text-2xl font-bold tabular-nums text-primary">
              {bot.yield_percent ?? 0}%
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Rendement</div>
          </div>
          <div className="px-4">
            <div className="font-mono text-2xl font-bold tabular-nums">
              {bot.drawdown_percent ?? 0}%
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Drawdown</div>
          </div>
          <div className="pl-4">
            <div className="font-mono text-2xl font-bold tabular-nums">
              {bot.win_rate_percent ?? 0}%
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Win rate</div>
          </div>
        </div>

        {bot.strategy_summary && (
          <p className="mt-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            {bot.strategy_summary}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
