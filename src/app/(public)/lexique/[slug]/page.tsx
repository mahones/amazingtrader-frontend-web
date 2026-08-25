import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlossarySidebar } from "@/components/glossary/GlossarySidebar";
import { getAllGlossaryTerms, getGlossaryCategoryLabel, getGlossaryTermBySlug } from "@/lib/glossary";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);

  if (!term) return {};

  return {
    title: `${term.term} : définition`,
    description: term.shortDefinition,
  };
}

export function generateStaticParams() {
  return getAllGlossaryTerms().map((term) => ({ slug: term.slug }));
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);

  if (!term) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/lexique"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Retour au lexique
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        <article className="space-y-8 lg:col-span-2">
          <div>
            <Badge variant="outline">{getGlossaryCategoryLabel(term.category)}</Badge>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{term.term}</h1>
          </div>

          <p className="text-lg leading-relaxed text-foreground/90">{term.definition}</p>

          <div className="rounded-xl border border-border bg-card/50 p-6">
            <h2 className="text-sm font-semibold tracking-wide text-primary uppercase">Exemple concret</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{term.example}</p>
          </div>
        </article>

        <GlossarySidebar currentTerm={term} />
      </div>
    </div>
  );
}
