import { apiClient } from "./client";
import type {
  BotAssignment,
  BotFile,
  BotLicensePurchaseDetails,
  BotTrade,
  TradingBot,
  UserBotLicense,
} from "@/types/bot";

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

export async function fetchMyBotLicenses() {
  const { data } = await apiClient.get<{ data: UserBotLicense[] }>("/my/bot-licenses");
  return data.data;
}

export async function updateBotLicensePurchaseDetails(
  id: number,
  details: BotLicensePurchaseDetails
) {
  const { data } = await apiClient.patch<{ data: UserBotLicense }>(
    `/my/bot-licenses/${id}/purchase-details`,
    details
  );
  return data.data;
}

export async function downloadBotFile(botFile: BotFile) {
  const { data } = await apiClient.get(`/my/bot-files/${botFile.id}/download`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(data as Blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = botFile.original_filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
