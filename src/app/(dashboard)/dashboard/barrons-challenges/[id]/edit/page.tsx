"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BarronsChallengeForm } from "@/components/forms/BarronsChallengeForm";
import { BarronsChallengeRequirementsManager } from "@/components/forms/BarronsChallengeRequirementsManager";
import { BarronsChallengeInstructionsManager } from "@/components/forms/BarronsChallengeInstructionsManager";
import { BarronsChallengePerformanceLinksManager } from "@/components/forms/BarronsChallengePerformanceLinksManager";
import { BarronsChallengeLicensePlansManager } from "@/components/forms/BarronsChallengeLicensePlansManager";
import { BarronsChallengeFilesManager } from "@/components/admin/BarronsChallengeFilesManager";
import { useRequireRole } from "@/hooks/useRequireRole";
import { deleteAdminBarronsChallenge, fetchAdminBarronsChallenge, fetchAdminBarronsChallengeFiles } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import type { BarronsChallenge, BarronsChallengeFile } from "@/types/barronsChallenge";

export default function EditBarronsChallengePage({ params }: { params: Promise<{ id: string }> }) {
  useRequireRole(["admin", "developer"]);
  const { id } = use(params);
  const router = useRouter();
  const [challenge, setChallenge] = useState<BarronsChallenge | null>(null);
  const [files, setFiles] = useState<BarronsChallengeFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminBarronsChallenge(Number(id)).then(setChallenge);
    fetchAdminBarronsChallengeFiles(Number(id)).then(setFiles);
  }, [id]);

  async function handleDelete() {
    if (!challenge) return;
    if (!window.confirm("Supprimer définitivement ce challenge ?")) return;
    setError(null);
    try {
      await deleteAdminBarronsChallenge(challenge.id);
      router.push("/dashboard/barrons-challenges");
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
          <Link href={`/challenge-barrons/${challenge.slug}`} className="text-sm text-primary hover:underline">
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

      <BarronsChallengeRequirementsManager
        challengeId={challenge.id}
        requirements={challenge.requirements ?? []}
        onChange={(requirements) => setChallenge({ ...challenge, requirements })}
      />

      <BarronsChallengeInstructionsManager
        challengeId={challenge.id}
        instructions={challenge.instructions ?? []}
        onChange={(instructions) => setChallenge({ ...challenge, instructions })}
      />

      <BarronsChallengePerformanceLinksManager
        challengeId={challenge.id}
        links={challenge.performance_links ?? []}
        onChange={(performance_links) => setChallenge({ ...challenge, performance_links })}
      />

      <BarronsChallengeLicensePlansManager
        challengeId={challenge.id}
        challengeSlug={challenge.slug}
        plans={challenge.license_plans ?? []}
        onChange={(license_plans) => setChallenge({ ...challenge, license_plans })}
      />

      <BarronsChallengeFilesManager challengeId={challenge.id} files={files} onChange={setFiles} />

      <BarronsChallengeForm challenge={challenge} onSaved={setChallenge} />
    </div>
  );
}
