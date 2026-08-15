import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BotSidebar } from "@/components/bots/BotSidebar";
import { BotLicensePurchaseGrid } from "@/components/purchase/BotLicensePurchaseGrid";
import { getTradingBot } from "@/lib/api/server";
// import { formatCurrency } from "@/lib/utils";

export default async function BotDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bot = await getTradingBot(slug).catch(() => null);

  if (!bot) {
    notFound();
  }

  const sanitizedDescription = DOMPurify.sanitize(bot.description);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-3">
        <article className="space-y-10 lg:col-span-2">
          <div>
            <div className="flex flex-wrap gap-1">
              {bot.pairs_traded.map((pair) => (
                <Badge key={pair} variant="secondary">
                  {pair}
                </Badge>
              ))}
            </div>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{bot.name}</h1>

            {/* <div className="mt-5">
              <div className="font-mono text-2xl font-bold tabular-nums text-primary">
                {bot.managed_capital !== null ? formatCurrency(bot.managed_capital) : "-"}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Capital géré</div>
            </div> */}
          </div>

          {bot.image_url && (
            <div className="overflow-hidden rounded-2xl border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time */}
              <img src={bot.image_url} alt={bot.name} className="aspect-video w-full object-cover" />
            </div>
          )}

          <div
            className="max-w-none space-y-4 leading-relaxed text-foreground/90 [&_a]:text-primary [&_a]:underline [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_img]:rounded-lg [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />

          {bot.strategy_summary && (
            <p className="border-t border-border/60 pt-6 text-sm text-muted-foreground">
              {bot.strategy_summary}
            </p>
          )}

          {bot.requirements && bot.requirements.length > 0 && (
            <div>
              <h2 className="text-xl font-bold">Exigences et recommandations</h2>
              <ul className="mt-4 space-y-3">
                {bot.requirements.map((req) => (
                  <li key={req.id} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{req.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {bot.performance_links && bot.performance_links.length > 0 && (
            <div>
              <h2 className="text-xl font-bold">Nos performances</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {bot.performance_links.map((link) => (
                  <Button
                    key={link.id}
                    variant="outline"
                    render={
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    }
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold">Nos tarifs</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choisissez la licence qui correspond le mieux à vos besoins.
            </p>
            <div className="mt-6">
              <BotLicensePurchaseGrid plans={bot.license_plans ?? []} />
            </div>
          </div>
        </article>

        <BotSidebar currentSlug={bot.slug} />
      </div>
    </div>
  );
}
