"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LEVELS = [
  { value: "all", label: "Tous les niveaux" },
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
];

const CATEGORIES = [
  { value: "all", label: "Toutes les catégories" },
  { value: "Forex", label: "Forex" },
  { value: "Crypto", label: "Crypto" },
  { value: "Bourse", label: "Bourse" },
  { value: "Analyse technique", label: "Analyse technique" },
];

export function CourseFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        defaultValue={searchParams.get("level") ?? "all"}
        onValueChange={(value) => updateParam("level", value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Niveau" />
        </SelectTrigger>
        <SelectContent>
          {LEVELS.map((level) => (
            <SelectItem key={level.value} value={level.value}>
              {level.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("category") ?? "all"}
        onValueChange={(value) => updateParam("category", value)}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
