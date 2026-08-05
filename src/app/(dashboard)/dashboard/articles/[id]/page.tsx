"use client";

import { use, useEffect, useState } from "react";
import { ArticleForm } from "@/components/forms/ArticleForm";
import { useRequireRole } from "@/hooks/useRequireRole";
import { fetchAdminPost } from "@/lib/api/admin";
import type { Post } from "@/types/post";

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  useRequireRole(["admin", "developer"]);
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchAdminPost(Number(id)).then(setPost);
  }, [id]);

  if (!post) return <p className="text-muted-foreground">Chargement...</p>;

  return <ArticleForm post={post} />;
}
