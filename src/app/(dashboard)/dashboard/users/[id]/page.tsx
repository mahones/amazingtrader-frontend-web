"use client";

import { use, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AssignCourseDialog } from "@/components/admin/AssignCourseDialog";
import { AssignLicenseDialog } from "@/components/admin/AssignLicenseDialog";
import { LicenseExpiryGauge } from "@/components/licenses/LicenseExpiryGauge";
import { useRequireRole } from "@/hooks/useRequireRole";
import {
  activateUserBotLicense,
  activateUserLicense,
  approveBotLicensePurchaseDetailsChange,
  approveLicensePurchaseDetailsChange,
  fetchAdminLicensePlans,
  fetchAdminTradingBots,
  fetchAdminUserProfile,
  rejectBotLicensePurchaseDetailsChange,
  rejectLicensePurchaseDetailsChange,
  updateAdminUserStatus,
} from "@/lib/api/admin";
import { formatDate } from "@/lib/utils";
import type { BotLicensePlan } from "@/types/bot";
import type { LicensePlan } from "@/types/license";
import type { UserProfile } from "@/types/user";

function ActivationBadge({ isActivated }: { isActivated: boolean }) {
  return isActivated ? (
    <Badge className="border-transparent bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
      Activée
    </Badge>
  ) : (
    <Badge variant="destructive">Non activée</Badge>
  );
}

