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

      </CardContent>
    </Card>
  );
}
