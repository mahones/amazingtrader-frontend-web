import { apiClient } from "./client";
import type {
  BarronsChallenge,
  BarronsChallengeAccountCredentials,
  BarronsChallengeFile,
  UserBarronsChallengeLicense,
} from "@/types/barronsChallenge";

export async function fetchBarronsChallenges() {
  const { data } = await apiClient.get<{ data: BarronsChallenge[] }>("/barrons-challenges");
  return data.data;
}

export async function fetchBarronsChallenge(slug: string) {
  const { data } = await apiClient.get<{ data: BarronsChallenge }>(`/barrons-challenges/${slug}`);
  return data.data;
}

export async function fetchMyBarronsChallengeLicenses() {
  const { data } = await apiClient.get<{ data: UserBarronsChallengeLicense[] }>("/my/barrons-challenge-licenses");
  return data.data;
}

export async function updateBarronsChallengeLicensePurchaseDetails(
  id: number,
  accounts: Array<Pick<BarronsChallengeAccountCredentials, "id" | "password" | "server">>
) {
  const { data } = await apiClient.patch<{ data: UserBarronsChallengeLicense }>(
    `/my/barrons-challenge-licenses/${id}/purchase-details`,
    { accounts }
  );
  return data.data;
}

export async function downloadBarronsChallengeFile(file: BarronsChallengeFile) {
  const { data } = await apiClient.get(`/my/barrons-challenge-files/${file.id}/download`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(data as Blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.original_filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
