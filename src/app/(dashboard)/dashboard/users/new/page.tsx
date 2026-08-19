"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRequireRole } from "@/hooks/useRequireRole";
import { createAdminUser, fetchAdminCourses, fetchAdminLicensePlans, fetchAdminTradingBots } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import type { Course } from "@/types/course";
import type { LicensePlan } from "@/types/license";
import type { BotLicensePlan } from "@/types/bot";

function toggleId(ids: number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

export default function NewUserPage() {
  useRequireRole(["admin", "developer"]);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [courseIds, setCourseIds] = useState<number[]>([]);
  const [licensePlanIds, setLicensePlanIds] = useState<number[]>([]);
  const [botLicensePlanIds, setBotLicensePlanIds] = useState<number[]>([]);

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
        license_plan_ids: licensePlanIds,
        bot_license_plan_ids: botLicensePlanIds,
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
                <Input
                  id="password"
                  type="password"
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
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3">
                {licensePlans.length === 0 && <p className="text-sm text-muted-foreground">Aucune licence.</p>}
                {licensePlans.map((plan) => (
                  <label key={plan.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={licensePlanIds.includes(plan.id)}
                      onChange={() => setLicensePlanIds((ids) => toggleId(ids, plan.id))}
                    />
                    {plan.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Licences Bots de Trading</Label>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3">
                {botLicensePlans.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune licence de bot.</p>
                )}
                {botLicensePlans.map((plan) => (
                  <label key={plan.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={botLicensePlanIds.includes(plan.id)}
                      onChange={() => setBotLicensePlanIds((ids) => toggleId(ids, plan.id))}
                    />
                    {plan.botName} — {plan.name}
                  </label>
                ))}
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
