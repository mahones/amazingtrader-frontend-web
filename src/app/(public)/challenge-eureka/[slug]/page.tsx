"use client";

import { use, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EurekaChallengeSidebar } from "@/components/eureka-challenge/EurekaChallengeSidebar";
import { EurekaChallengeLicensePurchaseGrid } from "@/components/purchase/EurekaChallengeLicensePurchaseGrid";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { fetchEurekaChallenge, fetchEurekaChallenges } from "@/lib/api/eurekaChallenges";
import { sanitizeContentHtml } from "@/lib/sanitize-content-html";
import type { EurekaChallenge } from "@/types/eurekaChallenge";

export default function EurekaChallengeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { user, isLoading: authLoading } = useRequireAuth();
  const [challenge, setChallenge] = useState<EurekaChallenge | null | undefined>(undefined);
  const [otherChallenges, setOtherChallenges] = useState<EurekaChallenge[]>([]);

  useEffect(() => {
    if (!user) return;
    let isActive = true;

    fetchEurekaChallenge(slug)
      .then((data) => {
        if (isActive) setChallenge(data);
      })
      .catch(() => {
        if (isActive) setChallenge(null);
      });

    fetchEurekaChallenges()
      .then((data) => {
        if (isActive) setOtherChallenges(data);
      })
      .catch(() => {
        if (isActive) setOtherChallenges([]);
      });

    return () => {
      isActive = false;
    };
  }, [user, slug]);

  if (authLoading || !user) return null;

  if (challenge === undefined) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-muted-foreground sm:px-6 lg:px-8">
        Chargement...
      </div>
    );
  }

  if (challenge === null) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-muted-foreground sm:px-6 lg:px-8">
        Ce challenge est introuvable.
      </div>
    );
  }

  const sanitizedDescription = sanitizeContentHtml(challenge.description);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-3">
        <article className="space-y-10 lg:col-span-2">
          <div>
            <div className="flex flex-wrap gap-1">
              {challenge.pairs_traded.map((pair) => (
                <Badge key={pair} variant="secondary">
                  {pair}
                </Badge>
              ))}
            </div>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{challenge.name}</h1>
          </div>

          {challenge.image_url && (
            <div className="overflow-hidden rounded-2xl border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time */}
              <img src={challenge.image_url} alt={challenge.name} className="aspect-video w-full object-cover" />
            </div>
          )}

          <div
            className="max-w-none space-y-4 leading-relaxed text-foreground/90 [&_a]:text-primary [&_a]:underline [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_img]:rounded-lg [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />

          {challenge.strategy_summary && (
            <p className="border-t border-border/60 pt-6 text-sm text-muted-foreground">
              {challenge.strategy_summary}
            </p>
          )}

          {challenge.requirements && challenge.requirements.length > 0 && (
            <div>
              <h2 className="text-xl font-bold">Exigences et recommandations</h2>
              <ul className="mt-4 space-y-3">
                {challenge.requirements.map((req) => (
                  <li key={req.id} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{req.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {challenge.performance_links && challenge.performance_links.length > 0 && (
            <div>
              <h2 className="text-xl font-bold">Nos performances</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {challenge.performance_links.map((link) => (
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
              <EurekaChallengeLicensePurchaseGrid plans={challenge.license_plans ?? []} />
            </div>
          </div>
        </article>

        <EurekaChallengeSidebar
          currentSlug={challenge.slug}
          otherChallenges={otherChallenges}
          brokers={challenge.brokers ?? []}
        />
      </div>
    </div>
  );
}
