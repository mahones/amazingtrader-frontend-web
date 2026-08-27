import { ArticleCard } from "@/components/cards/ArticleCard";
import { PostFilters } from "@/components/filters/PostFilters";
import { getPosts } from "@/lib/api/server";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = await getPosts({ category }).catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold sm:text-5xl"><span className="text-primary">Articles</span>   &amp; actualités</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Analyses de marché, guides pratiques et actualités de la plateforme.
        </p>
      </div>

      <div className="mt-8">
        <PostFilters />
      </div>

      {posts.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-muted-foreground">Aucun article ne correspond à ces filtres.</p>
      )}
    </div>
  );
}
