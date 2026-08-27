"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const MYFXBOOK_URL = "https://www.myfxbook.com/members/AMAZINGTRADERS";

const HIGHLIGHTS: React.ReactNode[] = [
  <>
    Croissance <span className="text-primary">mensuelle</span> garantie
  </>,
  "Plus besoin de deviner dans quelle direction ira le marché",
  "Tout ce que vous avez à faire est de définir un niveau de risque acceptable.",
  <>
    Nous avons de <span className="text-primary">vrais résultats</span> vous
    pouvez vérifier et avoir confiance en notre service.
  </>,
];

export function BotTradingHero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <Image
        src="/AMAZING-TRADING-background-bot-trading.webp"
        alt=""
        aria-hidden
        fill
        priority
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-[#0E0E0E]/30" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <h1 className="text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl">
            Expérimentez la puissance du <span className="text-primary">trading algorithmique</span>
          </h1>

          <ul className="mt-5 flex flex-col gap-4">
            {HIGHLIGHTS.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Check className="size-4 text-white" strokeWidth={3} />
                </span>
                <span className="text-lg text-pretty text-white">{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              render={
                <a href="#bots">
                  Découvrir nos bots <ArrowRight className="ml-1 size-4" />
                </a>
              }
            />
            <Button
              size="lg"
              variant="outline"
              render={
                <a href={MYFXBOOK_URL} target="_blank" rel="noopener noreferrer">
                  Vérifier nos performances
                </a>
              }
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative aspect-[6/5] w-full overflow-hidden rounded-2xl"
        >
          <Image
            src="/amezing-traders-robot.png"
            alt="Algorithmes de trading amazingtraders en action"
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-contain"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
