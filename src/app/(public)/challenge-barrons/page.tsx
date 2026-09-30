"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarronsChallengeCard } from "@/components/cards/BarronsChallengeCard";
// import { BarronsChallengeHero } from "@/components/barrons-challenge/BarronsChallengeHero";
// import { PhotoTestimonialsSection } from "@/components/home/PhotoTestimonialsSection";
import { ContactCtaSection } from "@/components/auto-trading/ContactCtaSection";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { fetchBarronsChallenges } from "@/lib/api/barronsChallenges";
import type { BarronsChallenge } from "@/types/barronsChallenge";

export default function ChallengeBarronsPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const [challenges, setChallenges] = useState<BarronsChallenge[] | null>(null);

  useEffect(() => {
    if (!user) return;
    let isActive = true;

    fetchBarronsChallenges()
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
            <span className="text-primary">Challenge</span> des Barrons
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Choisissez le challenge qui correspond à votre profil et suivez son évolution
            depuis votre tableau de bord.
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
              href={`/challenge-barrons/${challenge.slug}`}
              className="block"
            >
              <BarronsChallengeCard challenge={challenge} />
            </Link>
          ))}
        </div>
      </div>


      <ContactCtaSection
        title="Prêt à relever le Challenge des Barrons ?"
        subtitle="Contactez-nous dès maintenant pour choisir le challenge adapté à votre profil."
        whatsappUrl="https://wa.me/22879920432?text=je%20souhaite%20b%C3%A9n%C3%A9ficier%20du%20challenge%20des%20barrons."
      />
    </>
  );
}
