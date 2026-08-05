import { apiClient } from "./client";
import type { LicensePlan, UserLicense } from "@/types/license";

export async function fetchLicensePlans() {
  const { data } = await apiClient.get<{ data: LicensePlan[] }>("/license-plans");
  return data.data;
}

export async function fetchLicensePlan(slug: string) {
  const { data } = await apiClient.get<{ data: LicensePlan }>(`/license-plans/${slug}`);
  return data.data;
}

export async function fetchMyLicenses() {
  const { data } = await apiClient.get<{ data: UserLicense[] }>("/my/licenses");
  return data.data;
}

export async function updateBrokerConfig(id: number, brokerConfig: Record<string, unknown>) {
  const { data } = await apiClient.patch<{ data: UserLicense }>(
    `/my/licenses/${id}/broker-config`,
    { broker_config: brokerConfig }
  );
  return data.data;
}
