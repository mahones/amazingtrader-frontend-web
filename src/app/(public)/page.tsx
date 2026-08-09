import { HeroSection } from "@/components/home/HeroSection";
import { OfferingsList } from "@/components/home/OfferingsList";
import { FounderSection } from "@/components/home/FounderSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

export default async function HomePage() {

  return (
    <>
      <HeroSection />

      <OfferingsList />

      <FounderSection />

      <ServicesSection />

      <TestimonialsSection />

    </>
  );
}
