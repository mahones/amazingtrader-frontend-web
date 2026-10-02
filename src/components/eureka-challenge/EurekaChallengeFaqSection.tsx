"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LinkifiedText } from "@/components/shared/LinkifiedText";
import type { Faq } from "@/types/faq";

export function EurekaChallengeFaqSection({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="group relative isolate overflow-hidden rounded-3xl bg-[#171717] px-6 py-10 shadow-lg shadow-black/20 sm:px-10 sm:py-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -bottom-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative">
          <div className="text-center">
            <span className="text-sm font-semibold tracking-wide text-primary uppercase">FAQ</span>
            <h2 className="mt-3 text-2xl font-bold text-balance text-white sm:text-3xl">
              Questions fréquentes sur le Challenge Eureka
            </h2>
            <p className="mt-2 text-pretty text-white/60">
              Tout ce qu&apos;il faut savoir avant de rejoindre le programme.
            </p>
          </div>

          <Accordion className="mt-8">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-white/10 bg-white/[0.03]">
                <AccordionTrigger className="text-white hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-white/60">
                  <LinkifiedText text={faq.answer} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </motion.div>
    </section>
  );
}
