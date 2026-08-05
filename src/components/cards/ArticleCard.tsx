import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types/post";

export function ArticleCard({ post }: { post: Post }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/10">
      <CardHeader>
        <span className="text-xs text-muted-foreground">{formatDate(post.published_at)}</span>
        <CardTitle className="mt-1 text-lg">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/articles/${post.slug}`} className="text-sm font-medium text-primary hover:underline">
          Lire l&apos;article →
        </Link>
      </CardFooter>
    </Card>
  );
}
