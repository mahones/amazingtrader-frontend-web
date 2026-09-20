import { apiClient } from "./client";
import type { CommunityMember, CommunityMessage } from "@/types/community";

export async function fetchCommunityMessages() {
  const { data } = await apiClient.get<{ data: CommunityMessage[] }>("/my/community/messages");
  return data.data;
}

export async function postCommunityMessage(body: string, parentId?: number) {
  const { data } = await apiClient.post<{ data: CommunityMessage }>("/my/community/messages", {
    body,
    parent_id: parentId ?? null,
  });
  return data.data;
}

export async function deleteCommunityMessage(id: number) {
  await apiClient.delete(`/my/community/messages/${id}`);
}

export async function setCommunityReaction(messageId: number, emoji: string) {
  const { data } = await apiClient.put<{ data: CommunityMessage }>(
    `/my/community/messages/${messageId}/reaction`,
    { emoji }
  );
  return data.data;
}

export async function removeCommunityReaction(messageId: number) {
  const { data } = await apiClient.delete<{ data: CommunityMessage }>(
    `/my/community/messages/${messageId}/reaction`
  );
  return data.data;
}

export async function fetchCommunityMembers() {
  const { data } = await apiClient.get<{ data: CommunityMember[] }>("/my/community/members");
  return data.data;
}
