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
import { createAdminFaq, updateAdminFaq } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import type { Faq } from "@/types/faq";

export function FaqDialog({
  faq,
  trigger,
  onSaved,
}: {
  faq?: Faq;
  trigger: React.ReactElement;
  onSaved: (faq: Faq) => void;
}) {
  const isEditing = Boolean(faq);

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(faq?.category ?? "");
  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");
  const [position, setPosition] = useState(faq?.position?.toString() ?? "0");
  const [isFeatured, setIsFeatured] = useState(faq?.is_featured ?? false);
  const [isActive, setIsActive] = useState(faq?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function reset() {
    setCategory(faq?.category ?? "");
    setQuestion(faq?.question ?? "");
    setAnswer(faq?.answer ?? "");
    setPosition(faq?.position?.toString() ?? "0");
    setIsFeatured(faq?.is_featured ?? false);
    setIsActive(faq?.is_active ?? true);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const payload: Partial<Faq> = {
      category: category.trim() || null,
      question,
      answer,
      position: Number(position) || 0,
      is_featured: isFeatured,
      is_active: isActive,
    };

    try {
      const saved = isEditing && faq ? await updateAdminFaq(faq.id, payload) : await createAdminFaq(payload);
      toast.success(isEditing ? "Question mise à jour." : "Question créée.");
      onSaved(saved);
      setOpen(false);
      if (!isEditing) reset();
    } catch (err) {
      setError(extractApiError(err, "Impossible d'enregistrer cette question."));
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
          <DialogTitle>{isEditing ? "Modifier la question" : "Nouvelle question"}</DialogTitle>
          <DialogDescription>
            Les questions mises en avant apparaissent sur la page d&apos;accueil, en plus de la page FAQ.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="faq-category">Catégorie</Label>
            <Input
              id="faq-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="ex. Auto-trading, Bots de trading, Formations..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faq-question">Question</Label>
            <Input
              id="faq-question"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="ex. Comment activer ma licence ?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faq-answer">Réponse</Label>
            <Textarea
              id="faq-answer"
              required
              rows={5}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Astuce : collez une URL (https://...) dans le texte, elle s&apos;affichera comme un lien cliquable.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="faq-position">Ordre d&apos;affichage</Label>
            <Input
              id="faq-position"
              type="number"
              min="0"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="faq-featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
            <Label htmlFor="faq-featured">Mettre en avant (visible sur l&apos;accueil)</Label>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="faq-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="faq-active">Visible publiquement</Label>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : isEditing ? "Enregistrer" : "Créer la question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
