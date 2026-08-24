"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OTHER_COUNTRIES, PRIORITY_COUNTRIES, combineWhatsappNumber, splitWhatsappNumber } from "@/lib/country-codes";

/**
 * Numéro WhatsApp saisi en deux parties (indicatif pays + numéro local) mais
 * exposé au parent comme une seule chaîne combinée (même format que la donnée
 * stockée côté API dans purchase_details.whatsapp_number).
 */
export function WhatsappNumberField({
  idPrefix,
  label = "Numéro WhatsApp",
  value,
  onChange,
  required = false,
}: {
  idPrefix: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const [{ dial, number }, setParts] = useState(() => splitWhatsappNumber(value));

  function update(nextDial: string, nextNumber: string) {
    setParts({ dial: nextDial, number: nextNumber });
    onChange(combineWhatsappNumber(nextDial, nextNumber));
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`${idPrefix}-number`}>{label}</Label>
      <div className="flex gap-2">
        <Select
          items={[...PRIORITY_COUNTRIES, ...OTHER_COUNTRIES].map((c) => ({ value: c.dial, label: `${c.dial} ${c.name}` }))}
          value={dial}
          onValueChange={(v) => update(v ?? "", number)}
          required={required}
        >
          <SelectTrigger
            id={`${idPrefix}-dial`}
            className="w-32 shrink-0"
            aria-label="Indicatif du pays"
          >
            <SelectValue placeholder="Indicatif" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fréquents</SelectLabel>
              {PRIORITY_COUNTRIES.map((c) => (
                <SelectItem key={c.iso2} value={c.dial}>
                  {c.dial} {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Tous les pays</SelectLabel>
              {OTHER_COUNTRIES.map((c) => (
                <SelectItem key={c.iso2} value={c.dial}>
                  {c.dial} {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          id={`${idPrefix}-number`}
          type="tel"
          inputMode="tel"
          placeholder="0102030405"
          value={number}
          onChange={(e) => update(dial, e.target.value)}
          required={required}
          className="flex-1"
        />
      </div>
    </div>
  );
}
