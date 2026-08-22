"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const TESTIMONIAL_IMAGES = Array.from(
  { length: 26 },
  (_, i) => `/testimonies/testimony-${String(i + 1).padStart(2, "0")}.jpg`,
);

const SCROLL_SPEED_PX_PER_FRAME = 0.6;

export function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const loop = [...TESTIMONIAL_IMAGES, ...TESTIMONIAL_IMAGES];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame: number;

    function step() {
      if (track && !pausedRef.current) {
        track.scrollLeft += SCROLL_SPEED_PX_PER_FRAME;
        const half = track.scrollWidth / 2;
        if (track.scrollLeft >= half) {
          track.scrollLeft -= half;
        }
      }
      frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="text-sm font-semibold">Ils nous font confiance</span>
        <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">
          Témoignages
        </h2>
      </div>

      <div
        ref={trackRef}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
        onTouchStart={() => {
          pausedRef.current = true;
        }}
        onTouchEnd={() => {
          pausedRef.current = false;
        }}
        className="mt-12 flex gap-6 overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [&::-webkit-scrollbar]:hidden"
      >
        {loop.map((src, index) => (
          <div key={index} className="w-72 shrink-0">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-muted">
              <Image
                src={src}
                alt="Témoignage client"
                fill
                sizes="288px"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
