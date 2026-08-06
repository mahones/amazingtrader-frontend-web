"use client";

import { useEffect, useRef } from "react";
import { ImageIcon, PlayCircle } from "lucide-react";

interface TestimonialItem {
  type: "image" | "video";
  caption: string;
}

const testimonials: TestimonialItem[] = [
  { type: "image", caption: "Témoignage client" },
  { type: "video", caption: "Témoignage vidéo" },
  { type: "image", caption: "Témoignage client" },
  { type: "video", caption: "Témoignage vidéo" },
  { type: "image", caption: "Témoignage client" },
  { type: "video", caption: "Témoignage vidéo" },
];

const SCROLL_SPEED_PX_PER_FRAME = 0.6;

export function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const loop = [...testimonials, ...testimonials];

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
        className="mt-12 flex gap-6 overflow-x-auto scroll-smooth [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [&::-webkit-scrollbar]:hidden"
      >
        {loop.map((item, index) => (
          <div key={index} className="w-72 shrink-0">
            <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
              {item.type === "video" ? (
                <PlayCircle className="size-14 text-muted-foreground" />
              ) : (
                <ImageIcon className="size-14 text-muted-foreground" />
              )}
            </div>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              {item.caption}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
