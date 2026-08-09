"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StringListEditor } from "@/components/forms/StringListEditor";
import { extractApiError } from "@/lib/api/client";
import { createAdminLicensePlan, updateAdminLicensePlan } from "@/lib/api/admin";
import type { LicensePlan } from "@/types/license";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function LicensePlanForm({
  plan,
  onSaved,
}: {
  plan?: LicensePlan;
  onSaved: (plan: LicensePlan) => void;
}) {
  const isEditing = Boolean(plan);

  const [name, setName] = useState(plan?.name ?? "");
  const [slug, setSlug] = useState(plan?.slug ?? "");
  const [description, setDescription] = useState(plan?.description ?? "");
  const [durationDays, setDurationDays] = useState(plan?.duration_days?.toString() ?? "30");
  const [price, setPrice] = useState(plan?.price?.toString() ?? "49");
  const [managedCapitalMin, setManagedCapitalMin] = useState(
    plan?.managed_capital_min?.toString() ?? ""
  );
  const [managedCapitalMax, setManagedCapitalMax] = useState(
    plan?.managed_capital_max?.toString() ?? ""
  );
  const [features, setFeatures] = useState<string[]>(plan?.features ?? []);
  const [guarantees, setGuarantees] = useState<string[]>(plan?.guarantees ?? []);
  const [isActive, setIsActive] = useState(plan?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const payload = {
      name,
      slug: slug || slugify(name),
      description,
      duration_days: Number(durationDays),
      price: Number(price),
      managed_capital_min: managedCapitalMin ? Number(managedCapitalMin) : null,
      managed_capital_max: managedCapitalMax ? Number(managedCapitalMax) : null,
      features: features.map((f) => f.trim()).filter(Boolean),
      guarantees: guarantees.map((g) => g.trim()).filter(Boolean),
      is_active: isActive,
    };

    try {
      const saved =
        isEditing && plan
          ? await updateAdminLicensePlan(plan.id, payload)
          : await createAdminLicensePlan(payload);
      onSaved(saved);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer la licence."));
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Informations générales" : "Nouvelle licence"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plan-name">Nom de la licence</Label>
            <Input id="plan-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan-slug">Slug (URL)</Label>
            <Input
              id="plan-slug"
              placeholder="auto-généré si laissé vide"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan-description">Description</Label>
            <Textarea
              id="plan-description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan-duration">Durée (jours)</Label>
              <Input
                id="plan-duration"
                type="number"
                min="1"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-price">Prix ($)</Label>
              <Input
                id="plan-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan-capital-min">Capital géré min ($)</Label>
              <Input
                id="plan-capital-min"
                type="number"
                min="0"
                step="0.01"
                value={managedCapitalMin}
                onChange={(e) => setManagedCapitalMin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-capital-max">Capital géré max ($)</Label>
              <Input
                id="plan-capital-max"
                type="number"
                min="0"
                step="0.01"
                value={managedCapitalMax}
                onChange={(e) => setManagedCapitalMax(e.target.value)}
              />
            </div>
          </div>

          <StringListEditor
            label="Caractéristiques (features)"
            items={features}
            onChange={setFeatures}
            placeholder="ex. 1 stratégie active"
          />

          <StringListEditor
            label="Garanties (guarantees)"
            items={guarantees}
            onChange={setGuarantees}
            placeholder="ex. Support par email"
          />

          <div className="flex items-center gap-3">
            <Switch id="plan-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="plan-active">Active (visible sur le site)</Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer la licence"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
