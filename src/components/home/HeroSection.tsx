"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// function ChartLine() {
//   return (
//     <svg
//       viewBox="0 0 960 360"
//       fill="none"
//       className="absolute inset-0 h-full w-full"
//       preserveAspectRatio="none"
//       aria-hidden
//     >
//       <motion.path
//         d="M0 280 L90 260 L160 300 L230 190 L300 230 L380 120 L460 170 L540 90 L620 140 L700 60 L780 100 L860 30 L960 70"
//         stroke="var(--color-primary)"
//         strokeWidth={2}
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         fill="none"
//         initial={{ pathLength: 0, opacity: 0 }}
//         animate={{ pathLength: 1, opacity: 1 }}
//         transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
//       />
//       <motion.path
//         d="M0 280 L90 260 L160 300 L230 190 L300 230 L380 120 L460 170 L540 90 L620 140 L700 60 L780 100 L860 30 L960 70 L960 360 L0 360 Z"
//         fill="url(#hero-chart-fill)"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1.4, delay: 1.2 }}
//       />
//       <defs>
//         <linearGradient id="hero-chart-fill" x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.16" />
//           <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
//         </linearGradient>
//       </defs>
//     </svg>
//   );
// }

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-5">
      <Image
        src="/banniere 1-1.png"
        alt=""
        aria-hidden
        fill
        priority
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-[#0E0E0E]/30" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Elevez votre trading au rang <span className="text-primary">d’expert</span> grâce à nos <span className="text-primary">algorithme</span> propulsés par l’IA.
          </h1>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg" render={
              <Link href="/auto-trading">
                Voir l&apos;auto-trading <ArrowRight className="ml-1 size-4" />
              </Link>
            } />
            <Button size="lg" variant="outline" render={<Link href="/formations">Découvrir les formations</Link>} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative mx-auto w-full max-w-md border border-white/10 bg-[#0E0E0E]/60 p-10 backdrop-blur-sm"
        >
          <span
            aria-hidden
            className="absolute -top-1 -left-1 h-10 w-10 border-t-2 border-l-2 border-primary"
          />
          <span
            aria-hidden
            className="absolute -bottom-1 -right-1 h-10 w-10 border-r-2 border-b-2 border-primary"
          />

          <Image
            src="/ROBO2-minim.png"
            alt="Signaux d'achat et de vente sur un graphique en chandeliers"
            width={2000}
            height={2000}
            priority
            className="mx-auto h-auto w-full"
          />

          {/* <p className="mt-6 text-right text-xs font-medium tracking-[0.3em] text-white/50 uppercase">
            Signal <span className="text-primary">/</span> Strategy{" "}
            <span className="text-primary">/</span> Support
          </p> */}
        </motion.div>
      </div>
    </section>
  );
}
