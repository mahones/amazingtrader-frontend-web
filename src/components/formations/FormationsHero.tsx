"use client";

import Image from "next/image";
import { motion } from "framer-motion";

function ChartLine() {
  return (
    <svg
      viewBox="0 0 960 360"
      fill="none"
      className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-40"
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
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />
      <motion.path
        d="M0 280 L90 260 L160 300 L230 190 L300 230 L380 120 L460 170 L540 90 L620 140 L700 60 L780 100 L860 30 L960 70 L960 360 L0 360 Z"
        fill="url(#formations-hero-chart-fill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.2 }}
      />
      <defs>
        <linearGradient
          id="formations-hero-chart-fill"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="var(--color-primary)"
            stopOpacity="0.25"
          />
          <stop
            offset="100%"
            stopColor="var(--color-primary)"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FormationsHero() {
  return (
    <section className="relative overflow-hidden bg-[#171717] py-10 lg:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
      />
      <ChartLine />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl text-center lg:text-left"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Nos <span className="text-primary">formations</span> en trading
          </h1>
          <p className="mt-4 text-lg text-pretty text-white/70">
            Deviens un trader rentable et régulier sur le marché boursier en
            utilisant des stratégies pratiques testées.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative mx-auto aspect-square w-full max-w-sm lg:max-w-sm"
        >
          <Image
            src="/AMEZING-TRADERS-formation.png"
            alt="Formation en trading amazingtraders"
            fill
            sizes="384px"
            className="object-contain"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
