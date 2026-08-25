import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Broker } from "@/types/broker";

export function BrokerCard({ broker }: { broker: Broker }) {
  return (
    <Card className="flex flex-row items-center gap-4 p-(--card-spacing) transition-shadow hover:shadow-lg hover:shadow-primary/10">
      <div className="relative flex aspect-[2/1] w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted sm:w-40">
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

      <Button
        size="sm"
        className="shrink-0"
        render={
          <a href={broker.affiliate_url} target="_blank" rel="noopener noreferrer">
            Créer un compte <ExternalLink className="ml-1 size-3.5" />
          </a>
        }
      />
    </Card>
  );
}
