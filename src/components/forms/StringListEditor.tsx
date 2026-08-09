"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  function updateItem(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)));
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, ""]);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(e) => updateItem(index, e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => removeItem(index)}
              aria-label="Supprimer la ligne"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun élément pour le moment.</p>
        )}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="mr-1 size-3.5" /> Ajouter une ligne
      </Button>
    </div>
  );
}
