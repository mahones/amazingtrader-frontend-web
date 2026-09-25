"use client";

import { useMemo, useState } from "react";
import { BrokerCard } from "@/components/cards/BrokerCard";
import { cn } from "@/lib/utils";
import type { Broker } from "@/types/broker";

const UNCATEGORIZED_LABEL = "Autres";
const ALL_LABEL = "Toutes";

function groupByCategory(brokers: Broker[]): Map<string, Broker[]> {
  const groups = new Map<string, Broker[]>();
  for (const broker of brokers) {
    const key = broker.category?.trim() || UNCATEGORIZED_LABEL;
    const existing = groups.get(key) ?? [];
    existing.push(broker);
    groups.set(key, existing);
  }
  return groups;
}

export function BrokerCategoryFilter({ brokers }: { brokers: Broker[] }) {
  const groups = useMemo(() => groupByCategory(brokers), [brokers]);
  const categories = useMemo(() => Array.from(groups.keys()), [groups]);
  const [selected, setSelected] = useState<string | null>(null);

  const visibleGroups = selected ? new Map([[selected, groups.get(selected) ?? []]]) : groups;

  return (
    <>
      {categories.length > 1 && (
        <nav
          aria-label="Catégories"
          className="mt-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              selected === null
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-muted/40 hover:border-primary hover:text-primary"
            )}
          >
            {ALL_LABEL}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelected(category)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                selected === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-muted/40 hover:border-primary hover:text-primary"
              )}
            >
              {category}
            </button>
          ))}
        </nav>
      )}

      {visibleGroups.size > 0 ? (
        <div className="mt-12 space-y-10">
          {Array.from(visibleGroups.entries()).map(([category, categoryBrokers]) => (
            <div key={category}>
              <h2 className="text-xl font-bold">{category}</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {categoryBrokers.map((broker) => (
                  <BrokerCard key={broker.id} broker={broker} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-muted-foreground">
          Aucun courtier partenaire pour le moment.
        </p>
      )}
    </>
  );
}
