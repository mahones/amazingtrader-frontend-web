import { apiClient } from "./client";
import type { Faq } from "@/types/faq";

export async function fetchFaqs(params?: { category?: string; featured?: boolean; eureka?: boolean }) {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.featured) query.set("featured", "1");
  if (params?.eureka) query.set("eureka", "1");
  const qs = query.toString();
  const { data } = await apiClient.get<{ data: Faq[] }>(`/faqs${qs ? `?${qs}` : ""}`);
  return data.data;
}
