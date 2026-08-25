import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlossaryExplorer } from "@/components/glossary/GlossaryExplorer";
import { GLOSSARY_CATEGORIES, getAllGlossaryTerms } from "@/lib/glossary";

export const metadata = {
  title: "Lexique du trading",
  description:
    "Le lexique trading, forex et crypto d'amazingtraders : des définitions claires et des exemples concrets pour comprendre le vocabulaire des marchés.",
};

export default function LexiquePage() {
  const terms = getAllGlossaryTerms();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="outline" className="mx-auto">
          <BookOpen className="size-3.5" />
          Lexique du trading
        </Badge>
        <h1 className="mt-4 text-3xl font-bold sm:text-5xl">
          Le lexique <span className="text-primary">trading, forex & crypto</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          {terms.length} définitions claires, rédigées par notre équipe et illustrées d&apos;exemples concrets,
          pour parler le langage des marchés en toute confiance.
        </p>
      </div>

      <div className="mt-10">
        <GlossaryExplorer terms={terms} categories={GLOSSARY_CATEGORIES} />
      </div>
    </div>
  );
}
