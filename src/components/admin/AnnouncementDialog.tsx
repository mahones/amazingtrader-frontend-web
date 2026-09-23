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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createAdminAnnouncement, updateAdminAnnouncement } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import type { Announcement } from "@/types/announcement";

export function AnnouncementDialog({
  announcement,
  trigger,
  onSaved,
}: {
  announcement?: Announcement;
  trigger: React.ReactElement;
  onSaved: (announcement: Announcement) => void;
}) {
  const isEditing = Boolean(announcement);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(announcement?.title ?? "");
  const [description, setDescription] = useState(announcement?.description ?? "");
  const [isPinned, setIsPinned] = useState(announcement?.is_pinned ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function reset() {
    setTitle(announcement?.title ?? "");
    setDescription(announcement?.description ?? "");
    setIsPinned(announcement?.is_pinned ?? true);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const payload: Partial<Announcement> = { title, description, is_pinned: isPinned };

    try {
      const saved =
        isEditing && announcement
          ? await updateAdminAnnouncement(announcement.id, payload)
          : await createAdminAnnouncement(payload);
      toast.success(isEditing ? "Annonce mise à jour." : isPinned ? "Annonce créée et épinglée." : "Annonce créée (non épinglée).");
      onSaved(saved);
      setOpen(false);
      if (!isEditing) reset();
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer cette annonce."));
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier l'annonce" : "Nouvelle annonce"}</DialogTitle>
          <DialogDescription>
            Seules les annonces épinglées s&apos;affichent, sur le site public et dans le tableau de bord.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="announcement-title">Titre</Label>
            <Input
              id="announcement-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex. Maintenance prévue ce week-end"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="announcement-description">Description</Label>
            <Textarea
              id="announcement-description"
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="announcement-pinned" checked={isPinned} onCheckedChange={setIsPinned} />
            <Label htmlFor="announcement-pinned">Épinglée (visible sur le site et le tableau de bord)</Label>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : isEditing ? "Enregistrer" : "Créer l'annonce"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
