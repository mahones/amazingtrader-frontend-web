import Link from "next/link";
import { BotPerformanceCard } from "@/components/cards/BotPerformanceCard";
// import { Card, CardContent } from "@/components/ui/card";
import { getTradingBots } from "@/lib/api/server";
import { BotTradingHero } from "@/components/bot-trading/BotTradingHero";
import { PerformanceSection } from "@/components/bot-trading/PerformanceSection";
// import { BrokersSection } from "@/components/bot-trading/BrokersSection";
// import { FaqSection } from "@/components/bot-trading/FaqSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
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
          <h1 className="text-3xl font-bold sm:text-4xl">Bots de trading</h1>
          <p className="mt-3 text-muted-foreground">
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

        {/* <Card className="mt-16">
          <CardContent className="grid gap-8 pt-6 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold">Comment ça marche ?</h2>
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>1. Souscrivez à une licence d&apos;auto-trading adaptée à votre capital.</li>
                <li>2. Connectez l&apos;API de votre broker depuis votre tableau de bord.</li>
                <li>3. Le bot exécute automatiquement les stratégies sur votre compte.</li>
                <li>4. Suivez les performances en temps réel depuis votre espace membre.</li>
              </ol>
            </div>
            <div>
              <h2 className="text-xl font-bold">Guide d&apos;intégration broker</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Une fois votre licence activée, rendez-vous dans{" "}
                <span className="font-medium text-foreground">Mes Licences</span> pour renseigner
                les clés API de votre broker. Le bot se connecte alors automatiquement pour
                exécuter les ordres selon la stratégie choisie.
              </p>
            </div>
          </CardContent>
        </Card> */}
      </div>

      <PerformanceSection />

      <TestimonialsSection />

      <ContactCtaSection
        title="Prêt à démarrer l'aventure avec nos bots de trading ?"
        subtitle="Contactez-nous dès maintenant pour choisir le bot adapté à votre stratégie."
        whatsappUrl="https://wa.me/22879920432?text=je%20souhaite%20b%C3%A9n%C3%A9ficier%20des%20bots%20de%20trading."
      />
    </>
  );
}
