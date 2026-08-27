import Image from "next/image";
import { CourseCard } from "@/components/cards/CourseCard";
import { CourseFilters } from "@/components/filters/CourseFilters";
import { WhyChooseFormationsSection } from "@/components/formations/WhyChooseFormationsSection";
import { getCourses } from "@/lib/api/server";

export default async function FormationsPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; category?: string }>;
}) {
  const { level, category } = await searchParams;
  const courses = await getCourses({ level, category }).catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl text-center lg:text-left">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Nos <span className="text-primary">formations</span> en trading
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Deviens un trader rentable et régulier sur le marché boursier en
            utilisant des strategies pratiques testées
          </p>
        </div>

        <div className="relative aspect-square w-full max-w-64 shrink-0 overflow-hidden">
          <Image
            src="/AMEZING-TRADERS-formation.png"
            alt="Formation en trading amazingtraders"
            fill
            className="object-contain"
            sizes="256px"
          />
        </div>
      </div>

      <div className="mt-8">
        <CourseFilters />
      </div>

      {courses.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-muted-foreground">
          Aucune formation ne correspond à ces filtres.
        </p>
      )}

      <WhyChooseFormationsSection />
    </div>
  );
}
