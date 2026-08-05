"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const OFFERINGS = [
  {
    title: "Auto-trading",
    description:
      "Souscrivez une licence, connectez votre broker et laissez une stratégie éprouvée trader pour vous — avec un résumé clair de sa logique, pas une boîte noire.",
    href: "/auto-trading",
    size: "text-4xl sm:text-5xl",
  },
  {
    title: "Bots de trading",
    description:
      "Des algorithmes aux performances historiques documentées (rendement, drawdown, win rate), attribués à votre compte et suivis en continu.",
    href: "/bot-trading",
    size: "text-3xl sm:text-4xl",
  },
  {
    title: "Formations",
    description:
      "Des parcours vidéo, du premier ordre aux stratégies avancées, pour comprendre les marchés avant — ou en complément — de l'auto-trading.",
    href: "/formations",
    size: "text-3xl sm:text-4xl",
  },
];

export function OfferingsList() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="border-t border-border/60">
        {OFFERINGS.map((offering, index) => (
          <motion.div
            key={offering.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={offering.href}
              className="group grid grid-cols-1 items-start gap-3 border-b border-border/60 py-10 transition-colors hover:bg-muted/40 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 sm:px-4"
            >
              <div>
                <h3 className={`font-bold tracking-tight ${offering.size}`}>{offering.title}</h3>
                <p className="mt-3 max-w-xl text-muted-foreground">{offering.description}</p>
              </div>
              <ArrowUpRight className="size-6 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
