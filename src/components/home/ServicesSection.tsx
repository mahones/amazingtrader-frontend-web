import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "Formations",
    description:
      "Des formations sur mésure pour rejoindre le cercle des traders d'élite.",
    image: "/formation-trading.webp",
    href: "/formations",
  },
  {
    title: "Trading automatisé",
    description:
      "Automatisez vos transactions avec notre plateforme de trading algorithmique sur votre compte.",
    image: "/trading-automatisé.webp",
    href: "/auto-trading",
    
  },
  {
    title: "Expert Advisors",
    description:
      "Devenez rentable en travaillant avec nos intelligences artificielles, les meilleures du marché.",
    image: "/expert-advisors.webp",
    href: "/bot-trading",
  },
];

export function ServicesSection() {
  return (
    <section className="bg-neutral-900 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          <span className="text-sm font-semibold text-primary">
            Ce que nous proposons
          </span>
          <h2 className="mt-3 text-4xl font-bold text-black sm:text-5xl text-slate-300">
            Nos services
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group block"
            >
              <Card className="h-full overflow-hidden border border-[#F2F2F2]/25 bg-neutral-800/60 py-12 shadow-lg shadow-black/20 ring-0 backdrop-blur-md transition-colors hover:bg-[#0e0e0e]/30 hover:border-amber-500">
                {/* <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 90vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div> */}
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-300">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300 text-pretty">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
