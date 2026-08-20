"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUploadInput } from "@/components/forms/ImageUploadInput";
import { createAdminBroker, updateAdminBroker } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import type { Broker } from "@/types/broker";

export function BrokerDialog({
  broker,
  trigger,
  onSaved,
}: {
  broker?: Broker;
  trigger: React.ReactElement;
  onSaved: (broker: Broker) => void;
}) {
  const isEditing = Boolean(broker);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(broker?.name ?? "");
  const [affiliateUrl, setAffiliateUrl] = useState(broker?.affiliate_url ?? "");
  const [description, setDescription] = useState(broker?.description ?? "");
  const [position, setPosition] = useState(broker?.position?.toString() ?? "0");
  const [isActive, setIsActive] = useState(broker?.is_active ?? true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function reset() {
    setName(broker?.name ?? "");
    setAffiliateUrl(broker?.affiliate_url ?? "");
    setDescription(broker?.description ?? "");
    setPosition(broker?.position?.toString() ?? "0");
    setIsActive(broker?.is_active ?? true);
    setLogoFile(null);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("affiliate_url", affiliateUrl);
    formData.append("description", description);
    formData.append("position", position || "0");
    formData.append("is_active", isActive ? "1" : "0");
    if (logoFile) formData.append("logo", logoFile);

    try {
      const saved = isEditing && broker
        ? await updateAdminBroker(broker.id, formData)
        : await createAdminBroker(formData);
      toast.success(isEditing ? "Courtier mis à jour." : "Courtier créé.");
      onSaved(saved);
      setOpen(false);
      if (!isEditing) reset();
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer ce courtier."));
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier le courtier" : "Nouveau courtier"}</DialogTitle>
          <DialogDescription>
            Ce courtier apparaîtra dans les pages du site s&apos;il est actif.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="broker-name">Nom</Label>
            <Input
              id="broker-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex. Deriv, Exness, RoboForex"
            />
          </div>

          <ImageUploadInput
            id="broker-logo"
            label="Logo"
            value={logoFile}
            onChange={setLogoFile}
            existingUrl={broker?.logo_url}
          />

          <div className="space-y-2">
            <Label htmlFor="broker-affiliate-url">Lien d&apos;affiliation</Label>
            <Input
              id="broker-affiliate-url"
              type="url"
              required
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="broker-description">Description (optionnel)</Label>
            <Textarea
              id="broker-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="broker-position">Ordre d&apos;affichage</Label>
            <Input
              id="broker-position"
              type="number"
              min="0"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="broker-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="broker-active">Actif (visible sur le site)</Label>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : isEditing ? "Enregistrer" : "Créer le courtier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
