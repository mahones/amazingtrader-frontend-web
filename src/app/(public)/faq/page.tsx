import { FaqCategoryFilter } from "@/components/faq/FaqCategoryFilter";
import { getFaqs } from "@/lib/api/server";

export default async function FaqPage() {
  const faqs = await getFaqs().catch(() => []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Foire <span className="text-primary">aux questions</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Retrouvez les réponses aux questions les plus fréquentes sur nos formations, l&apos;auto-trading et nos
          bots.
        </p>
      </div>

      <FaqCategoryFilter faqs={faqs} />
    </div>
  );
}
