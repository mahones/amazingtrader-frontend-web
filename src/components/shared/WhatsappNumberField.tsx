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
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { OTHER_COUNTRIES, PRIORITY_COUNTRIES, combineWhatsappNumber, splitWhatsappNumber } from "@/lib/country-codes";

/** Drapeau en image (les emojis de drapeaux ne s'affichent pas sous Windows). */
function Flag({ iso2 }: { iso2: string }) {
  const code = iso2.toLowerCase();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w80/${code}.png`}
      srcSet={`https://flagcdn.com/w160/${code}.png 2x`}
      alt=""
      width={28}
      height={21}
      className="h-[21px] w-7 shrink-0 rounded-[2px] object-cover"
    />
  );
}

/**
 * Numéro WhatsApp saisi en deux parties (indicatif pays + numéro local) mais
 * exposé au parent comme une seule chaîne combinée (même format que
 * `User.whatsapp_number` côté API).
 */
export function WhatsappNumberField({
  idPrefix,
  label = "Numéro WhatsApp",
  value,
  onChange,
  required = false,
  fieldClassName,
}: {
  idPrefix: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  /** Classes appliquées à l'indicatif et au numéro (ex. style des écrans d'authentification). */
  fieldClassName?: string;
}) {
  const [{ dial, number }, setParts] = useState(() => splitWhatsappNumber(value));

  function update(nextDial: string, nextNumber: string) {
    setParts({ dial: nextDial, number: nextNumber });
    onChange(combineWhatsappNumber(nextDial, nextNumber));
  }

  const selected = [...PRIORITY_COUNTRIES, ...OTHER_COUNTRIES].find((c) => c.dial === dial);

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
            className={cn("w-20 shrink-0", fieldClassName)}
            aria-label="Indicatif du pays"
          >
            {selected ? (
              <Flag iso2={selected.iso2} />
            ) : (
              <span className="text-muted-foreground">Pays</span>
            )}
          </SelectTrigger>
          <SelectContent className="min-w-24">
            <SelectGroup>
              <SelectLabel>Fréquents</SelectLabel>
              {PRIORITY_COUNTRIES.map((c) => (
                <SelectItem key={c.iso2} value={c.dial}>
                  <span title={`${c.name} ${c.dial}`}>
                    <Flag iso2={c.iso2} />
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Tous les pays</SelectLabel>
              {OTHER_COUNTRIES.map((c) => (
                <SelectItem key={c.iso2} value={c.dial}>
                  <span title={`${c.name} ${c.dial}`}>
                    <Flag iso2={c.iso2} />
                  </span>
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
          className={cn("flex-1", fieldClassName)}
        />
      </div>
    </div>
  );
}
