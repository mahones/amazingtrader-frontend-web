import glossaryData from "@/data/glossary.json";

export interface GlossaryTerm {
  slug: string;
  term: string;
  category: string;
  shortDefinition: string;
  definition: string;
  example: string;
}

export interface GlossaryCategory {
  slug: string;
  label: string;
  shortLabel: string;
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  { slug: "forex", label: "Forex & marché des changes", shortLabel: "Forex" },
  { slug: "analyse-technique", label: "Analyse technique", shortLabel: "Analyse technique" },
  { slug: "analyse-fondamentale", label: "Analyse fondamentale & macro", shortLabel: "Fondamental & macro" },
  { slug: "instruments", label: "Instruments & produits", shortLabel: "Instruments" },
  { slug: "structures-de-marche", label: "Structures de marché", shortLabel: "Structures de marché" },
  { slug: "ordres-execution", label: "Ordres & exécution", shortLabel: "Ordres & exécution" },
  { slug: "gestion-du-risque", label: "Gestion du risque", shortLabel: "Gestion du risque" },
  { slug: "strategies", label: "Stratégies & styles de trading", shortLabel: "Stratégies" },
  { slug: "trading-algo", label: "Trading algorithmique & bots", shortLabel: "Trading algo & bots" },
  { slug: "psychologie", label: "Psychologie du trading", shortLabel: "Psychologie" },
  { slug: "performance", label: "Performance & métriques", shortLabel: "Performance" },
  { slug: "crypto", label: "Crypto & blockchain", shortLabel: "Crypto" },
];

const TERMS = glossaryData as GlossaryTerm[];

export function getAllGlossaryTerms(): GlossaryTerm[] {
  return TERMS;
}

export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
  return TERMS.find((t) => t.slug === slug);
}

export function getGlossaryCategory(slug: string): GlossaryCategory | undefined {
  return GLOSSARY_CATEGORIES.find((c) => c.slug === slug);
}

export function getGlossaryCategoryLabel(slug: string): string {
  return getGlossaryCategory(slug)?.label ?? slug;
}

export function getRelatedGlossaryTerms(term: GlossaryTerm, limit = 8): GlossaryTerm[] {
  return TERMS.filter((t) => t.category === term.category && t.slug !== term.slug).slice(0, limit);
}

export function normalizeGlossaryText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}
