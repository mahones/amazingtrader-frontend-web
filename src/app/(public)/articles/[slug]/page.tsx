import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { Badge } from "@/components/ui/badge";
import { ArticleSidebar } from "@/components/articles/ArticleSidebar";
import { formatDate } from "@/lib/utils";
import { getPost } from "@/lib/api/server";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {post.category && <Badge variant="secondary">{post.category}</Badge>}
            <span>
              {formatDate(post.published_at)}
              {post.author?.name && <> · Par {post.author.name}</>}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{post.title}</h1>
          <div
            className="mt-8 max-w-none space-y-4 leading-relaxed text-foreground/90 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_p]:leading-relaxed [&_img]:rounded-lg"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </article>

        <ArticleSidebar currentSlug={post.slug} />
      </div>
    </div>
  );
}
