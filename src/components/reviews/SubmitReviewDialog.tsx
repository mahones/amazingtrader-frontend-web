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
import { submitReview } from "@/lib/api/reviews";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import type { Review } from "@/types/review";

export function SubmitReviewDialog({
  trigger,
  onSubmitted,
}: {
  trigger: React.ReactElement;
  onSubmitted?: (review: Review) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function reset() {
    setTitle("");
    setContent("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const review = await submitReview({ title, content });
      toast.success("Merci pour votre avis !");
      onSubmitted?.(review);
      setOpen(false);
      reset();
    } catch (err) {
      setError(extractApiError(err, "Impossible d'envoyer votre avis."));
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
          <DialogTitle>Laisser un avis</DialogTitle>
          <DialogDescription>
            Partagez votre expérience sur la plateforme. Votre avis est transmis directement à notre équipe.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="review-title">Titre</Label>
            <Input
              id="review-title"
              required
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Résumez votre avis en quelques mots"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-content">Votre avis</Label>
            <Textarea
              id="review-content"
              required
              maxLength={2000}
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Dites-nous ce que vous pensez du fonctionnement de la plateforme..."
            />
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Envoi..." : "Envoyer mon avis"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
