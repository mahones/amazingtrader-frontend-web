import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Broker } from "@/types/broker";

export function BrokerCard({ broker }: { broker: Broker }) {
  return (
    <a
      href={broker.affiliate_url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Créer un compte chez ${broker.name}`}
      className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Card className="flex-row items-center gap-4 p-(--card-spacing) text-left transition-shadow group-hover:shadow-lg group-hover:shadow-primary/10">
        <div className="relative flex aspect-[2/1] w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted sm:w-40">
          {broker.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time
            <img
              src={broker.logo_url}
              alt={broker.name}
              className="h-full w-full object-contain p-3"
            />
          ) : (
            <span className="text-sm font-bold text-foreground">{broker.name}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold">{broker.name}</p>
          {broker.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{broker.description}</p>
          )}
        </div>

        <ExternalLink
          className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
          aria-hidden
        />
      </Card>
    </a>
  );
}
