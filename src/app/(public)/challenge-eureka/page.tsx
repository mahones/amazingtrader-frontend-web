"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EurekaChallengeCard } from "@/components/cards/EurekaChallengeCard";
// import { EurekaChallengeHero } from "@/components/eureka-challenge/EurekaChallengeHero";
// import { PhotoTestimonialsSection } from "@/components/home/PhotoTestimonialsSection";
import { ContactCtaSection } from "@/components/auto-trading/ContactCtaSection";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { fetchEurekaChallenges } from "@/lib/api/eurekaChallenges";
import type { EurekaChallenge } from "@/types/eurekaChallenge";

export default function ChallengeEurekaPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const [challenges, setChallenges] = useState<EurekaChallenge[] | null>(null);

  useEffect(() => {
    if (!user) return;
    let isActive = true;

    fetchEurekaChallenges()
      .then((data) => {
        if (isActive) setChallenges(data);
      })
      .catch(() => {
        if (isActive) setChallenges([]);
      });

    return () => {
      isActive = false;
    };
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <>

      <div
        id="challenges"
        className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            <span className="text-primary">Eurêka</span> Programme
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Un programme de trading algorithmique pour ceux qui aiment le high risk
          </p>
        </div>

        {challenges === null && (
          <p className="mt-12 text-center text-muted-foreground">Chargement...</p>
        )}

        {challenges?.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            Aucun challenge disponible pour le moment.
          </p>
        )}

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {challenges?.map((challenge) => (
            <Link
              key={challenge.id}
              href={`/challenge-eureka/${challenge.slug}`}
              className="block"
            >
              <EurekaChallengeCard challenge={challenge} />
            </Link>
          ))}
        </div>
      </div>


      <ContactCtaSection
        title="Prêt à relever le Challenge Eureka ?"
        subtitle="Contactez-nous dès maintenant pour choisir le challenge adapté à votre profil."
        whatsappUrl="https://wa.me/22879920432?text=je%20souhaite%20b%C3%A9n%C3%A9ficier%20du%20challenge%20des%20eureka."
      />
    </>
  );
}
