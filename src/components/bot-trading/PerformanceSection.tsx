"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const MYFXBOOK_URL = "https://www.myfxbook.com/members/AMAZINGTRADERS";
const MQL5_URL =
  "https://www.mql5.com/en/signals/author/amazingtraders3-0-gmail";

export function PerformanceSection() {
  return (
    <section className="bg-neutral-900 py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl font-bold text-slate-300 sm:text-5xl">
            Nos performances
          </h2>

          <p className="mt-4 text-lg font-semibold text-primary">
            Résultats vérifiables en temps réel
          </p>

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#F2F2F2]/25 bg-neutral-800/60 p-5 backdrop-blur-md">
            <ShieldCheck className="mt-1 size-6 shrink-0 text-primary" />
            <div>
              <h3 className="font-bold text-slate-200">
                Transparence totale
              </h3>
              <p className="mt-1 text-sm text-slate-400 text-pretty">
                Chaque bot est suivi publiquement sur des comptes de trading
                réels, sans filtre. Consultez l&apos;historique complet de nos
                transactions et faites-vous votre propre avis avant de vous
                engager.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={MYFXBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-primary hover:text-primary"
            >
              Vérifier nos performances sur Myfxbook
            </a>
            <a
              href={MQL5_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-primary hover:text-primary"
            >
              Vérifier nos performances sur MQL5
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
        >
          <Image
            src="/financial-data.webp"
            alt="Suivi des performances de trading en temps réel"
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
