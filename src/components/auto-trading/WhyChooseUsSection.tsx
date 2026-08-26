"use client";

import { motion } from "framer-motion";
import { Clock, Compass, Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// const WHATSAPP_URL =
//   "https://wa.me/22879920432?text=je%20souhaite%20b%C3%A9n%C3%A9ficier%20du%20service%20auto%20trading.";

const REASONS: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Nous faisons le travail acharné",
    description:
      "Nous mettons notre expertise à votre service pour vous éviter les pertes et vous aider à gagner de l'argent dès le début de votre parcours de trading.",
    icon: Flame,
  },
  {
    title: "Gagner du temps",
    description:
      "Profitez de nos services et gagnez de l'argent pendant que vous passez du temps avec votre famille.",
    icon: Clock,
  },
  {
    title: "Ce que nous faisons habituellement",
    description:
      "Comprendre vos options est une étape importante. Laissez-nous vous guider.",
    icon: Compass,
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="text-sm font-semibold">Nos engagements</span>
        <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">
          Pourquoi nous choisir ?
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {REASONS.map((reason, index) => (
          <motion.div
            key={reason.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative overflow-hidden flex items-center gap-4 rounded-2xl border border-slate-100 bg-[#F2F2F2] p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#0E0E0E]/40 dark:shadow-black/20 dark:backdrop-blur-md dark:hover:bg-[#0E0E0E]/60"
          >
            <span className="absolute inset-x-0 bottom-0 h-1 bg-primary" aria-hidden="true" />
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <reason.icon className="size-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                {reason.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-white/70">
                {reason.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
