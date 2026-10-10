import Link from "next/link";
import type { Metadata } from "next";
import { Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTutorials } from "@/lib/api/server";
import { youtubeThumbnail } from "@/lib/youtube";

// Unlisted page: reachable only through a link shared by an admin.
export const metadata: Metadata = {
  title: "Tutoriels",
  description: "Les tutoriels vidéo Amazing Traders.",
  robots: { index: false, follow: false },
};

export default async function TutorialsPage() {
  const tutorials = await getTutorials().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          <span className="text-primary">Tutoriels</span> vidéo
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">Apprenez pas à pas à utiliser la plateforme.</p>
      </div>

      {tutorials.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutorials.map((tutorial) => {
            const thumb = youtubeThumbnail(tutorial.youtube_url);
            return (
              <Link key={tutorial.id} href={`/tutoriels/${tutorial.slug}`} className="group">
                <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-lg group-hover:shadow-primary/10">
                  {thumb && (
                    <div className="px-(--card-spacing)">
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail */}
                        <img src={thumb} alt={tutorial.title} className="size-full object-cover" />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Play className="size-10 text-white drop-shadow" />
                        </span>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{tutorial.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="mt-12 text-center text-muted-foreground">Aucun tutoriel disponible pour le moment.</p>
      )}
    </div>
  );
}
