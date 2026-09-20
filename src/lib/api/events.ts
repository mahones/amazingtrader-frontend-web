import { apiClient } from "./client";
import type { Event } from "@/types/event";

export async function fetchEvents() {
  const { data } = await apiClient.get<{ data: Event[] }>("/events");
  return data.data;
}

export async function fetchEvent(slug: string) {
  const { data } = await apiClient.get<{ data: Event }>(`/events/${slug}`);
  return data.data;
}
