import Link from "next/link";
import { CourseCard } from "@/components/cards/CourseCard";
import { BotPerformanceCard } from "@/components/cards/BotPerformanceCard";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { HeroSection } from "@/components/home/HeroSection";
import { OfferingsList } from "@/components/home/OfferingsList";
import { FounderSection } from "@/components/home/FounderSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { getCourses, getPosts, getTradingBots } from "@/lib/api/server";

export default async function HomePage() {
  const [courses, bots, posts] = await Promise.all([
    getCourses().catch(() => []),
    getTradingBots().catch(() => []),
    getPosts().catch(() => []),
  ]);

  return (
    <>
      <HeroSection />

      <OfferingsList />

      <FounderSection />

      <ServicesSection />

      {bots.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">Nos bots les plus performants</h2>
            <Link href="/bot-trading" className="text-sm font-medium text-primary hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bots.slice(0, 3).map((bot) => (
              <BotPerformanceCard key={bot.id} bot={bot} />
            ))}
          </div>
        </section>
      )}

      {courses.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">Formations populaires</h2>
            <Link href="/formations" className="text-sm font-medium text-primary hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">Dernières actualités</h2>
            <Link href="/articles" className="text-sm font-medium text-primary hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/*<section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold">Prêt à passer au niveau supérieur ?</h2>
          <p className="mt-3 text-primary-foreground/80">
            Formations et auto-trading, avec un accompagnement à chaque étape — créez votre compte pour commencer.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-6"
            render={<Link href="/register">Créer mon compte gratuitement</Link>}
          />
        </div>
      </section>*/}
    </>
  );
}
