import { ExternalLink } from "lucide-react";
import { getBrokers } from "@/lib/api/server";

export async function BrokersSection() {
  const brokers = await getBrokers().catch(() => []);

  if (brokers.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="text-sm font-semibold">Nos partenaires de confiance</span>
        <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">
          Courtiers partenaires
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-pretty">
          Ouvrez votre compte chez l&apos;un de nos courtiers partenaires pour
          connecter votre bot en toute simplicité.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brokers.map((broker) => (
          <a
            key={broker.id}
            href={broker.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-[#FDF3E7] p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-[#303030]/25 dark:bg-[#303030]/20 dark:shadow-black/20 dark:backdrop-blur-md dark:hover:bg-[#0e0e0e]/30"
          >
            {broker.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time
              <img
                src={broker.logo_url}
                alt={broker.name}
                className="h-10 w-auto max-w-[160px] object-contain"
              />
            ) : (
              <span className="text-lg font-bold text-slate-800 dark:text-white">
                {broker.name}
              </span>
            )}
            {broker.description && (
              <p className="text-sm text-slate-500 dark:text-white/70">{broker.description}</p>
            )}
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:underline">
              Créer un compte
              <ExternalLink className="size-3.5" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
