import Link from "next/link";
import { BotPerformanceCard } from "@/components/cards/BotPerformanceCard";
// import { Card, CardContent } from "@/components/ui/card";
import { getTradingBots } from "@/lib/api/server";
import { BotTradingHero } from "@/components/bot-trading/BotTradingHero";
import { PerformanceSection } from "@/components/bot-trading/PerformanceSection";
// import { BrokersSection } from "@/components/bot-trading/BrokersSection";
// import { FaqSection } from "@/components/bot-trading/FaqSection";
import { PhotoTestimonialsSection } from "@/components/home/PhotoTestimonialsSection";
import { ContactCtaSection } from "@/components/auto-trading/ContactCtaSection";

export default async function BotTradingPage() {
  const bots = await getTradingBots().catch(() => []);

  return (
    <>
      <BotTradingHero />

      <div
        id="bots"
        className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
             <span className="text-primary">Bots</span>  de trading
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Les Experts Advisors de Amazing Traders, sont des algorithmes
            complexes de trading, basé sur des stratégies de combinaisons
            d&apos;IA, de breakout, de dépassement de range et d&apos;une
            couverture de grille afin de vous éviter le stress, la gestion des
            émotions sur le marché.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <Link
              key={bot.id}
              href={`/bot-trading/${bot.slug}`}
              className="block"
            >
              <BotPerformanceCard bot={bot} />
            </Link>
          ))}
        </div>

      </div>

      <PerformanceSection />

      <PhotoTestimonialsSection />

      <ContactCtaSection
        title="Prêt à démarrer l'aventure avec nos bots de trading ?"
        subtitle="Contactez-nous dès maintenant pour choisir le bot adapté à votre stratégie."
        whatsappUrl="https://wa.me/22879920432?text=je%20souhaite%20b%C3%A9n%C3%A9ficier%20des%20bots%20de%20trading."
      />
    </>
  );
}
