"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const STATS = [
  {
    value: "Intelligence Artificielle",
    label: "Traders formés",
    href: "/auto-trading",
  },
  {
    value: "Efficacité & Rentabilité",
    label: "Marchés scannés",
    href: "/bot-trading",
  },
  {
    value: "Formation sur mesure",
    label: "Disponibilité",
    href: "/formations",
  },
];

export function OfferingsList() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
              <Link href={stat.href}>
                <div className="text-2xl font-extrabold tracking-tight sm:text-2xl">
                  {stat.value}
                </div>
                {/*<div className="mt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {stat.label}
                </div>*/}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
