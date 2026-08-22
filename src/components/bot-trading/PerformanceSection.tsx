"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MYFXBOOK_URL = "https://www.myfxbook.com/members/AMAZINGTRADERS";
const MQL5_URL =
  "https://www.mql5.com/en/signals/author/amazingtraders3-0-gmail";

const DEMO_VIDEOS = [
  { src: "/performance-1.mp4", label: "Démo de performance 1" },
  { src: "/performance-2.mp4", label: "Démo de performance 2" },
  { src: "/performance-3.mp4", label: "Démo de performance 3" },
];

export function PerformanceSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!activeVideo) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveVideo(null);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo]);

  return (
    <section className="bg-neutral-900 py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0 lg:col-span-1"
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

          <div className="mt-8 flex flex-col gap-3">
            <Button
              size="lg"
              className="h-auto w-full whitespace-normal py-3 text-center"
              render={
                <a href={MYFXBOOK_URL} target="_blank" rel="noopener noreferrer">
                  Vérifier nos performances sur Myfxbook
                </a>
              }
            />
            <Button
              size="lg"
              className="h-auto w-full whitespace-normal py-3 text-center"
              render={
                <a href={MQL5_URL} target="_blank" rel="noopener noreferrer">
                  Vérifier nos performances sur MQL5
                </a>
              }
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-2"
        >
          {DEMO_VIDEOS.map((video) => (
            <button
              key={video.src}
              type="button"
              onClick={() => setActiveVideo(video.src)}
              aria-label={`Lire la vidéo : ${video.label}`}
              className="group relative aspect-[9/16] w-full overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary sm:aspect-[2/3]"
            >
              <video
                src={video.src}
                preload="metadata"
                muted
                playsInline
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
                  <Play className="size-6 translate-x-0.5" fill="currentColor" />
                </span>
              </span>
            </button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[85vh] w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Fermer la vidéo"
                className="absolute -top-12 right-0 flex size-9 items-center justify-center rounded-full bg-white/10 text-slate-200 transition-colors hover:bg-white/20"
              >
                <X className="size-5" />
              </button>
              <video
                src={activeVideo}
                controls
                autoPlay
                playsInline
                className="max-h-[85vh] w-full rounded-2xl bg-black"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
