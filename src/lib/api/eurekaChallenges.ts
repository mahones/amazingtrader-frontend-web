import { apiClient } from "./client";
import type {
  EurekaChallenge,
  EurekaChallengeAccountCredentials,
  EurekaChallengeFile,
  UserEurekaChallengeLicense,
} from "@/types/eurekaChallenge";

export async function fetchEurekaChallenges() {
  const { data } = await apiClient.get<{ data: EurekaChallenge[] }>("/eureka-challenges");
  return data.data;
}

export async function fetchEurekaChallenge(slug: string) {
  const { data } = await apiClient.get<{ data: EurekaChallenge }>(`/eureka-challenges/${slug}`);
  return data.data;
}

export async function fetchMyEurekaChallengeLicenses() {
  const { data } = await apiClient.get<{ data: UserEurekaChallengeLicense[] }>("/my/eureka-challenge-licenses");
  return data.data;
}

export async function updateEurekaChallengeLicensePurchaseDetails(
  id: number,
  accounts: Array<Pick<EurekaChallengeAccountCredentials, "id" | "password" | "server">>
) {
  const { data } = await apiClient.patch<{ data: UserEurekaChallengeLicense }>(
    `/my/eureka-challenge-licenses/${id}/purchase-details`,
    { accounts }
  );
  return data.data;
}

export async function downloadEurekaChallengeFile(file: EurekaChallengeFile) {
  const { data } = await apiClient.get(`/my/eureka-challenge-files/${file.id}/download`, {
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
