import { apiClient } from "./client";
import type { CommunityAttachment, CommunityMember, CommunityMessage } from "@/types/community";

export async function fetchCommunityMessages() {
  const { data } = await apiClient.get<{ data: CommunityMessage[] }>("/my/community/messages");
  return data.data;
}

export interface PostCommunityMessagePayload {
  body: string;
  parentId?: number;
  linkUrl?: string;
  linkLabel?: string;
  image?: File | null;
  files?: File[];
}

export async function postCommunityMessage(payload: PostCommunityMessagePayload) {
  const formData = new FormData();
  formData.append("body", payload.body);
  if (payload.parentId) formData.append("parent_id", String(payload.parentId));
  if (payload.linkUrl) formData.append("link_url", payload.linkUrl);
  if (payload.linkLabel) formData.append("link_label", payload.linkLabel);
  if (payload.image) formData.append("image", payload.image);
  for (const file of payload.files ?? []) {
    formData.append("files[]", file);
  }

  const { data } = await apiClient.post<{ data: CommunityMessage }>("/my/community/messages", formData);
  return data.data;
}

export async function deleteCommunityMessage(id: number) {
  await apiClient.delete(`/my/community/messages/${id}`);
}

export async function pinCommunityMessage(id: number, pinned: boolean) {
  const { data } = await apiClient.patch<{ data: CommunityMessage }>(`/my/community/messages/${id}/pin`, {
    pinned,
  });
  return data.data;
}

export async function downloadCommunityAttachment(attachment: CommunityAttachment) {
  const { data } = await apiClient.get(`/my/community/attachments/${attachment.id}/download`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(data as Blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = attachment.original_filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
