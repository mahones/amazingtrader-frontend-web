"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
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
import { updateMyPartnerCode } from "@/lib/api/partners";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import type { Partner } from "@/types/partner";

export function EditPartnerCodeDialog({
  code,
  onUpdated,
}: {
  code: string;
  onUpdated: (partner: Partner) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(code);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setPending(true);
    setError(null);

    try {
      const partner = await updateMyPartnerCode(value);
      toast.success("Votre code partenaire a été mis à jour.");
      onUpdated(partner);
      setOpen(false);
    } catch (err) {
      setError(extractApiError(err, "Impossible de mettre à jour votre code."));
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setValue(code);
          setError(null);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Personnaliser le code partenaire">
            <Pencil className="size-4" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Personnaliser votre code partenaire</DialogTitle>
          <DialogDescription>
            Choisissez un code mémorable. Ce n&apos;est possible que tant qu&apos;aucun achat ne l&apos;a encore
            utilisé.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partner-code-input">Code partenaire</Label>
            <Input
              id="partner-code-input"
              required
              minLength={4}
              maxLength={16}
              pattern="[A-Za-z0-9]+"
              title="Lettres et chiffres uniquement"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="ex. JEAN2026"
              className="font-mono tracking-wider uppercase"
            />
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
