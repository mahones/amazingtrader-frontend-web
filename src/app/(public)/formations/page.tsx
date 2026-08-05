import { CourseCard } from "@/components/cards/CourseCard";
import { CourseFilters } from "@/components/filters/CourseFilters";
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
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Nos formations en trading</h1>
        <p className="mt-3 text-muted-foreground">
          Des parcours conçus par des traders professionnels, du niveau débutant à avancé.
        </p>
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
    </div>
  );
}
