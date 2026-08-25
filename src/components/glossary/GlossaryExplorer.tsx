"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { GlossaryTermCard } from "@/components/glossary/GlossaryTermCard";
import { cn } from "@/lib/utils";
import { normalizeGlossaryText, type GlossaryCategory, type GlossaryTerm } from "@/lib/glossary";

export function GlossaryExplorer({
  terms,
  categories,
}: {
  terms: GlossaryTerm[];
  categories: GlossaryCategory[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const term of terms) {
      counts.set(term.category, (counts.get(term.category) ?? 0) + 1);
    }
    return counts;
  }, [terms]);

  const filteredTerms = useMemo(() => {
    const normalizedQuery = normalizeGlossaryText(query.trim());

    return terms.filter((term) => {
      if (activeCategory && term.category !== activeCategory) return false;
      if (!normalizedQuery) return true;

      return (
        normalizeGlossaryText(term.term).includes(normalizedQuery) ||
        normalizeGlossaryText(term.shortDefinition).includes(normalizedQuery)
      );
    });
  }, [terms, activeCategory, query]);

  const groupedByLetter = useMemo(() => {
    const groups = new Map<string, GlossaryTerm[]>();
    for (const term of filteredTerms) {
      const letter = normalizeGlossaryText(term.term).charAt(0).toUpperCase();
      const group = groups.get(letter);
      if (group) {
        group.push(term);
      } else {
        groups.set(letter, [term]);
      }
    }
    for (const group of groups.values()) {
      group.sort((a, b) => a.term.localeCompare(b.term, "fr"));
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b, "fr"));
  }, [filteredTerms]);

  return (
    <div>
      <div className="relative mx-auto max-w-2xl">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un terme (spread, drawdown, RSI...)"
          className="w-full rounded-xl border border-border bg-card/70 py-3 pr-4 pl-11 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary/50"
        />
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            activeCategory === null
              ? "border-primary/50 bg-primary/10 text-foreground"
              : "border-border bg-card/60 text-muted-foreground hover:border-primary/30 hover:text-foreground",
          )}
        >
          Tout <span className="text-muted-foreground/70">{terms.length}</span>
        </button>
        {categories.map((category) => {
          const count = categoryCounts.get(category.slug) ?? 0;
          if (count === 0) return null;

          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => setActiveCategory((current) => (current === category.slug ? null : category.slug))}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                activeCategory === category.slug
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-border bg-card/60 text-muted-foreground hover:border-primary/30 hover:text-foreground",
              )}
            >
              {category.label} <span className="text-muted-foreground/70">{count}</span>
            </button>
          );
        })}
      </div>

      {groupedByLetter.length > 0 && (
        <nav className="mt-6 flex flex-wrap gap-1 border-y border-border/60 py-3">
          {groupedByLetter.map(([letter]) => (
            <a
              key={letter}
              href={`#lettre-${letter}`}
              className="inline-flex size-7 items-center justify-center rounded-md text-xs font-semibold text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {letter}
            </a>
          ))}
        </nav>
      )}

      {groupedByLetter.length > 0 ? (
        <div className="mt-8 space-y-10">
          {groupedByLetter.map(([letter, group]) => (
            <div key={letter} id={`lettre-${letter}`} className="scroll-mt-32">
              <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-foreground">
                {letter}
                <span className="text-sm font-medium text-muted-foreground">{group.length}</span>
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.map((term) => (
                  <GlossaryTermCard key={term.slug} term={term} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-muted-foreground">
          Aucun terme ne correspond à votre recherche.
        </p>
      )}
    </div>
  );
}
