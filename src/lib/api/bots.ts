import { apiClient } from "./client";
import type { BotAssignment, BotTrade, TradingBot } from "@/types/bot";

export async function fetchTradingBots() {
  const { data } = await apiClient.get<{ data: TradingBot[] }>("/trading-bots");
  return data.data;
}

export async function fetchTradingBot(slug: string) {
  const { data } = await apiClient.get<{ data: TradingBot }>(`/trading-bots/${slug}`);
  return data.data;
}

export async function fetchMyBotAssignments() {
  const { data } = await apiClient.get<{ data: BotAssignment[] }>("/my/bot-assignments");
  return data.data;
}

export async function fetchBotAssignmentTrades(id: number) {
  const { data } = await apiClient.get<{ data: BotTrade[] }>(
    `/my/bot-assignments/${id}/trades`
  );
  return data.data;
}
