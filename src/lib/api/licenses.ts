import { apiClient } from "./client";
import type { LicenseAccount, LicensePlan, UserLicense } from "@/types/license";

export async function fetchLicensePlans() {
  const { data } = await apiClient.get<{ data: LicensePlan[] }>("/license-plans");
  return data.data;
}

export async function fetchMyLicenses() {
  const { data } = await apiClient.get<{ data: UserLicense[] }>("/my/licenses");
  return data.data;
}

export async function fetchMyLicense(id: number) {
  const { data } = await apiClient.get<{ data: UserLicense }>(`/my/licenses/${id}`);
  return data.data;
}

export async function updatePurchaseDetails(id: number, accounts: LicenseAccount[]) {
  const { data } = await apiClient.patch<{ data: UserLicense }>(
    `/my/licenses/${id}/purchase-details`,
    { accounts }
  );
  return data.data;
}
