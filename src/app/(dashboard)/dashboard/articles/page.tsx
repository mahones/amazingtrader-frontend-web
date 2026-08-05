"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRequireRole } from "@/hooks/useRequireRole";
import { fetchAdminPosts } from "@/lib/api/admin";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types/post";

export default function DashboardArticlesPage() {
  useRequireRole(["admin", "developer"]);
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    fetchAdminPosts().then(setPosts);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Articles</h1>
          <p className="text-muted-foreground">Gérez les articles publiés sur le blog.</p>
        </div>
        <Button render={<Link href="/dashboard/articles/new"><Plus className="mr-1 size-4" /> Nouvel article</Link>} />
      </div>

      <div className="grid gap-4">
        {posts === null && <p className="text-muted-foreground">Chargement...</p>}
        {posts?.length === 0 && <p className="text-muted-foreground">Aucun article créé.</p>}
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{post.title}</h3>
                  <Badge variant={post.is_published ? "default" : "secondary"}>
                    {post.is_published ? "Publié" : "Brouillon"}
                  </Badge>
                  {post.category && <Badge variant="secondary">{post.category}</Badge>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {post.author?.name ?? "Auteur inconnu"} · {formatDate(post.published_at)}
                </p>
              </div>
              <Button variant="outline" render={<Link href={`/dashboard/articles/${post.id}`}>Gérer</Link>} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
