"use client";

import Image from "next/image";
import { motion } from "framer-motion";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-0.5 w-8 rounded-full bg-primary" />
      <span className="text-sm font-semibold">{children}</span>
      <span className="h-0.5 w-8 rounded-full bg-primary" />
    </div>
  );
}

export function FounderSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid items-stretch gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center sm:text-left"
        >
          <span className="block text-center text-sm font-semibold">
            Qui sommes nous ?
          </span>
          <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl text-center">
            Amazing Traders
          </h2>

          <p className="mt-6 max-w-xl text-justify text-lg text-muted-foreground text-pretty">
            Nous sommes une start-up qui innove dans le trading algorithmique,
            offrant ainsi aux traders un système commercial simple et rentable.
          </p>
          <p className="mt-6 max-w-xl text-justify text-lg text-muted-foreground text-pretty">
            Avec un taux de réussite de 87,55&nbsp;%, nous accompagnons les
            entreprises et les particuliers dans la gestion de leur portefeuille
            et de leurs comptes.
          </p>

          <h3 className="mt-8 text-xl font-bold text-primary text-center">
            Nos résultats sont le fruit de son expertise
          </h3>
          <p className="mt-6 max-w-xl text-justify text-lg text-muted-foreground text-pretty">
            Informaticien avec plus de 7 ans d&apos;expérience sur les marchés
            financiers,{" "}
            <span className="font-semibold text-foreground">
              Rodolphe SEDJRO
            </span>{" "}
            a collecté, organisé, testé et constamment mis à jour des stratégies
            de trading pour créer des intelligences artificielles douées de
            capacité adaptative aux perpétuels changements des marchés
            financiers.
          </p>

          {/* <Button
            size="lg"
            className="mt-8 w-full bg-neutral-900 text-white hover:bg-neutral-800 sm:w-auto sm:min-w-[240px] dark:bg-white dark:text-neutral-900 dark:hover:bg-white/90"
          >
            Mon Histoire
          </Button> */}

          {/* <div className="mt-6">
            <Eyebrow>J&apos;étais comme toi</Eyebrow>
          </div> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex h-full flex-col"
        >
          <div className="relative w-full max-w-[450px] ml-auto flex-1 overflow-hidden rounded-2xl">
            <Image
              src="/profil22.webp"
              alt="Rodolphe SEDJRO, CEO d'amazingtraders"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover object-top"
              priority
            />
          </div>
          <div className="mt-4 flex w-full max-w-[450px] ml-auto flex-col items-center gap-1 text-center">
            <Eyebrow>CEO</Eyebrow>
            <p className="font-semibold text-foreground">Rodolphe SEDJRO</p>
            <p className="font-semibold text-foreground">
              Expert en trading algorithmique
            </p>
            <p className="font-semibold text-foreground">
              7 ans d&apos;expérience
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
