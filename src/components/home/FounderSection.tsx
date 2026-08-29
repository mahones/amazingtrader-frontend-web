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
          <span className="text-sm font-semibold">
            Qui sommes nous ?
          </span>
          <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl ">
            Amazing Traders
          </h2>

          <p className="mt-6 max-w-xl text-justify text-lg text-muted-foreground text-pretty">
            Nous sommes une start-up qui innove dans le trading algorithmique,
            offrant ainsi aux traders un système commercial simple et rentable.
          </p>
          <p className="mt-6 max-w-xl text-justify text-lg text-muted-foreground text-pretty">
            Nous accompagnons également les
            entreprises et les particuliers dans la gestion de leur portefeuille
            et de leurs comptes.
          </p>

          <h3 className="mt-8 text-xl font-bold text-primary">
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex flex-col lg:h-full"
        >
          <div className="relative aspect-[4/5] w-full max-w-[450px] ml-auto overflow-hidden rounded-2xl lg:aspect-auto lg:flex-1">
            <Image
              src="/Rodolphe-SEDJRO.webp"
              alt="Rodolphe SEDJRO, CEO d'amazingtraders"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 bg-gradient-to-t from-black/85 via-black/50 to-transparent pb-3 pt-20 text-center text-white">
              <Eyebrow>Fondateur</Eyebrow>
              <p className="font-semibold">Expert en trading algorithmique</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
