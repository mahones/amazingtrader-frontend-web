"use client";

import { useRouter } from "next/navigation";
import { EurekaChallengeForm } from "@/components/forms/EurekaChallengeForm";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function NewEurekaChallengePage() {
  useRequireRole(["admin", "developer"]);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Nouveau challenge Eureka</h1>
      <EurekaChallengeForm onSaved={(challenge) => router.push(`/dashboard/eureka-challenges/${challenge.id}/edit`)} />
    </div>
  );
}
