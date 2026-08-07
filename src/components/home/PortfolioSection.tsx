"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

const PORTFOLIO_IMAGES = Array.from(
  { length: 8 },
  (_, i) => `/portfolio/${i + 1}.webp`
);

export function PortfolioSection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="">
        <span className="text-sm font-semibold">Nos réalisations</span>
        <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">
          Portfolio
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {PORTFOLIO_IMAGES.map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => setSelected(src)}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted"
          >
            <Image
              src={src}
              alt="Réalisation amazingtraders"
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogPortal>
          <DialogOverlay className="bg-black/90" />
          <DialogPrimitive.Popup className="fixed inset-0 z-50 flex items-center justify-center p-6 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            {selected && (
              <div className="relative h-full w-full max-w-5xl">
                <Image
                  src={selected}
                  alt="Réalisation amazingtraders"
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
            )}
            <DialogClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-4 right-4 text-white hover:bg-white/10 hover:text-white"
                />
              }
            >
              <XIcon />
              <span className="sr-only">Fermer</span>
            </DialogClose>
          </DialogPrimitive.Popup>
        </DialogPortal>
      </Dialog>
    </section>
  );
}
