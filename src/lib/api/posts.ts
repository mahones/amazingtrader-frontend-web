import { apiClient } from "./client";
import type { Post } from "@/types/post";

export async function fetchPosts() {
  const { data } = await apiClient.get<{ data: Post[] }>("/posts");
  return data.data;
}

export async function fetchPost(slug: string) {
  const { data } = await apiClient.get<{ data: Post }>(`/posts/${slug}`);
  return data.data;
}
