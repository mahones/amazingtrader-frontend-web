"use client";

import { motion } from "framer-motion";
import { BookOpen, Cpu } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STATS: {
  value: string;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    value: "Intelligence Artificielle",
    label: "Analyse algorithmique en temps réel",
    icon: Cpu,
  },
  // {
  //   value: "Efficacité & Rentabilité",
  //   label: "Optimisation continue des signaux",
  //   icon: TrendingUp,
  // },
  {
    value: "Formation sur mesure",
    label: "Du débutant à l'expert encadré",
    icon: BookOpen,
  },
];

export function OfferingsList() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 pb-12 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-center  text-2xl sm:text-2xl font-extrabold text-[#0E0E0E]-900 mb-10">
          Votre recherche d’une rentabilité constante du trading <span className="text-amber-500"> se termine ici…. </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="bg-[#FDF3E7] p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center dark:bg-[#303030]/20 dark:border-[#303030]/25 dark:backdrop-blur-md dark:shadow-black/20 dark:hover:bg-[#0e0e0e]/30"
            >
                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-4">
                  {/* Icône IA */}<stat.icon className="text-primary" />
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">{stat.value}</h3>
                <p className="text-sm text-slate-500 mt-1 dark:text-white/70">{stat.label}</p>
              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
