"use client";

import { useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { extractApiError } from "@/lib/api/client";
import {
  createAdminBotLicensePlan,
  deleteAdminBotLicensePlan,
  updateAdminBotLicensePlan,
} from "@/lib/api/admin";
import { formatCurrency } from "@/lib/utils";
import type { BotLicenseOfferType, BotLicensePlan } from "@/types/bot";
import type { LicenseDurationUnit } from "@/types/license";

const OFFER_LABELS: Record<BotLicenseOfferType, string> = {
  time_limited: "Time-limited offer",
  lifetime: "Lifetime offer",
};

const DURATION_UNIT_LABELS: Record<string, string> = { month: "Mois", year: "Année" };

interface PlanDraft {
  offer_type: BotLicenseOfferType;
  name: string;
  description: string;
  duration_value: string;
  duration_unit: LicenseDurationUnit;
  price: string;
  features: string;
  is_featured: boolean;
  is_active: boolean;
}

const EMPTY_DRAFT: PlanDraft = {
  offer_type: "time_limited",
  name: "",
  description: "",
  duration_value: "",
  duration_unit: "month",
  price: "",
  features: "",
  is_featured: false,
  is_active: true,
};

function planToDraft(plan: BotLicensePlan): PlanDraft {
  return {
    offer_type: plan.offer_type,
    name: plan.name,
    description: plan.description ?? "",
    duration_value: plan.duration_value?.toString() ?? "",
    duration_unit: plan.duration_unit ?? "month",
    price: plan.price.toString(),
    features: plan.features.join("\n"),
    is_featured: plan.is_featured,
    is_active: plan.is_active,
  };
}

function draftToPayload(draft: PlanDraft) {
  return {
    offer_type: draft.offer_type,
    name: draft.name,
    description: draft.description || null,
    duration_value: draft.offer_type === "lifetime" ? null : draft.duration_value ? Number(draft.duration_value) : null,
    duration_unit: draft.offer_type === "lifetime" ? null : draft.duration_unit,
    price: Number(draft.price || 0),
    features: draft.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean),
    is_featured: draft.is_featured,
    is_active: draft.is_active,
  };
}

function PlanFields({ value, onChange }: { value: PlanDraft; onChange: (next: PlanDraft) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Type d&apos;offre</Label>
          <Select
            items={OFFER_LABELS}
            value={value.offer_type}
            onValueChange={(v) => v && onChange({ ...value, offer_type: v as BotLicenseOfferType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time_limited">Time-limited offer</SelectItem>
              <SelectItem value="lifetime">Lifetime offer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Nom</Label>
          <Input
            placeholder="Licence Semestrielle (6 Mois)"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          rows={2}
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {value.offer_type === "time_limited" && (
          <>
            <div className="space-y-2">
              <Label>Durée</Label>
              <Input
                type="number"
                min="1"
                value={value.duration_value}
                onChange={(e) => onChange({ ...value, duration_value: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Unité</Label>
              <Select
                items={DURATION_UNIT_LABELS}
                value={value.duration_unit}
                onValueChange={(v) => v && onChange({ ...value, duration_unit: v as LicenseDurationUnit })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mois</SelectItem>
                  <SelectItem value="year">Année</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        <div className="space-y-2">
          <Label>Prix ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={value.price}
            onChange={(e) => onChange({ ...value, price: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Fonctionnalités incluses (une par ligne)</Label>
        <Textarea
          rows={4}
          value={value.features}
          onChange={(e) => onChange({ ...value, features: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={value.is_featured}
            onCheckedChange={(checked) => onChange({ ...value, is_featured: checked })}
          />
          <Label>Mise en avant (&quot;Populaire&quot;)</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={value.is_active}
            onCheckedChange={(checked) => onChange({ ...value, is_active: checked })}
          />
          <Label>Active</Label>
        </div>
      </div>
    </div>
  );
}

export function BotLicensePlansManager({
  botId,
  botSlug,
  plans,
  onChange,
}: {
  botId: number;
  botSlug: string;
  plans: BotLicensePlan[];
  onChange: (next: BotLicensePlan[]) => void;
}) {
  const [draft, setDraft] = useState<PlanDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingDraft, setEditingDraft] = useState<PlanDraft>(EMPTY_DRAFT);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim()) return;
    setPending(true);
    setError(null);
    try {
      const created = await createAdminBotLicensePlan(botId, {
        ...draftToPayload(draft),
        position: plans.length,
      });
      onChange([...plans, created]);
      setDraft(EMPTY_DRAFT);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'ajouter la licence."));
    } finally {
      setPending(false);
    }
  }

  async function handleSave(id: number) {
    setPending(true);
    setError(null);
    try {
      const updated = await updateAdminBotLicensePlan(id, draftToPayload(editingDraft));
      onChange(plans.map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer la licence."));
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Supprimer définitivement cette licence ?")) return;
    setError(null);
    try {
      await deleteAdminBotLicensePlan(id);
      onChange(plans.filter((p) => p.id !== id));
    } catch (err) {
      setError(extractApiError(err, "Impossible de supprimer cette licence."));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Licences ({plans.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="divide-y divide-border">
          {plans.map((plan) =>
            editingId === plan.id ? (
              <li key={plan.id} className="space-y-3 py-3">
                <PlanFields value={editingDraft} onChange={setEditingDraft} />
                <div className="flex gap-2">
                  <Button size="sm" disabled={pending} onClick={() => handleSave(plan.id)}>
                    Enregistrer
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>
                    Annuler
                  </Button>
                </div>
              </li>
            ) : (
              <li key={plan.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{plan.name}</span>
                    <Badge variant="secondary">{OFFER_LABELS[plan.offer_type]}</Badge>
                    {plan.is_featured && <Badge>Populaire</Badge>}
                    {!plan.is_active && <Badge variant="secondary">Inactive</Badge>}
                  </div>
                  <p className="mt-1 text-muted-foreground">{formatCurrency(plan.price)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/bot-trading/${botSlug}#plan-${plan.id}`}>Voir la page</Link>}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(plan.id);
                      setEditingDraft(planToDraft(plan));
                    }}
                  >
                    Modifier
                  </Button>
                  <Tooltip>
                    <TooltipTrigger render={<span tabIndex={plan.has_active_subscribers ? 0 : undefined} />}>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={plan.has_active_subscribers}
                        onClick={() => handleDelete(plan.id)}
                      >
                        Supprimer
                      </Button>
                    </TooltipTrigger>
                    {plan.has_active_subscribers && (
                      <TooltipContent>
                        Ce produit ne peut pas être supprimé car des utilisateurs y sont inscrits.
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              </li>
            )
          )}
          {plans.length === 0 && (
            <p className="py-2 text-sm text-muted-foreground">Aucune licence pour le moment.</p>
          )}
        </ul>

        <form onSubmit={handleAdd} className="space-y-3 border-t border-border pt-4">
          <p className="text-sm font-medium">Ajouter une licence</p>
          <PlanFields value={draft} onChange={setDraft} />
          <Button type="submit" disabled={pending || !draft.name.trim()}>
            Ajouter
          </Button>
        </form>
        {error && <Alert variant="error">{error}</Alert>}
      </CardContent>
    </Card>
  );
}
