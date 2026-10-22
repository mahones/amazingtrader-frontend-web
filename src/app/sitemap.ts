import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getCourses, getPosts, getTradingBots, getTutorials } from "@/lib/api/server";
import { getAllGlossaryTerms } from "@/lib/glossary";

export const revalidate = 3600;

const STATIC_PATHS = [
  "",
  "/formations",
  "/auto-trading",
  "/bot-trading",
  "/challenge-eureka",
  "/articles",
  "/tutoriels",
  "/lexique",
  "/brokers",
  "/faq",
  "/termes-et-conditions",
  "/politique-de-confidentialite",
  "/divulgation-des-risques",
  "/contrat-du-trading-automatique",
  "/contrat-dutilisation",
];

async function safe<T>(promise: Promise<T[]>): Promise<T[]> {
  try {
    return await promise;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, bots, posts, tutorials] = await Promise.all([
    safe(getCourses()),
    safe(getTradingBots()),
    safe(getPosts()),
    safe(getTutorials()),
  ]);

  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    priority,
  });

  return [
    ...STATIC_PATHS.map((p) => entry(p, p === "" ? 1 : 0.7)),
    ...courses.map((c) => entry(`/formations/${c.slug}`, 0.8)),
    ...bots.map((b) => entry(`/bot-trading/${b.slug}`, 0.8)),
    ...posts.map((p) => entry(`/articles/${p.slug}`, 0.6)),
    ...tutorials.map((t) => entry(`/tutoriels/${t.slug}`, 0.5)),
    ...getAllGlossaryTerms().map((t) => entry(`/lexique/${t.slug}`, 0.4)),
  ];
}
