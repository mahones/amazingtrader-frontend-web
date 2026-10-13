"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { LicenseAccountsFields } from "@/components/licenses/LicenseAccountsFields";
import { useRequireRole } from "@/hooks/useRequireRole";
import {
  createAdminUser,
  fetchAdminCourses,
  fetchAdminEurekaChallenges,
  fetchAdminLicensePlans,
  fetchAdminTradingBots,
} from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import {
  AUTO_TRADING_FIELDS,
  BOT_FIELDS,
  fillAccounts,
  toAccountPayload,
  type AccountDraft,
} from "@/lib/license-accounts";
import { toast } from "@/lib/toast";
import type { Course } from "@/types/course";
import type { LicensePlan } from "@/types/license";
import type { BotLicensePlan } from "@/types/bot";
import type { EurekaChallengeLicensePlan } from "@/types/eurekaChallenge";

function toggleId(ids: number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

const today = () => new Date().toISOString().slice(0, 10);

// Optional original purchase date, for customers who paid before the platform
// existed: the remaining licence time is computed from it.
function PurchasedAtField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1 sm:col-span-2">
      <Label htmlFor={id} className="text-xs">
        Date d&apos;achat d&apos;origine (optionnel)
      </Label>
      <Input id={id} type="date" max={today()} value={value} onChange={(e) => onChange(e.target.value)} />
      <p className="text-xs text-muted-foreground">
        Pour un client qui avait payé avant la plateforme. Laissez vide si la licence démarre aujourd&apos;hui.
      </p>
    </div>
  );
}

export default function NewUserPage() {
  useRequireRole(["admin", "developer"]);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [courseIds, setCourseIds] = useState<number[]>([]);

  const [licensePlanIds, setLicensePlanIds] = useState<number[]>([]);
  // Accounts typed for each ticked plan (one draft per account of the plan).
  const [licenseDetails, setLicenseDetails] = useState<Record<number, AccountDraft[]>>({});

  const [botLicensePlanIds, setBotLicensePlanIds] = useState<number[]>([]);
  const [botLicenseDetails, setBotLicenseDetails] = useState<Record<number, AccountDraft[]>>({});

  const [eurekaPlanIds, setEurekaPlanIds] = useState<number[]>([]);
  const [purchasedAt, setPurchasedAt] = useState<Record<string, string>>({});

  const [courses, setCourses] = useState<Course[]>([]);
  const [licensePlans, setLicensePlans] = useState<LicensePlan[]>([]);
  const [botLicensePlans, setBotLicensePlans] = useState<(BotLicensePlan & { botName: string })[]>([]);

  const [eurekaPlans, setEurekaPlans] = useState<(EurekaChallengeLicensePlan & { challengeName: string })[]>([]);

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
    fetchAdminEurekaChallenges().then((challenges) =>
      setEurekaPlans(
        challenges.flatMap((challenge) =>
          (challenge.license_plans ?? []).map((plan) => ({ ...plan, challengeName: challenge.name }))
        )
      )
    );
  }, []);

  const dateFor = (key: string) => (purchasedAt[key] ? { purchased_at: purchasedAt[key] } : {});

  function toggleLicensePlan(plan: LicensePlan) {
    setLicensePlanIds((ids) => toggleId(ids, plan.id));
    setLicenseDetails((prev) =>
      prev[plan.id] ? prev : { ...prev, [plan.id]: fillAccounts(null, plan.number_of_accounts) }
    );
  }

  function toggleBotLicensePlan(plan: BotLicensePlan) {
    setBotLicensePlanIds((ids) => toggleId(ids, plan.id));
    setBotLicenseDetails((prev) =>
      prev[plan.id] ? prev : { ...prev, [plan.id]: fillAccounts(null, plan.number_of_accounts) }
    );
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
          accounts: toAccountPayload(licenseDetails[planId] ?? [], AUTO_TRADING_FIELDS),
          ...dateFor(`auto-${planId}`),
        })),
        bot_licenses: botLicensePlanIds.map((planId) => ({
          bot_license_plan_id: planId,
          accounts: toAccountPayload(botLicenseDetails[planId] ?? [], BOT_FIELDS),
          ...dateFor(`bot-${planId}`),
        })),
        eureka_challenge_licenses: eurekaPlanIds.map((planId) => ({
          eureka_challenge_license_plan_id: planId,
          ...dateFor(`eureka-${planId}`),
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
                  return (
                    <div key={plan.id} className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="accent-primary"
                          checked={checked}
                          onChange={() => toggleLicensePlan(plan)}
                        />
                        {plan.name}
                      </label>
                      {checked && (
                        <div className="space-y-2 rounded-lg bg-muted/40 p-3">
                          <LicenseAccountsFields
                            idPrefix={`license-${plan.id}`}
                            accounts={licenseDetails[plan.id] ?? fillAccounts(null, plan.number_of_accounts)}
                            onChange={(next) => setLicenseDetails((prev) => ({ ...prev, [plan.id]: next }))}
                            fields={AUTO_TRADING_FIELDS}
                            required={false}
                            compact
                          />
                          <PurchasedAtField
                            id={`license-${plan.id}-purchased-at`}
                            value={purchasedAt[`auto-${plan.id}`] ?? ""}
                            onChange={(v) => setPurchasedAt((prev) => ({ ...prev, [`auto-${plan.id}`]: v }))}
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
                          onChange={() => toggleBotLicensePlan(plan)}
                        />
                        {plan.botName} — {plan.name}
                      </label>
                      {checked && (
                        <div className="space-y-2 rounded-lg bg-muted/40 p-3">
                          <LicenseAccountsFields
                            idPrefix={`bot-license-${plan.id}`}
                            accounts={botLicenseDetails[plan.id] ?? fillAccounts(null, plan.number_of_accounts)}
                            onChange={(next) => setBotLicenseDetails((prev) => ({ ...prev, [plan.id]: next }))}
                            fields={BOT_FIELDS}
                            required={false}
                            compact
                          />
                          <PurchasedAtField
                            id={`bot-license-${plan.id}-purchased-at`}
                            value={purchasedAt[`bot-${plan.id}`] ?? ""}
                            onChange={(v) => setPurchasedAt((prev) => ({ ...prev, [`bot-${plan.id}`]: v }))}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Licences Challenge Eureka</Label>
              <div className="space-y-3 rounded-lg border p-3">
                {eurekaPlans.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune licence de challenge.</p>
                )}
                {eurekaPlans.map((plan) => {
                  const checked = eurekaPlanIds.includes(plan.id);
                  return (
                    <div key={plan.id} className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="accent-primary"
                          checked={checked}
                          onChange={() => setEurekaPlanIds((ids) => toggleId(ids, plan.id))}
                        />
                        {plan.challengeName} — {plan.name}
                      </label>
                      {checked && (
                        <div className="grid gap-2 rounded-lg bg-muted/40 p-3">
                          <PurchasedAtField
                            id={`eureka-license-${plan.id}-purchased-at`}
                            value={purchasedAt[`eureka-${plan.id}`] ?? ""}
                            onChange={(v) => setPurchasedAt((prev) => ({ ...prev, [`eureka-${plan.id}`]: v }))}
                          />
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
