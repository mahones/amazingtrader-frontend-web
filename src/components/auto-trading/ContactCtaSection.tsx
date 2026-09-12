"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_WHATSAPP_URL =
  "https://wa.me/22879920432?text=je%20souhaite%20b%C3%A9n%C3%A9ficier%20du%20service%20auto%20trading.";

export function ContactCtaSection({
  title = "Prêt à confier vos comptes à notre équipe d'experts ?",
  subtitle,
  buttonLabel = "Contactez-nous",
  whatsappUrl = DEFAULT_WHATSAPP_URL,
}: {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  whatsappUrl?: string;
}) {
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

        <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <MessageCircle className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-balance text-white sm:text-3xl">{title}</h2>
              {subtitle && <p className="mt-2 text-pretty text-white/60">{subtitle}</p>}
            </div>
          </div>

          <Button
            size="lg"
            className="w-full shrink-0 lg:w-auto"
            render={
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                {buttonLabel}
              </a>
            }
          />
        </div>
      </motion.div>
    </section>
  );
}
