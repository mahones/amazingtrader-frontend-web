"use client";

import { motion } from "framer-motion";

const STEPS: {
  number: string;
  title: string;
  description: string;
  linkLabel?: string;
  linkHref?: string;
}[] = [
  {
    number: "1",
    title: "Créez et déposez des fonds sur votre compte",
    description: "Pour de meilleurs résultats, veuillez utiliser notre",
    linkLabel: "broker recommandé",
    linkHref:
      "https://portal.fpmarkets.com/register?fpm-affiliate-utm-source=IB&fpm-affiliate-agt=65925",
  },
  {
    number: "2",
    title: "Fournissez les détails de votre compte",
    description:
      "Fournissez-nous les informations de connexion à votre compte MT4/MT5.",
  },
  {
    number: "3",
    title: "Laissez nos experts cuisiner",
    description:
      "Asseyez-vous et détendez-vous pendant que nos traders assument l'entière responsabilité de votre compte.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-1 pb-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-center  text-2xl sm:text-2xl font-extrabold text-[#0E0E0E]-900 mb-10">
          Comment <span className="text-amber-500"> ça marche ?</span>
        </h1>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col items-center rounded-2xl border border-slate-100 bg-[#FDF3E7] p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-[#303030]/25 dark:bg-[#303030]/20 dark:shadow-black/20 dark:backdrop-blur-md dark:hover:bg-[#0e0e0e]/30"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-lg font-bold text-amber-500">
              {step.number}
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">
              {step.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-white/70">
              {step.description}
              {step.linkHref && (
                <>
                  {" "}
                  <a
                    href={step.linkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    {step.linkLabel}
                  </a>
                </>
              )}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
