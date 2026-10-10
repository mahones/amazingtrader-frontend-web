"use client";

import { TutorialForm } from "@/components/forms/TutorialForm";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function NewTutorialPage() {
  useRequireRole(["admin", "developer"]);

  return <TutorialForm />;
}
