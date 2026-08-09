"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ImageUploadInput({
  id,
  label,
  value,
  onChange,
  existingUrl,
}: {
  id: string;
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  existingUrl?: string | null;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const displayUrl = previewUrl ?? existingUrl ?? null;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {displayUrl && (
        <div className="relative h-32 w-full overflow-hidden rounded-md border border-border bg-muted sm:w-56">
          {/* eslint-disable-next-line @next/next/no-img-element -- preview of a locally selected file or an already-stored URL */}
          <img src={displayUrl} alt="Aperçu" className="size-full object-cover" />
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="absolute right-1.5 top-1.5 bg-background/90"
            onClick={() => onChange(null)}
            aria-label="Retirer l'image"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      )}
      <Input
        id={id}
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
