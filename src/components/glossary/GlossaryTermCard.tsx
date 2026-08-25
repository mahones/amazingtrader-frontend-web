import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getGlossaryCategory, type GlossaryTerm } from "@/lib/glossary";

export function GlossaryTermCard({ term }: { term: GlossaryTerm }) {
  const category = getGlossaryCategory(term.category);

  return (
    <Link href={`/lexique/${term.slug}`} className="group block h-full">
      <Card className="h-full transition-all hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/30">
        <CardContent className="flex h-full flex-col gap-3">
          <h3 className="font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {term.term}
          </h3>
          <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">{term.shortDefinition}</p>
          {category && (
            <Badge variant="outline" className="w-fit text-[10px] tracking-wide text-muted-foreground uppercase">
              {category.shortLabel}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
