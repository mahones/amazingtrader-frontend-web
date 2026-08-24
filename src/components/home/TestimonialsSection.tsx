import Image from "next/image";

const TESTIMONIAL_VIDEOS = [
  "/testimonies/videos/testimony-video-01.mp4",
  "/testimonies/videos/testimony-video-02.mp4",
  "/testimonies/videos/testimony-video-03.mp4",
];

const TESTIMONIAL_IMAGE = "/testimonies/testimony-01.jpg";

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="text-sm font-semibold">Ils nous font confiance</span>
        <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">
          Témoignages
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {TESTIMONIAL_VIDEOS.map((src) => (
          <div key={src} className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-muted">
            <video
              src={src}
              controls
              playsInline
              preload="metadata"
              className="size-full object-cover"
            />
          </div>
        ))}

        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-muted">
          <Image
            src={TESTIMONIAL_IMAGE}
            alt="Témoignage client"
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
