"use client";

import { use, useEffect, useState } from "react";
import { TutorialForm } from "@/components/forms/TutorialForm";
import { useRequireRole } from "@/hooks/useRequireRole";
import { fetchAdminTutorial } from "@/lib/api/admin";
import type { Tutorial } from "@/types/tutorial";

export default function EditTutorialPage({ params }: { params: Promise<{ id: string }> }) {
  useRequireRole(["admin", "developer"]);
  const { id } = use(params);
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);

  useEffect(() => {
    fetchAdminTutorial(Number(id)).then(setTutorial);
  }, [id]);

  if (!tutorial) return <p className="text-muted-foreground">Chargement...</p>;

  return <TutorialForm tutorial={tutorial} />;
}