function PendingChangeReview({
  pendingDetails,
  submittedAt,
  onApprove,
  onReject,
}: {
  pendingDetails: Record<string, string | null>;
  submittedAt: string | null;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [pending, setPending] = useState(false);

  async function handle(action: () => Promise<void>) {
    setPending(true);
    try {
      await action();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-dashed border-amber-500/50 bg-amber-500/10 p-3 text-sm">
      <p className="font-medium text-amber-700 dark:text-amber-400">
        Modification en attente d&apos;approbation
        {submittedAt && <> depuis le {formatDate(submittedAt)}</>}
      </p>
      <div className="grid gap-1 sm:grid-cols-2">
        {Object.entries(pendingDetails).map(([key, value]) => (
          <p key={key}>
            <span className="text-muted-foreground">{key} :</span> {value}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <Button size="sm" disabled={pending} onClick={() => handle(async () => onApprove())}>
          Approuver
        </Button>
        <Button size="sm" variant="outline" disabled={pending} onClick={() => handle(async () => onReject())}>
          Rejeter
        </Button>
      </div>
    </div>
  );
}

export default function DashboardUserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  useRequireRole(["admin", "developer"]);
  const { id } = use(params);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [licensePlans, setLicensePlans] = useState<LicensePlan[]>([]);
  const [botLicensePlans, setBotLicensePlans] = useState<(BotLicensePlan & { botName: string })[]>([]);

  useEffect(() => {
    fetchAdminUserProfile(Number(id)).then(setProfile);
    fetchAdminLicensePlans().then(setLicensePlans);
    fetchAdminTradingBots().then((bots) => {
      const plans = bots.flatMap((bot) =>
        (bot.license_plans ?? []).map((plan) => ({ ...plan, botName: bot.name }))
      );
      setBotLicensePlans(plans);
    });
  }, [id]);

  async function handleToggleStatus() {
    if (!profile) return;
    const nextActive = !profile.is_active;
    if (nextActive === false && !window.confirm("Désactiver ce compte ? L'utilisateur sera déconnecté immédiatement.")) {
      return;
    }
    const updated = await updateAdminUserStatus(profile.id, nextActive);
    setProfile({ ...profile, is_active: updated.is_active });
  }

  async function handleActivateLicense(licenseId: number) {
    const updated = await activateUserLicense(licenseId);
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            user_licenses: prev.user_licenses.map((l) => (l.id === licenseId ? { ...l, ...updated } : l)),
          }
        : prev
    );
  }

  async function handleActivateBotLicense(licenseId: number) {
    const updated = await activateUserBotLicense(licenseId);
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            user_bot_licenses: prev.user_bot_licenses.map((l) => (l.id === licenseId ? { ...l, ...updated } : l)),
          }
        : prev
    );
  }

  async function handleApproveLicenseChange(licenseId: number) {
    const updated = await approveLicensePurchaseDetailsChange(licenseId);
    setProfile((prev) =>
      prev
        ? { ...prev, user_licenses: prev.user_licenses.map((l) => (l.id === licenseId ? { ...l, ...updated } : l)) }
        : prev
    );
  }

  async function handleRejectLicenseChange(licenseId: number) {
    const updated = await rejectLicensePurchaseDetailsChange(licenseId);
    setProfile((prev) =>
      prev
        ? { ...prev, user_licenses: prev.user_licenses.map((l) => (l.id === licenseId ? { ...l, ...updated } : l)) }
        : prev
    );
  }

  async function handleApproveBotLicenseChange(licenseId: number) {
    const updated = await approveBotLicensePurchaseDetailsChange(licenseId);
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            user_bot_licenses: prev.user_bot_licenses.map((l) => (l.id === licenseId ? { ...l, ...updated } : l)),
          }
        : prev
    );
  }

  async function handleRejectBotLicenseChange(licenseId: number) {
    const updated = await rejectBotLicensePurchaseDetailsChange(licenseId);
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            user_bot_licenses: prev.user_bot_licenses.map((l) => (l.id === licenseId ? { ...l, ...updated } : l)),
          }
        : prev
    );
  }

  if (!profile) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground">{profile.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <AssignLicenseDialog
            userId={profile.id}
            licensePlans={licensePlans}
            botLicensePlans={botLicensePlans}
            onLicenseAssigned={(license) =>
              setProfile((prev) => (prev ? { ...prev, user_licenses: [...prev.user_licenses, license] } : prev))
            }
            onBotLicenseAssigned={(license) =>
              setProfile((prev) =>
                prev ? { ...prev, user_bot_licenses: [...prev.user_bot_licenses, license] } : prev
              )
            }
          />
          <Button variant={profile.is_active ? "destructive" : "outline"} onClick={handleToggleStatus}>
            {profile.is_active ? "Désactiver le compte" : "Activer le compte"}
          </Button>
        </div>
      </div>

      <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
        <p>Rôle : <span className="capitalize text-foreground">{profile.role}</span></p>
        <p>Inscrit le : <span className="text-foreground">{formatDate(profile.created_at)}</span></p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Auto-trading ({profile.user_licenses.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.user_licenses.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune licence auto-trading.</p>
          )}
          {profile.user_licenses.map((license) => (
            <div key={license.id} className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{license.license_plan.name}</p>
                <div className="flex items-center gap-2">
                  <ActivationBadge isActivated={license.is_activated} />
                  {!license.is_activated && (
                    <Button size="sm" onClick={() => handleActivateLicense(license.id)}>
                      Activer
                    </Button>
                  )}
                </div>
              </div>
              <LicenseExpiryGauge
                activatedAt={license.activated_at}
                expiresAt={license.expires_at}
                status={license.status}
              />
              {license.purchase_details && (
                <div className="grid gap-1.5 text-sm sm:grid-cols-2">
                  <p><span className="text-muted-foreground">ID :</span> {license.purchase_details.id}</p>
                  <p><span className="text-muted-foreground">Mot de passe :</span> {license.purchase_details.password}</p>
                  <p><span className="text-muted-foreground">Serveur :</span> {license.purchase_details.server}</p>
                  <p><span className="text-muted-foreground">WhatsApp :</span> {license.purchase_details.whatsapp_number}</p>
                </div>
              )}
              {license.pending_purchase_details && (
                <PendingChangeReview
                  pendingDetails={{
                    ID: license.pending_purchase_details.id,
                    "Mot de passe": license.pending_purchase_details.password,
                    Serveur: license.pending_purchase_details.server,
                    WhatsApp: license.pending_purchase_details.whatsapp_number,
                  }}
                  submittedAt={license.pending_purchase_details_submitted_at}
                  onApprove={() => handleApproveLicenseChange(license.id)}
                  onReject={() => handleRejectLicenseChange(license.id)}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bots ({profile.user_bot_licenses.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.user_bot_licenses.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune licence de bot.</p>
          )}
          {profile.user_bot_licenses.map((license) => (
            <div key={license.id} className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{license.bot_license_plan.name}</p>
                <div className="flex items-center gap-2">
                  <ActivationBadge isActivated={license.is_activated} />
                  {!license.is_activated && (
                    <Button size="sm" onClick={() => handleActivateBotLicense(license.id)}>
                      Activer
                    </Button>
                  )}
                </div>
              </div>
              <LicenseExpiryGauge
                activatedAt={license.activated_at}
                expiresAt={license.expires_at}
                status={license.status}
              />
              {license.purchase_details && (
                <p className="text-sm">
                  <span className="text-muted-foreground">ID :</span> {license.purchase_details.id}
                </p>
              )}
              {license.pending_purchase_details && (
                <PendingChangeReview
                  pendingDetails={{ ID: license.pending_purchase_details.id }}
                  submittedAt={license.pending_purchase_details_submitted_at}
                  onApprove={() => handleApproveBotLicenseChange(license.id)}
                  onReject={() => handleRejectBotLicenseChange(license.id)}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Formations ({profile.enrollments.length})</CardTitle>
          <AssignCourseDialog
            userId={profile.id}
            enrolledCourseIds={profile.enrollments.map((e) => e.course.id)}
            onEnrollmentsAssigned={(newEnrollments) =>
              setProfile((prev) => (prev ? { ...prev, enrollments: [...prev.enrollments, ...newEnrollments] } : prev))
            }
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.enrollments.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune formation achetée.</p>
          )}
          {profile.enrollments.map((enrollment) => (
            <div key={enrollment.id} className="space-y-2 rounded-lg border border-border p-4">
              <p className="font-medium">{enrollment.course.title}</p>
              <Progress value={enrollment.progress_percent} />
              <p className="text-xs text-muted-foreground">{enrollment.progress_percent}% complété</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
