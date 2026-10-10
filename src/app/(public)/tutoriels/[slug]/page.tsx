import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { YoutubePlayer } from "@/components/tutorials/YoutubePlayer";
import { getTutorial } from "@/lib/api/server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tutorial = await getTutorial(slug).catch(() => null);

  return {
    title: tutorial?.title ?? "Tutoriel",
    description: tutorial?.description ?? "Tutoriel vidéo Amazing Traders.",
    robots: { index: false, follow: false },
  };
}

export default async function TutorialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tutorial = await getTutorial(slug).catch(() => null);

  if (!tutorial) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/tutoriels"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Tous les tutoriels
      </Link>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{tutorial.title}</h1>
      <div className="mt-6">
        <YoutubePlayer url={tutorial.youtube_url} title={tutorial.title} />
      </div>
      {tutorial.description && (
        <p className="mt-6 whitespace-pre-line leading-relaxed text-foreground/90">{tutorial.description}</p>
      )}
    </div>
  );
}
