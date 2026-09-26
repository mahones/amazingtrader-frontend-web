"use client";

import { useMemo } from "react";
import { BrokerCard } from "@/components/cards/BrokerCard";
import type { Broker } from "@/types/broker";

const UNCATEGORIZED_LABEL = "Autres";

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

  if (groups.size === 0) {
    return (
      <p className="mt-12 text-center text-muted-foreground">Aucun courtier partenaire pour le moment.</p>
    );
  }

  return (
    <div className="mt-12 space-y-10">
      {Array.from(groups.entries()).map(([category, categoryBrokers]) => (
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
  );
}
