import { CourseCard } from "@/components/cards/CourseCard";
import { VipFormationPurchaseGrid } from "@/components/purchase/VipFormationPurchaseGrid";
import { FormationsHero } from "@/components/formations/FormationsHero";
import { LexiqueBanner } from "@/components/formations/LexiqueBanner";
import { WhyChooseFormationsSection } from "@/components/formations/WhyChooseFormationsSection";
import { getCourses, getVipFormations } from "@/lib/api/server";

export default async function FormationsPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; category?: string }>;
}) {
  const { level, category } = await searchParams;
  const [courses, vipFormations] = await Promise.all([
    getCourses({ level, category }).catch(() => []),
    getVipFormations().catch(() => []),
  ]);

  return (
    <>
      <FormationsHero />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <LexiqueBanner />

        {vipFormations.length > 0 && (
          <div className="mt-8">
            <VipFormationPurchaseGrid formations={vipFormations} />
          </div>
        )}

        {courses.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-muted-foreground">
            
          </p>
        )}

        <WhyChooseFormationsSection />
      </div>
    </>
  );
}
