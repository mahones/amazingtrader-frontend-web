"use client";

import { motion } from "framer-motion";
import { GraduationCap, Layers, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const REASONS: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Formateurs expérimentés",
    description: "Apprends avec des traders pros qui savent transmettre leur savoir.",
    icon: GraduationCap,
  },
  {
    title: "Contenu structuré",
    description: "Progression logique des bases aux techniques avancées.",
    icon: Layers,
  },
  {
    title: "Communauté active",
    description: "Rejoins une communauté de traders motivés pour échanger et progresser ensemble.",
    icon: Users,
  },
];

export function WhyChooseFormationsSection() {
  return (
    <section className="mt-20">
      <div className="text-center">
        <span className="text-sm font-semibold">Pourquoi nous</span>
        <h2 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">
          Pourquoi choisir nos <span className="text-primary">formations</span>
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
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{reason.title}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-white/70">{reason.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
