import { apiClient } from "./client";
import type { Partner } from "@/types/partner";
import type { Withdrawal } from "@/types/withdrawal";

export async function applyForPartnerProgram() {
  const { data } = await apiClient.post<{ data: Partner }>("/my/partner/apply");
  return data.data;
}

export async function fetchMyPartnerProfile() {
  const { data } = await apiClient.get<{ data: Partner | null }>("/my/partner");
  return data.data;
}

export async function updateMyPartnerCode(code: string) {
  const { data } = await apiClient.patch<{ data: Partner }>("/my/partner/code", { code });
  return data.data;
}

export async function fetchMyWithdrawals() {
  const { data } = await apiClient.get<{ data: Withdrawal[] }>("/my/partner/withdrawals");
  return data.data;
}

export async function requestWithdrawal(payload: {
  amount: number;
  payment_method: string;
  receiving_identifier: string;
}) {
  const { data } = await apiClient.post<{ data: Withdrawal }>("/my/partner/withdrawals", payload);
  return data.data;
}
