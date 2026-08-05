"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireRole } from "@/hooks/useRequireRole";
import { createAdminLicensePlan } from "@/lib/api/admin";

export default function NewLicensePlanPage() {
  useRequireRole(["admin", "developer"]);
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationDays, setDurationDays] = useState("30");
  const [price, setPrice] = useState("49");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await createAdminLicensePlan({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description,
        duration_days: Number(durationDays),
        price: Number(price),
        guarantees: [],
        features: [],
        is_active: true,
      });
      router.push("/dashboard/licences");
    } catch {
      setError("Impossible de créer la licence. Vérifiez les champs.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Nouvelle licence auto-trading</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la licence</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (jours)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prix ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={pending}>
              {pending ? "Création..." : "Créer la licence"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
