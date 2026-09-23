import { apiClient } from "./client";
import type { Review } from "@/types/review";

export async function submitReview(payload: { title: string; content: string }) {
  const { data } = await apiClient.post<{ data: Review }>("/my/reviews", payload);
  return data.data;
}
