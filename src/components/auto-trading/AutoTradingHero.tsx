"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const VIDEO_URL = "https://www.youtube.com/watch?v=axf678yoSMQ";
const WHATSAPP_URL =
  "https://wa.me/22879920432?text=je%20souhaite%20b%C3%A9n%C3%A9ficier%20du%20service%20auto%20trading.";

const HIGHLIGHTS = [
  "Un trading sans effort qui génère des bénéfices.",
  "Plus besoin de deviner dans quelle direction ira le marché",
  "Tout ce que vous avez à faire est de définir un niveau de risque acceptable.",
];

export function AutoTradingHero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <Image
        src="/AMAZING-TRADING-background-auto-trading.webp"
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

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl">
            Jusqu&apos;à <span className="text-primary">25%</span> de
            croissance mensuelle,  <span className="text-primary">voir plus</span>
          </h1>

          <ul className="mt-5 flex flex-col gap-4">
            {HIGHLIGHTS.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Check className="size-4 text-white" strokeWidth={3} />
                </span>
                <span className="text-lg text-pretty text-white">{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-row flex-wrap items-center gap-4">
            <Button
              size="lg"
              render={
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  Nous contacter
                </a>
              }
            />
            <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-lg font-semibold text-white">
              <span className="text-primary">VPS</span>&nbsp;Gratuit
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Regarder la vidéo de présentation de l'auto-trading"
            className="group relative block aspect-video w-full overflow-hidden "
          >
            <Image
              src="/auto-trading.webp"
              alt="Présentation de l'auto-trading amazingtraders"
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
            {/* <div className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/45" /> */}
            <div className="absolute top-[58%] left-[53%] -translate-x-1/2 -translate-y-1/2">
              <span className="flex size-20 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition-transform group-hover:scale-110">
                <PlayCircle className="size-9" strokeWidth={1.5} />
              </span>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
