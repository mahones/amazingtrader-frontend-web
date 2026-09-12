"use client";

import { useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { Faq } from "@/types/faq";

const UNCATEGORIZED_LABEL = "Général";
const ALL_LABEL = "Toutes";

function groupByCategory(faqs: Faq[]): Map<string, Faq[]> {
  const groups = new Map<string, Faq[]>();
  for (const faq of faqs) {
    const key = faq.category?.trim() || UNCATEGORIZED_LABEL;
    const existing = groups.get(key) ?? [];
    existing.push(faq);
    groups.set(key, existing);
  }
  return groups;
}

export function FaqCategoryFilter({ faqs }: { faqs: Faq[] }) {
  const groups = useMemo(() => groupByCategory(faqs), [faqs]);
  const categories = useMemo(() => Array.from(groups.keys()), [groups]);
  const [selected, setSelected] = useState<string | null>(null);

  const visibleGroups = selected ? new Map([[selected, groups.get(selected) ?? []]]) : groups;

  return (
    <>
      {categories.length > 1 && (
        <nav
          aria-label="Catégories"
          className="mt-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              selected === null
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-muted/40 hover:border-primary hover:text-primary"
            )}
          >
            {ALL_LABEL}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelected(category)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                selected === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-muted/40 hover:border-primary hover:text-primary"
              )}
            >
              {category}
            </button>
          ))}
        </nav>
      )}

      {visibleGroups.size > 0 ? (
        <div className="mt-12 space-y-10">
          {Array.from(visibleGroups.entries()).map(([category, categoryFaqs]) => (
            <div key={category}>
              <h2 className="text-xl font-bold">{category}</h2>
              <Accordion className="mt-4">
                {categoryFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-muted-foreground">Aucune question pour le moment.</p>
      )}
    </>
  );
}
