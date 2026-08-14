"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StringListEditor } from "@/components/forms/StringListEditor";
import { extractApiError } from "@/lib/api/client";
import { createAdminLicensePlan, updateAdminLicensePlan } from "@/lib/api/admin";
import type { LicenseDurationUnit, LicensePlan } from "@/types/license";

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
  const [durationValue, setDurationValue] = useState(plan?.duration_value?.toString() ?? "1");
  const [durationUnit, setDurationUnit] = useState<LicenseDurationUnit>(plan?.duration_unit ?? "month");
  const [price, setPrice] = useState(plan?.price?.toString() ?? "49");
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
      duration_value: Number(durationValue),
      duration_unit: durationUnit,
      price: Number(price),
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan-duration">Durée</Label>
              <Input
                id="plan-duration"
                type="number"
                min="1"
                value={durationValue}
                onChange={(e) => setDurationValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-duration-unit">Unité</Label>
              <Select
                value={durationUnit}
                onValueChange={(v) => v && setDurationUnit(v as LicenseDurationUnit)}
              >
                <SelectTrigger id="plan-duration-unit" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mois</SelectItem>
                  <SelectItem value="year">Année</SelectItem>
                </SelectContent>
              </Select>
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

          {error && <Alert variant="error">{error}</Alert>}

          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer la licence"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
