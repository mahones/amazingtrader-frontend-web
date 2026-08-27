"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { WhatsappNumberField } from "@/components/shared/WhatsappNumberField";
import { useRequireRole } from "@/hooks/useRequireRole";
import { createAdminUser, fetchAdminCourses, fetchAdminLicensePlans, fetchAdminTradingBots } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import { digitsOnly } from "@/lib/utils";
import type { Course } from "@/types/course";
import type { LicensePlan, LicensePurchaseDetails } from "@/types/license";
import type { BotLicensePlan } from "@/types/bot";

function toggleId(ids: number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

const emptyLicenseDetails: LicensePurchaseDetails = { id: "", password: "", server: "", whatsapp_number: "" };

export default function NewUserPage() {
  useRequireRole(["admin", "developer"]);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [courseIds, setCourseIds] = useState<number[]>([]);

  const [licensePlanIds, setLicensePlanIds] = useState<number[]>([]);
  const [licenseDetails, setLicenseDetails] = useState<Record<number, LicensePurchaseDetails>>({});

  const [botLicensePlanIds, setBotLicensePlanIds] = useState<number[]>([]);
  const [botLicenseDetails, setBotLicenseDetails] = useState<Record<number, string>>({});

  const [courses, setCourses] = useState<Course[]>([]);
  const [licensePlans, setLicensePlans] = useState<LicensePlan[]>([]);
  const [botLicensePlans, setBotLicensePlans] = useState<(BotLicensePlan & { botName: string })[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetchAdminCourses().then(setCourses);
    fetchAdminLicensePlans().then(setLicensePlans);
    fetchAdminTradingBots().then((bots) => {
      const plans = bots.flatMap((bot) =>
        (bot.license_plans ?? []).map((plan) => ({ ...plan, botName: bot.name }))
      );
      setBotLicensePlans(plans);
    });
  }, []);

  function toggleLicensePlan(planId: number) {
    setLicensePlanIds((ids) => toggleId(ids, planId));
    setLicenseDetails((prev) => (prev[planId] ? prev : { ...prev, [planId]: { ...emptyLicenseDetails } }));
  }

  function updateLicenseDetail(planId: number, field: keyof LicensePurchaseDetails, value: string) {
    setLicenseDetails((prev) => ({
      ...prev,
      [planId]: { ...(prev[planId] ?? emptyLicenseDetails), [field]: value },
    }));
  }

  function toggleBotLicensePlan(planId: number) {
    setBotLicensePlanIds((ids) => toggleId(ids, planId));
    setBotLicenseDetails((prev) => (prev[planId] !== undefined ? prev : { ...prev, [planId]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const user = await createAdminUser({
        name,
        email,
        password,
        course_ids: courseIds,
        licenses: licensePlanIds.map((planId) => ({
          license_plan_id: planId,
          ...(licenseDetails[planId] ?? emptyLicenseDetails),
        })),
        bot_licenses: botLicensePlanIds.map((planId) => ({
          bot_license_plan_id: planId,
          id: botLicenseDetails[planId] ?? "",
        })),
      });
      toast.success("Utilisateur créé avec succès.");
      router.push(`/dashboard/users/${user.id}`);
    } catch (err) {
      setError(extractApiError(err, "Impossible de créer l'utilisateur."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Créer un utilisateur</h1>
        <p className="text-muted-foreground">
          Créez un compte et attribuez-lui directement des formations et licences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du compte</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="password">Mot de passe</Label>
                <PasswordInput
                  id="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Formations</Label>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3">
                {courses.length === 0 && <p className="text-sm text-muted-foreground">Aucune formation.</p>}
                {courses.map((course) => (
                  <label key={course.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={courseIds.includes(course.id)}
                      onChange={() => setCourseIds((ids) => toggleId(ids, course.id))}
                    />
                    {course.title}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Licences Auto-Trading</Label>
              <div className="space-y-3 rounded-lg border p-3">
                {licensePlans.length === 0 && <p className="text-sm text-muted-foreground">Aucune licence.</p>}
                {licensePlans.map((plan) => {
                  const checked = licensePlanIds.includes(plan.id);
                  const details = licenseDetails[plan.id] ?? emptyLicenseDetails;
                  return (
                    <div key={plan.id} className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="accent-primary"
                          checked={checked}
                          onChange={() => toggleLicensePlan(plan.id)}
                        />
                        {plan.name}
                      </label>
                      {checked && (
                        <div className="grid gap-2 rounded-lg bg-muted/40 p-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <Label htmlFor={`license-${plan.id}-id`} className="text-xs">
                              ID (optionnel)
                            </Label>
                            <Input
                              id={`license-${plan.id}-id`}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={details.id}
                              onChange={(e) => updateLicenseDetail(plan.id, "id", digitsOnly(e.target.value))}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`license-${plan.id}-password`} className="text-xs">
                              Mot de passe (optionnel)
                            </Label>
                            <PasswordInput
                              id={`license-${plan.id}-password`}
                              value={details.password}
                              onChange={(e) => updateLicenseDetail(plan.id, "password", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`license-${plan.id}-server`} className="text-xs">
                              Serveur (optionnel)
                            </Label>
                            <Input
                              id={`license-${plan.id}-server`}
                              value={details.server}
                              onChange={(e) => updateLicenseDetail(plan.id, "server", e.target.value)}
                            />
                          </div>
                          <WhatsappNumberField
                            idPrefix={`license-${plan.id}-whatsapp`}
                            label="Numéro WhatsApp (optionnel)"
                            value={details.whatsapp_number}
                            onChange={(v) => updateLicenseDetail(plan.id, "whatsapp_number", v)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Licences Bots de Trading</Label>
              <div className="space-y-3 rounded-lg border p-3">
                {botLicensePlans.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune licence de bot.</p>
                )}
                {botLicensePlans.map((plan) => {
                  const checked = botLicensePlanIds.includes(plan.id);
                  return (
                    <div key={plan.id} className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="accent-primary"
                          checked={checked}
                          onChange={() => toggleBotLicensePlan(plan.id)}
                        />
                        {plan.botName} — {plan.name}
                      </label>
                      {checked && (
                        <div className="rounded-lg bg-muted/40 p-3">
                          <div className="space-y-1">
                            <Label htmlFor={`bot-license-${plan.id}-id`} className="text-xs">
                              ID (optionnel)
                            </Label>
                            <Input
                              id={`bot-license-${plan.id}-id`}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={botLicenseDetails[plan.id] ?? ""}
                              onChange={(e) =>
                                setBotLicenseDetails((prev) => ({ ...prev, [plan.id]: digitsOnly(e.target.value) }))
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {error && <Alert variant="error">{error}</Alert>}
            <Button type="submit" disabled={pending}>
              {pending ? "Création..." : "Créer l'utilisateur"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
