import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Broker } from "@/types/broker";

export function BrokerCard({ broker }: { broker: Broker }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/10">
      <div className="px-(--card-spacing)">
        <div className="relative flex aspect-[2/1] w-full items-center justify-center overflow-hidden rounded-lg bg-muted">
          {broker.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time
            <img
              src={broker.logo_url}
              alt={broker.name}
              className="h-full w-full object-contain p-6"
            />
          ) : (
            <span className="text-lg font-bold text-foreground">{broker.name}</span>
          )}
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{broker.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {broker.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">{broker.description}</p>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          size="sm"
          render={
            <a href={broker.affiliate_url} target="_blank" rel="noopener noreferrer">
              Créer un compte <ExternalLink className="ml-1 size-3.5" />
            </a>
          }
        />
      </CardFooter>
    </Card>
  );
}
