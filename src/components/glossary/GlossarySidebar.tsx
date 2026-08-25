import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRelatedGlossaryTerms, type GlossaryTerm } from "@/lib/glossary";

export function GlossarySidebar({ currentTerm }: { currentTerm: GlossaryTerm }) {
  const relatedTerms = getRelatedGlossaryTerms(currentTerm);

  return (
    <aside className="sticky top-20 self-start space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Autres termes de la catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {relatedTerms.map((term) => (
              <li key={term.slug}>
                <Link
                  href={`/lexique/${term.slug}`}
                  className="-mx-2 block rounded-md px-2 py-2 text-sm font-medium hover:bg-accent"
                >
                  {term.term}
                </Link>
              </li>
            ))}
            {relatedTerms.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun autre terme dans cette catégorie pour le moment.</p>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aller plus loin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Mettez ces notions en pratique avec nos formations et nos bots de trading.
          </p>
          <Link href="/formations" className="block text-sm font-medium text-primary hover:underline">
            Voir nos formations →
          </Link>
          <Link href="/bot-trading" className="block text-sm font-medium text-primary hover:underline">
            Voir nos bots de trading →
          </Link>
        </CardContent>
      </Card>
    </aside>
  );
}
