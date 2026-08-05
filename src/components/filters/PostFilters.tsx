"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  { value: "all", label: "Toutes les catégories" },
  { value: "Forex", label: "Forex" },
  { value: "Crypto", label: "Crypto" },
  { value: "Bourse", label: "Bourse" },
  { value: "Analyse technique", label: "Analyse technique" },
];

export function PostFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Select
      defaultValue={searchParams.get("category") ?? "all"}
      onValueChange={updateParam}
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
  );
}
