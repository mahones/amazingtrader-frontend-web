"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BotForm } from "@/components/forms/BotForm";
import { BotRequirementsManager } from "@/components/forms/BotRequirementsManager";
import { BotPerformanceLinksManager } from "@/components/forms/BotPerformanceLinksManager";
import { BotLicensePlansManager } from "@/components/forms/BotLicensePlansManager";
import { useRequireRole } from "@/hooks/useRequireRole";
import { deleteAdminTradingBot, fetchAdminTradingBot } from "@/lib/api/admin";
import type { TradingBot } from "@/types/bot";

export default function EditBotPage({ params }: { params: Promise<{ id: string }> }) {
  useRequireRole(["admin", "developer"]);
  const { id } = use(params);
  const router = useRouter();
  const [bot, setBot] = useState<TradingBot | null>(null);

  useEffect(() => {
    fetchAdminTradingBot(Number(id)).then(setBot);
  }, [id]);

  async function handleDelete() {
    if (!bot) return;
    if (!window.confirm("Supprimer définitivement ce bot ?")) return;
    await deleteAdminTradingBot(bot.id);
    router.push("/dashboard/bots");
  }

  if (!bot) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Modifier {bot.name}</h1>
          <Link href={`/dashboard/bots/${bot.id}`} className="text-sm text-primary hover:underline">
            Voir les attributions et transactions →
          </Link>
        </div>
        <Button type="button" variant="destructive" onClick={handleDelete}>
          Supprimer
        </Button>
      </div>

      <BotForm bot={bot} onSaved={setBot} />

      <BotRequirementsManager
        botId={bot.id}
        requirements={bot.requirements ?? []}
        onChange={(requirements) => setBot({ ...bot, requirements })}
      />

      <BotPerformanceLinksManager
        botId={bot.id}
        links={bot.performance_links ?? []}
        onChange={(performance_links) => setBot({ ...bot, performance_links })}
      />

      <BotLicensePlansManager
        botId={bot.id}
        plans={bot.license_plans ?? []}
        onChange={(license_plans) => setBot({ ...bot, license_plans })}
      />
    </div>
  );
}
