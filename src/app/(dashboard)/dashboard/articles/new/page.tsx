"use client";

import { ArticleForm } from "@/components/forms/ArticleForm";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function NewArticlePage() {
  useRequireRole(["admin", "developer"]);

  return <ArticleForm />;
}
