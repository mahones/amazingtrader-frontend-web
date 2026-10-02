"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LicenseExpiryGauge } from "@/components/licenses/LicenseExpiryGauge";
import { EditEurekaChallengePurchaseDetailsDialog } from "@/components/licenses/EditEurekaChallengePurchaseDetailsDialog";
import { CatalogCard, CatalogCardGrid } from "@/components/dashboard/CatalogListCard";
import { useAuth } from "@/context/AuthContext";
import { downloadEurekaChallengeFile, fetchMyEurekaChallengeLicenses } from "@/lib/api/eurekaChallenges";
import { deleteAdminEurekaChallenge, fetchAdminEurekaChallenges } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { EurekaChallenge, EurekaChallengeFile, UserEurekaChallengeLicense } from "@/types/eurekaChallenge";

export default function DashboardEurekaChallengesPage() {
  const { isStaff } = useAuth();
  const [licenses, setLicenses] = useState<UserEurekaChallengeLicense[] | null>(null);
  const [challenges, setChallenges] = useState<EurekaChallenge[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reloadChallenges() {
    const refreshed = await fetchAdminEurekaChallenges();
    setChallenges(refreshed);
  }

  useEffect(() => {
    let isActive = true;

    async function loadData() {
      try {
        if (isStaff) {
          const refreshed = await fetchAdminEurekaChallenges();
          if (isActive) setChallenges(refreshed);
          return;
        }

        const userLicenses = await fetchMyEurekaChallengeLicenses();
        if (isActive) setLicenses(userLicenses);
      } catch (error) {
        console.error("Erreur lors du chargement des challenges Eureka", error);
      }
    }

    void loadData();

    return () => {
      isActive = false;
    };
  }, [isStaff]);

  async function handleDeleteChallenge(id: number) {
    if (!window.confirm("Supprimer définitivement ce challenge ?")) return;
    setError(null);
    try {
      await deleteAdminEurekaChallenge(id);
      await reloadChallenges();
    } catch (err) {
      setError(extractApiError(err, "Impossible de supprimer ce challenge."));
    }
  }

  if (isStaff) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Challenges Eureka</h1>
            <p className="text-muted-foreground">
              Gérez les challenges proposés et leurs plans de licence.
            </p>
          </div>
          <Button
            render={
              <Link href="/dashboard/eureka-challenges/new">
                <Plus className="mr-1 size-4" /> Nouveau challenge
              </Link>
            }
          />
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {challenges === null && <p className="text-muted-foreground">Chargement...</p>}
        <CatalogCardGrid>
          {challenges?.map((challenge) => (
            <CatalogCard
              key={challenge.id}
              title={challenge.name}
              badges={
                <>
                  <Badge variant="outline">#{challenge.position}</Badge>
                  <Badge variant={challenge.is_active ? "default" : "secondary"}>
                    {challenge.is_active ? "Actif" : "Inactif"}
                  </Badge>
                </>
              }
              caption={`Capital géré : ${challenge.managed_capital !== null ? formatCurrency(challenge.managed_capital) : "-"}`}
              actions={
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/challenge-eureka/${challenge.slug}`}>Voir la page</Link>}
                  />
                  <Button
                    size="sm"
                    render={
                      <Link href={`/dashboard/eureka-challenges/${challenge.id}/edit`}>
                        Modifier le contenu
                      </Link>
                    }
                  />
                  <Tooltip>
                    <TooltipTrigger render={<span tabIndex={challenge.has_active_subscribers ? 0 : undefined} />}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={challenge.has_active_subscribers}
                        onClick={() => handleDeleteChallenge(challenge.id)}
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
                </>
              }
            />
          ))}
        </CatalogCardGrid>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Mes licences de challenge</h2>
          <p className="text-muted-foreground">
            Vos licences achetées et les fichiers associés.
          </p>
        </div>

        <div className="grid gap-4">
          {licenses === null && <p className="text-muted-foreground">Chargement...</p>}
          {licenses?.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Vous n&apos;avez pas encore de licence de challenge.
              </CardContent>
            </Card>
          )}
          {licenses?.map((license) => (
            <EurekaChallengeLicenseCard
              key={license.id}
              license={license}
              onUpdated={(updated) =>
                setLicenses((prev) => prev?.map((l) => (l.id === updated.id ? updated : l)) ?? prev)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EurekaChallengeLicenseCard({
  license,
  onUpdated,
}: {
  license: UserEurekaChallengeLicense;
  onUpdated: (license: UserEurekaChallengeLicense) => void;
}) {
  const challenge = license.eureka_challenge_license_plan.eureka_challenge;
  const accounts = license.purchase_details ?? [];
  const files = license.files ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {challenge?.name ? `${challenge.name} — ` : ""}
          {license.eureka_challenge_license_plan.name}
        </CardTitle>
        <CardAction className="flex items-center gap-3">
          {challenge?.slug && (
            <Link
              href={`/challenge-eureka/${challenge.slug}#plan-${license.eureka_challenge_license_plan.id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Voir la page
            </Link>
          )}
          {license.status === "expired" || license.status === "revoked" ? (
            <Badge variant="secondary">{license.status === "expired" ? "Expirée" : "Révoquée"}</Badge>
          ) : license.is_activated ? (
            <Badge variant="success">Activé</Badge>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="pending">En attente d&apos;activation</Badge>
              <span className="text-xs text-muted-foreground">Le challenge sera envoyé dans moins de 24h</span>
            </div>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <LicenseExpiryGauge
          activatedAt={license.activated_at}
          expiresAt={license.expires_at}
          status={license.status}
        />

        {accounts.length > 0 && (
          <div className="space-y-2">
            {accounts.map((account, index) => (
              <div
                key={index}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm"
              >
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <p>
                    <span className="text-muted-foreground">Compte {index + 1} — ID :</span> {account.id}
                  </p>
                  {account.license_keys.length > 0 && (
                    <p>
                      <span className="text-muted-foreground">License key(s) :</span>{" "}
                      {account.license_keys.join(", ")}
                    </p>
                  )}
                </div>
                {index === 0 && <EditEurekaChallengePurchaseDetailsDialog license={license} onUpdated={onUpdated} />}
              </div>
            ))}
          </div>
        )}

        {license.pending_purchase_details && (
          <div className="rounded-lg border border-dashed border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
            Modification en attente d&apos;approbation
            {license.pending_purchase_details_submitted_at && (
              <> depuis le {formatDate(license.pending_purchase_details_submitted_at)}</>
            )}
            .
          </div>
        )}

        {challenge?.instructions && challenge.instructions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {challenge.instructions.map((instruction) => (
              <Button
                key={instruction.id}
                size="sm"
                className="bg-foreground text-background hover:bg-foreground/80"
                render={
                  <a href={instruction.url} target="_blank" rel="noopener noreferrer">
                    {instruction.title}
                  </a>
                }
              />
            ))}
          </div>
        )}

        {accounts.length === 0 && (
          <div className="flex justify-end">
            <EditEurekaChallengePurchaseDetailsDialog license={license} onUpdated={onUpdated} />
          </div>
        )}

        {license.is_activated && files.length > 0 && (
          <div className="space-y-2 border-t border-border pt-4">
            <p className="text-sm font-medium">Fichiers du challenge</p>
            <ul className="space-y-1.5">
              {files.map((file: EurekaChallengeFile) => (
                <li key={file.id} className="flex items-center justify-between text-sm">
                  <span>{file.label}</span>
                  <Button
                    size="sm"
                    className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30"
                    onClick={() => downloadEurekaChallengeFile(file)}
                  >
                    <Download className="mr-1 size-3.5" /> Télécharger
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
