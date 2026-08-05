"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function ChartLine() {
  return (
    <svg
      viewBox="0 0 960 360"
      fill="none"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <motion.path
        d="M0 280 L90 260 L160 300 L230 190 L300 230 L380 120 L460 170 L540 90 L620 140 L700 60 L780 100 L860 30 L960 70"
        stroke="var(--color-primary)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />
      <motion.path
        d="M0 280 L90 260 L160 300 L230 190 L300 230 L380 120 L460 170 L540 90 L620 140 L700 60 L780 100 L860 30 L960 70 L960 360 L0 360 Z"
        fill="url(#hero-chart-fill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.2 }}
      />
      <defs>
        <linearGradient id="hero-chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-background">
      <div className="absolute inset-x-0 bottom-0 h-[55%] opacity-90">
        <ChartLine />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Automatisez votre trading,{" "}
            <span className="text-primary">accompagné</span> à chaque étape
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
            amazingtraders combine des formations claires et des licences
            d&apos;auto-trading transparentes : vous comprenez chaque stratégie
            avant de lui confier votre capital, avec un vrai accompagnement,
            pas une boîte noire.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg" render={
              <Link href="/auto-trading">
                Voir l&apos;auto-trading <ArrowRight className="ml-1 size-4" />
              </Link>
            } />
            <Button size="lg" variant="outline" render={<Link href="/formations">Découvrir les formations</Link>} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
