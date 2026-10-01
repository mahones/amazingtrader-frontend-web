import Link from "next/link";
import { Trophy, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EurekaChallenge } from "@/types/eurekaChallenge";
import type { Broker } from "@/types/broker";

export function EurekaChallengeSidebar({
  currentSlug,
  otherChallenges,
  brokers,
}: {
  currentSlug: string;
  otherChallenges: EurekaChallenge[];
  brokers: Broker[];
}) {
  const others = otherChallenges.filter((challenge) => challenge.slug !== currentSlug);

  return (
    <aside className="sticky top-20 self-start space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Autres challenges Eureka</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {others.map((challenge) => (
              <li key={challenge.id}>
                <Link
                  href={`/challenge-eureka/${challenge.slug}`}
                  className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent"
                >
                  {challenge.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time
                    <img
                      src={challenge.image_url}
                      alt={challenge.name}
                      className="size-11 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Trophy className="size-5" />
                    </span>
                  )}
                  <span className="text-sm font-medium leading-snug">{challenge.name}</span>
                </Link>
              </li>
            ))}
            {others.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun autre challenge pour le moment.</p>
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
