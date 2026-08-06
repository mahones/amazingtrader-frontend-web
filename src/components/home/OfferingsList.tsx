"use client";

import { motion } from "framer-motion";
import { BookOpen, Cpu, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STATS: {
  value: string;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    value: "Intelligence Artificielle",
    label: "Traders formés",
    icon: Cpu,
  },
  {
    value: "Efficacité & Rentabilité",
    label: "Marchés scannés",
    icon: TrendingUp,
  },
  {
    value: "Formation sur mesure",
    label: "Disponibilité",
    icon: BookOpen,
  },
];

export function OfferingsList() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-center  text-2xl sm:text-2xl">
          Votre recherche d’une rentabilité constante du trading se termine
          ici….
        </h1>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-2xl border border-primary/25 bg-primary/10 px-6 py-6 text-center backdrop-blur-md"
            >
              <stat.icon className="mx-auto mb-4 h-10 w-10 text-primary" />
              <div className="text-2xl tracking-tight sm:text-2xl">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
