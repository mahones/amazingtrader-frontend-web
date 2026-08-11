import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import type { Post } from "@/types/post";

export function ArticleCard({ post }: { post: Post }) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/10",
        post.cover_image_url && "pt-0"
      )}
    >
      {post.cover_image_url && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time */}
          <img src={post.cover_image_url} alt={post.title} className="size-full object-cover" />
        </div>
      )}
      <CardHeader>
        <span className="text-xs text-muted-foreground">{formatDate(post.published_at)}</span>
        <CardTitle className="mt-1 text-lg">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button size="sm" render={<Link href={`/articles/${post.slug}`}>Lire l&apos;article</Link>} />
      </CardFooter>
    </Card>
  );
}
