import { buildMetadata } from "@/lib/seo";
import { LicensePurchaseGrid } from "@/components/purchase/LicensePurchaseGrid";
import { getLicensePlans } from "@/lib/api/server";
import { AutoTradingHero } from "@/components/auto-trading/AutoTradingHero";
import { HowItWorksSection } from "@/components/auto-trading/HowItWorksSection";
import { NoProfitSharingSection } from "@/components/auto-trading/NoProfitSharingSection";
import { WhyChooseUsSection } from "@/components/auto-trading/WhyChooseUsSection";
import { ContactCtaSection } from "@/components/auto-trading/ContactCtaSection";
import { PhotoTestimonialsSection } from "@/components/home/PhotoTestimonialsSection";

export default async function AutoTradingPage() {
  const plans = await getLicensePlans().catch(() => []);

  return (
    <>
      <AutoTradingHero />

      <HowItWorksSection />

      <NoProfitSharingSection />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Licences d&apos;auto-trading</h1>
          <p className="mt-3 text-muted-foreground">
            Choisissez la formule adaptée à votre capital et laissez nos stratégies
            automatisées travailler pour vous.
          </p>
        </div>

        <div className="mt-12">
          <LicensePurchaseGrid plans={plans} />
        </div>
      </div>

      <PhotoTestimonialsSection />

      <WhyChooseUsSection />

      <ContactCtaSection />
    </>
  );
}

export const metadata = buildMetadata({
  "title": "Licences d'auto-trading",
  "description": "Choisissez la licence adaptée à votre capital et laissez nos stratégies automatisées trader pour vous sur votre compte courtier."
});
