import { HeroSection } from "@/components/home/HeroSection";
import { OfferingsList } from "@/components/home/OfferingsList";
import { FounderSection } from "@/components/home/FounderSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FaqHomeSection } from "@/components/home/FaqHomeSection";
import { getFaqs } from "@/lib/api/server";

export default async function HomePage() {
  const featuredFaqs = await getFaqs({ featured: true }).catch(() => []);

  return (
    <>
      <HeroSection />

      <OfferingsList />

      <FounderSection />

      <ServicesSection />

      <TestimonialsSection />

      <FaqHomeSection faqs={featuredFaqs} />

    </>
  );
}
