"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const FAQS: { question: string; answer: string }[] = [
  {
    question: "Comment fonctionne un bot de trading amazingtraders ?",
    answer:
      "Chaque bot exécute automatiquement une stratégie définie sur votre compte broker, une fois votre licence activée et l'API de votre broker connectée depuis votre tableau de bord. Vous n'avez rien à surveiller en continu.",
  },
  {
    question: "Ai-je besoin de connaissances en trading pour utiliser un bot ?",
    answer:
      "Non. Vous définissez simplement un niveau de risque acceptable au moment de la configuration : le bot se charge de l'analyse et de l'exécution des ordres selon sa stratégie.",
  },
  {
    question: "Quel dépôt minimum est nécessaire ?",
    answer:
      "Le dépôt minimum dépend du bot et de la licence choisie. Le détail est indiqué sur la fiche de chaque bot, dans la section des formules disponibles.",
  },
  {
    question: "Puis-je suivre les performances en temps réel ?",
    answer:
      "Oui. Les performances de nos bots sont publiées sur des comptes réels et consultables à tout moment sur Myfxbook et MQL5, en plus du suivi disponible dans votre espace membre.",
  },
  {
    question: "Que se passe-t-il si je veux arrêter le bot ?",
    answer:
      "Vous pouvez suspendre ou retirer le bot de votre compte broker à tout moment depuis votre tableau de bord, sans engagement supplémentaire.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="text-sm font-semibold">Vous avez des questions ?</span>
        <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">
          Questions fréquentes
        </h2>
      </div>

      <div className="mt-12 space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-[#FDF3E7] dark:border-[#303030]/25 dark:bg-[#303030]/20 dark:backdrop-blur-md"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-bold text-slate-800 dark:text-white">{faq.question}</span>
                <Plus
                  className={`size-5 shrink-0 text-primary transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                />
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm text-slate-500 text-pretty dark:text-white/70">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
