"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BotForm } from "@/components/forms/BotForm";
import { BotRequirementsManager } from "@/components/forms/BotRequirementsManager";
import { BotInstructionsManager } from "@/components/forms/BotInstructionsManager";
import { BotPerformanceLinksManager } from "@/components/forms/BotPerformanceLinksManager";
import { BotLicensePlansManager } from "@/components/forms/BotLicensePlansManager";
import { useRequireRole } from "@/hooks/useRequireRole";
import { deleteAdminTradingBot, fetchAdminTradingBot } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import type { TradingBot } from "@/types/bot";

export default function EditBotPage({ params }: { params: Promise<{ id: string }> }) {
  useRequireRole(["admin", "developer"]);
  const { id } = use(params);
  const router = useRouter();
  const [bot, setBot] = useState<TradingBot | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminTradingBot(Number(id)).then(setBot);
  }, [id]);

  async function handleDelete() {
    if (!bot) return;
    if (!window.confirm("Supprimer définitivement ce bot ?")) return;
    setError(null);
    try {
      await deleteAdminTradingBot(bot.id);
      router.push("/dashboard/bots");
    } catch (err) {
      setError(extractApiError(err, "Impossible de supprimer ce bot."));
    }
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
        <Tooltip>
          <TooltipTrigger render={<span tabIndex={bot.has_active_subscribers ? 0 : undefined} />}>
            <Button type="button" variant="destructive" disabled={bot.has_active_subscribers} onClick={handleDelete}>
              Supprimer
            </Button>
          </TooltipTrigger>
          {bot.has_active_subscribers && (
            <TooltipContent>
              Ce produit ne peut pas être supprimé car des utilisateurs y sont inscrits.
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <BotRequirementsManager
        botId={bot.id}
        requirements={bot.requirements ?? []}
        onChange={(requirements) => setBot({ ...bot, requirements })}
      />

      <BotInstructionsManager
        botId={bot.id}
        instructions={bot.bot_instructions ?? []}
        onChange={(bot_instructions) => setBot({ ...bot, bot_instructions })}
      />

      <BotPerformanceLinksManager
        botId={bot.id}
        links={bot.performance_links ?? []}
        onChange={(performance_links) => setBot({ ...bot, performance_links })}
      />

      <BotLicensePlansManager
        botId={bot.id}
        botSlug={bot.slug}
        plans={bot.license_plans ?? []}
        onChange={(license_plans) => setBot({ ...bot, license_plans })}
      />

      <BotForm bot={bot} onSaved={setBot} />
    </div>
  );
}
