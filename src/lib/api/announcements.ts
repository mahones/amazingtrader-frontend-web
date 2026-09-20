import { apiClient } from "./client";
import type { Announcement } from "@/types/announcement";

export async function fetchPinnedAnnouncements() {
  const { data } = await apiClient.get<{ data: Announcement[] }>("/announcements");
  return data.data;
}
