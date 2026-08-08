"use client";

import { useRouter } from "next/navigation";
import { BotForm } from "@/components/forms/BotForm";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function NewBotPage() {
  useRequireRole(["admin", "developer"]);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Nouveau bot de trading</h1>
      <BotForm onSaved={(bot) => router.push(`/dashboard/bots/${bot.id}/edit`)} />
    </div>
  );
}
