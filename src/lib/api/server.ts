import type { Course } from "@/types/course";
import type { LicensePlan } from "@/types/license";
import type { TradingBot } from "@/types/bot";
import type { Post } from "@/types/post";
import type { Broker } from "@/types/broker";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  return res.json();
}

export async function getCourses(params?: { level?: string; category?: string }) {
  const entries = Object.entries(params ?? {}).filter(
    (entry): entry is [string, string] => Boolean(entry[1])
  );
  const query = new URLSearchParams(entries).toString();
  const { data } = await getJson<{ data: Course[] }>(`/courses${query ? `?${query}` : ""}`);
  return data;
}

export async function getCourse(slug: string) {
  const { data } = await getJson<{ data: Course }>(`/courses/${slug}`);
  return data;
}

export async function getLicensePlans() {
  const { data } = await getJson<{ data: LicensePlan[] }>("/license-plans");
  return data;
}

export async function getTradingBots() {
  const { data } = await getJson<{ data: TradingBot[] }>("/trading-bots");
  return data;
}

export async function getTradingBot(slug: string) {
  const { data } = await getJson<{ data: TradingBot }>(`/trading-bots/${slug}`);
  return data;
}

export async function getBrokers() {
  const { data } = await getJson<{ data: Broker[] }>("/brokers");
  return data;
}

export async function getPosts(params?: { category?: string }) {
  const entries = Object.entries(params ?? {}).filter(
    (entry): entry is [string, string] => Boolean(entry[1])
  );
  const query = new URLSearchParams(entries).toString();
  const { data } = await getJson<{ data: Post[] }>(`/posts${query ? `?${query}` : ""}`);
  return data;
}

export async function getPost(slug: string) {
  const { data } = await getJson<{ data: Post }>(`/posts/${slug}`);
  return data;
}
