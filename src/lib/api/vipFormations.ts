import { apiClient } from "./client";
import type { UserVipFormation, VipFormation } from "@/types/vipFormation";

export async function fetchVipFormations() {
  const { data } = await apiClient.get<{ data: VipFormation[] }>("/vip-formations");
  return data.data;
}

export async function fetchMyVipFormations() {
  const { data } = await apiClient.get<{ data: UserVipFormation[] }>("/my/vip-formations");
  return data.data;
}
