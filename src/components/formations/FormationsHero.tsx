"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function FormationsHero() {
  return (
    <section className="relative overflow-hidden bg-[#171717] py-10 lg:py-10">
      <Image
        src="/BACK.png"
        alt=""
        aria-hidden
        fill
        priority
        className="object-fit"
      />
      <div className="pointer-events-none absolute inset-0 bg-[#0E0E0E]/30" />

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
          className="relative mx-auto aspect-square w-full max-w-sm lg:max-w-lg"
        >
          <Image
            src="/AMEZING-TRADERS-formation.png"
            alt="Formation en trading amazingtraders"
            fill
            sizes="(min-width: 1024px) 512px, 384px"
            className="object-contain"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
