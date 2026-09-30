"use client";

import { useRouter } from "next/navigation";
import { BarronsChallengeForm } from "@/components/forms/BarronsChallengeForm";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function NewBarronsChallengePage() {
  useRequireRole(["admin", "developer"]);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Nouveau challenge Barrons</h1>
      <BarronsChallengeForm onSaved={(challenge) => router.push(`/dashboard/barrons-challenges/${challenge.id}/edit`)} />
    </div>
  );
}
