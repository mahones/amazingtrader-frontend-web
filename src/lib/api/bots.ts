import { apiClient } from "./client";
import type {
  BotAssignment,
  BotFile,
  BotLicenseAccount,
  BotTrade,
  TradingBot,
  UserBotLicense,
} from "@/types/bot";

export async function fetchTradingBots() {
  const { data } = await apiClient.get<{ data: TradingBot[] }>("/trading-bots");
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

export async function fetchMyBotLicense(id: number) {
  const { data } = await apiClient.get<{ data: UserBotLicense }>(`/my/bot-licenses/${id}`);
  return data.data;
}

export async function updateBotLicensePurchaseDetails(id: number, accounts: BotLicenseAccount[]) {
  const { data } = await apiClient.patch<{ data: UserBotLicense }>(
    `/my/bot-licenses/${id}/purchase-details`,
    { accounts }
  );
  return data.data;
}

export async function downloadTradingBotFile(botFile: BotFile) {
  const { data } = await apiClient.get(`/my/trading-bot-files/${botFile.id}/download`, {
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
