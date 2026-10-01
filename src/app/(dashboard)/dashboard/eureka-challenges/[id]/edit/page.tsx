"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EurekaChallengeForm } from "@/components/forms/EurekaChallengeForm";
import { EurekaChallengeRequirementsManager } from "@/components/forms/EurekaChallengeRequirementsManager";
import { EurekaChallengeInstructionsManager } from "@/components/forms/EurekaChallengeInstructionsManager";
import { EurekaChallengePerformanceLinksManager } from "@/components/forms/EurekaChallengePerformanceLinksManager";
import { EurekaChallengeLicensePlansManager } from "@/components/forms/EurekaChallengeLicensePlansManager";
import { EurekaChallengeFilesManager } from "@/components/admin/EurekaChallengeFilesManager";
import { useRequireRole } from "@/hooks/useRequireRole";
import { deleteAdminEurekaChallenge, fetchAdminEurekaChallenge, fetchAdminEurekaChallengeFiles } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import type { EurekaChallenge, EurekaChallengeFile } from "@/types/eurekaChallenge";

export default function EditEurekaChallengePage({ params }: { params: Promise<{ id: string }> }) {
  useRequireRole(["admin", "developer"]);
  const { id } = use(params);
  const router = useRouter();
  const [challenge, setChallenge] = useState<EurekaChallenge | null>(null);
  const [files, setFiles] = useState<EurekaChallengeFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminEurekaChallenge(Number(id)).then(setChallenge);
    fetchAdminEurekaChallengeFiles(Number(id)).then(setFiles);
  }, [id]);

  async function handleDelete() {
    if (!challenge) return;
    if (!window.confirm("Supprimer définitivement ce challenge ?")) return;
    setError(null);
    try {
      await deleteAdminEurekaChallenge(challenge.id);
      router.push("/dashboard/eureka-challenges");
    } catch (err) {
      setError(extractApiError(err, "Impossible de supprimer ce challenge."));
    }
  }

  if (!challenge) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Modifier {challenge.name}</h1>
          <Link href={`/challenge-eureka/${challenge.slug}`} className="text-sm text-primary hover:underline">
            Voir la page publique →
          </Link>
        </div>
        <Tooltip>
          <TooltipTrigger render={<span tabIndex={challenge.has_active_subscribers ? 0 : undefined} />}>
            <Button
              type="button"
              variant="destructive"
              disabled={challenge.has_active_subscribers}
              onClick={handleDelete}
            >
              Supprimer
            </Button>
          </TooltipTrigger>
          {challenge.has_active_subscribers && (
            <TooltipContent>
              Ce produit ne peut pas être supprimé car des utilisateurs y sont inscrits.
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <EurekaChallengeRequirementsManager
        challengeId={challenge.id}
        requirements={challenge.requirements ?? []}
        onChange={(requirements) => setChallenge({ ...challenge, requirements })}
      />

      <EurekaChallengeInstructionsManager
        challengeId={challenge.id}
        instructions={challenge.instructions ?? []}
        onChange={(instructions) => setChallenge({ ...challenge, instructions })}
      />

      <EurekaChallengePerformanceLinksManager
        challengeId={challenge.id}
        links={challenge.performance_links ?? []}
        onChange={(performance_links) => setChallenge({ ...challenge, performance_links })}
      />

      <EurekaChallengeLicensePlansManager
        challengeId={challenge.id}
        challengeSlug={challenge.slug}
        plans={challenge.license_plans ?? []}
        onChange={(license_plans) => setChallenge({ ...challenge, license_plans })}
      />

      <EurekaChallengeFilesManager challengeId={challenge.id} files={files} onChange={setFiles} />

      <EurekaChallengeForm challenge={challenge} onSaved={setChallenge} />
    </div>
  );
}
