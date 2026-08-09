import Link from "next/link";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/api/server";

const CATEGORIES = ["Forex", "Crypto", "Bourse", "Analyse technique"];

export async function ArticleSidebar({ currentSlug }: { currentSlug: string }) {
  const posts = await getPosts().catch(() => []);
  const recentPosts = posts.filter((p) => p.slug !== currentSlug).slice(0, 5);

  return (
    <aside className="sticky top-20 self-start space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Articles récents</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/articles/${post.slug}`}
                  className="text-sm font-medium leading-snug hover:text-primary"
                >
                  {post.title}
                </Link>
              </li>
            ))}
            {recentPosts.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun autre article pour le moment.</p>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Catégories</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={`/articles?category=${encodeURIComponent(category)}`}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium hover:bg-primary hover:text-primary-foreground"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-primary/60 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Envie d&apos;aller plus loin ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Passez de la théorie à la pratique avec nos formations et nos licences d&apos;auto-trading.
          </p>
          <Button size="sm" className="w-full" render={
            <Link href="/formations"><GraduationCap className="mr-1 size-4" /> Voir les formations</Link>
          } />
          <Button size="sm" variant="outline" className="w-full" render={
            <Link href="/auto-trading"><ShieldCheck className="mr-1 size-4" /> Voir l&apos;auto-trading</Link>
          } />
        </CardContent>
      </Card>
    </aside>
  );
}
