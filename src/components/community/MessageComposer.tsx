"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";

export function MessageComposer({
  onSubmit,
  placeholder = "Publiez quelque chose pour la communauté...",
  submitLabel = "Publier",
  autoFocus = false,
}: {
  onSubmit: (body: string) => Promise<void>;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
}) {
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const trimmed = body.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(trimmed);
      setBody("");
    } catch (error) {
      toast.error(extractApiError(error, "Impossible d'envoyer le message."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={3}
      />
      <div className="flex justify-end">
        <Button size="sm" disabled={!body.trim() || isSubmitting} onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
