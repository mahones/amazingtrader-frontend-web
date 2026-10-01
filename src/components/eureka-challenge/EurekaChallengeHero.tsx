"use client";

import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EurekaChallengeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/15%),transparent_60%)]" />

      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Trophy className="size-7" />
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Le <span className="text-primary">Challenge Eureka</span>
          </h1>
          <p className="mt-4 text-lg text-pretty text-muted-foreground">
            Réservé à nos membres connectés : relevez le challenge sur un ou plusieurs comptes et
            obtenez vos identifiants dès l&apos;activation de votre licence.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              render={
                <a href="#challenges">
                  Voir les challenges <ArrowRight className="ml-1 size-4" />
                </a>
              }
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
