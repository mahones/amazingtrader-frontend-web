"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const FLOATING_TERMS = [
  { label: "Pip", className: "left-[6%] top-[14%] rotate-[-6deg]" },
  { label: "Spread", className: "left-[20%] top-[70%] rotate-[4deg]" },
  { label: "Effet de levier", className: "right-[24%] top-[10%] rotate-[3deg]" },
  { label: "Take Profit", className: "right-[6%] top-[62%] rotate-[-4deg]" },
];

export function LexiqueBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative isolate mt-10 overflow-hidden rounded-3xl bg-[#171717] px-6 py-10 shadow-lg shadow-black/20 sm:px-10 sm:py-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {FLOATING_TERMS.map((term) => (
          <span
            key={term.label}
            className={`absolute rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/25 ${term.className}`}
          >
            {term.label}
          </span>
        ))}
      </div>

      <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <BookOpen className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-balance text-white sm:text-3xl">
              Vous débutez ? Apprenez le vocabulaire avant de choisir votre formation
            </h2>
            <p className="mt-2 text-pretty text-white/60">
              Pip, spread, effet de levier, take profit... Notre lexique du trading explique chaque terme
              simplement, avec des exemples concrets.
            </p>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full shrink-0 lg:w-auto"
          render={
            <Link href="/lexique">
              Consulter le lexique
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />
      </div>
    </motion.section>
  );
}
