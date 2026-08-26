import Link from "next/link";
import { Bot as BotIcon, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTradingBots } from "@/lib/api/server";
import type { Broker } from "@/types/broker";

export async function BotSidebar({
  currentSlug,
  brokers,
}: {
  currentSlug: string;
  brokers: Broker[];
}) {
  const bots = await getTradingBots().catch(() => []);

  const otherBots = bots.filter((bot) => bot.slug !== currentSlug);

  return (
    <aside className="sticky top-20 self-start space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Autres bots de trading</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {otherBots.map((bot) => (
              <li key={bot.id}>
                <Link
                  href={`/bot-trading/${bot.slug}`}
                  className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent"
                >
                  {bot.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time
                    <img
                      src={bot.image_url}
                      alt={bot.name}
                      className="size-11 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <BotIcon className="size-5" />
                    </span>
                  )}
                  <span className="text-sm font-medium leading-snug">{bot.name}</span>
                </Link>
              </li>
            ))}
            {otherBots.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun autre bot pour le moment.</p>
            )}
          </ul>
        </CardContent>
      </Card>

      {brokers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Courtiers recommandés</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {brokers.map((broker) => (
                <li key={broker.id}>
                  <a
                    href={broker.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                  >
                    <span className="flex items-center gap-2">
                      {broker.logo_url && (
                        // eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time
                        <img src={broker.logo_url} alt={broker.name} className="h-5 w-auto object-contain" />
                      )}
                      {broker.name}
                    </span>
                    <ExternalLink className="size-3.5 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </aside>
  );
}
