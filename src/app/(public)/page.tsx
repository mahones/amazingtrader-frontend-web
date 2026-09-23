import { AnnouncementsBanner } from "@/components/announcements/AnnouncementsBanner";
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

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <AnnouncementsBanner />
      </div>

      <OfferingsList />

      <FounderSection />

      <ServicesSection />

      <TestimonialsSection />

      <FaqHomeSection faqs={featuredFaqs} />

    </>
  );
}
