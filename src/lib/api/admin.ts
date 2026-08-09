import { apiClient } from "./client";
import type { Course, Lesson } from "@/types/course";
import type { LicensePlan } from "@/types/license";
import type {
  BotAssignment,
  BotAssignmentStatus,
  BotLicensePlan,
  BotPerformanceLink,
  BotRequirement,
  BotTrade,
  TradingBot,
} from "@/types/bot";
import type { Post } from "@/types/post";
import type { User } from "@/types/user";

// Courses
export async function fetchAdminCourses() {
  const { data } = await apiClient.get<{ data: Course[] }>("/admin/courses");
  return data.data;
}

export async function fetchAdminCourse(id: number) {
  const { data } = await apiClient.get<{ data: Course }>(`/admin/courses/${id}`);
  return data.data;
}

export async function createAdminCourse(payload: Partial<Course>) {
  const { data } = await apiClient.post<{ data: Course }>("/admin/courses", payload);
  return data.data;
}

export async function updateAdminCourse(id: number, payload: Partial<Course>) {
  const { data } = await apiClient.put<{ data: Course }>(`/admin/courses/${id}`, payload);
  return data.data;
}

export async function deleteAdminCourse(id: number) {
  await apiClient.delete(`/admin/courses/${id}`);
}

export async function createAdminLesson(courseId: number, payload: Record<string, unknown>) {
  const { data } = await apiClient.post<{ data: Lesson }>(`/admin/courses/${courseId}/lessons`, payload);
  return data.data;
}

export async function updateAdminLesson(id: number, payload: Record<string, unknown>) {
  const { data } = await apiClient.put<{ data: Lesson }>(`/admin/lessons/${id}`, payload);
  return data.data;
}

export async function deleteAdminLesson(id: number) {
  await apiClient.delete(`/admin/lessons/${id}`);
}

// License plans
export async function fetchAdminLicensePlans() {
  const { data } = await apiClient.get<{ data: LicensePlan[] }>("/admin/license-plans");
  return data.data;
}

export async function createAdminLicensePlan(payload: Partial<LicensePlan>) {
  const { data } = await apiClient.post<{ data: LicensePlan }>("/admin/license-plans", payload);
  return data.data;
}

export async function updateAdminLicensePlan(id: number, payload: Partial<LicensePlan>) {
  const { data } = await apiClient.put<{ data: LicensePlan }>(`/admin/license-plans/${id}`, payload);
  return data.data;
}

export async function deleteAdminLicensePlan(id: number) {
  await apiClient.delete(`/admin/license-plans/${id}`);
}

// Trading bots
export async function fetchAdminTradingBots() {
  const { data } = await apiClient.get<{ data: TradingBot[] }>("/admin/trading-bots");
  return data.data;
}

export async function fetchAdminTradingBot(id: number) {
  const { data } = await apiClient.get<{ data: TradingBot }>(`/admin/trading-bots/${id}`);
  return data.data;
}

export async function createAdminTradingBot(payload: Partial<TradingBot> | FormData) {
  const { data } = await apiClient.post<{ data: TradingBot }>("/admin/trading-bots", payload);
  return data.data;
}

export async function updateAdminTradingBot(id: number, payload: Partial<TradingBot> | FormData) {
  if (payload instanceof FormData) {
    payload.append("_method", "PUT");
    const { data } = await apiClient.post<{ data: TradingBot }>(`/admin/trading-bots/${id}`, payload);
    return data.data;
  }
  const { data } = await apiClient.put<{ data: TradingBot }>(`/admin/trading-bots/${id}`, payload);
  return data.data;
}

export async function deleteAdminTradingBot(id: number) {
  await apiClient.delete(`/admin/trading-bots/${id}`);
}

export async function fetchAdminBotAssignments(botId: number) {
  const { data } = await apiClient.get<{ data: BotAssignment[] }>(
    `/admin/trading-bots/${botId}/assignments`
  );
  return data.data;
}

export async function assignBotToUser(botId: number, userId: number) {
  const { data } = await apiClient.post<{ data: BotAssignment }>(
    `/admin/trading-bots/${botId}/assignments`,
    { user_id: userId }
  );
  return data.data;
}

export async function updateAdminBotAssignment(id: number, status: BotAssignmentStatus) {
  const { data } = await apiClient.put<{ data: BotAssignment }>(`/admin/bot-assignments/${id}`, {
    status,
  });
  return data.data;
}

// Bot requirements
export async function createAdminBotRequirement(botId: number, payload: Partial<BotRequirement>) {
  const { data } = await apiClient.post<{ data: BotRequirement }>(
    `/admin/trading-bots/${botId}/requirements`,
    payload
  );
  return data.data;
}

export async function updateAdminBotRequirement(id: number, payload: Partial<BotRequirement>) {
  const { data } = await apiClient.put<{ data: BotRequirement }>(`/admin/bot-requirements/${id}`, payload);
  return data.data;
}

export async function deleteAdminBotRequirement(id: number) {
  await apiClient.delete(`/admin/bot-requirements/${id}`);
}

// Bot performance links
export async function createAdminBotPerformanceLink(
  botId: number,
  payload: Partial<BotPerformanceLink>
) {
  const { data } = await apiClient.post<{ data: BotPerformanceLink }>(
    `/admin/trading-bots/${botId}/performance-links`,
    payload
  );
  return data.data;
}

export async function updateAdminBotPerformanceLink(id: number, payload: Partial<BotPerformanceLink>) {
  const { data } = await apiClient.put<{ data: BotPerformanceLink }>(
    `/admin/bot-performance-links/${id}`,
    payload
  );
  return data.data;
}

export async function deleteAdminBotPerformanceLink(id: number) {
  await apiClient.delete(`/admin/bot-performance-links/${id}`);
}

// Bot license plans
export async function createAdminBotLicensePlan(botId: number, payload: Partial<BotLicensePlan>) {
  const { data } = await apiClient.post<{ data: BotLicensePlan }>(
    `/admin/trading-bots/${botId}/license-plans`,
    payload
  );
  return data.data;
}

export async function updateAdminBotLicensePlan(id: number, payload: Partial<BotLicensePlan>) {
  const { data } = await apiClient.put<{ data: BotLicensePlan }>(`/admin/bot-license-plans/${id}`, payload);
  return data.data;
}

export async function deleteAdminBotLicensePlan(id: number) {
  await apiClient.delete(`/admin/bot-license-plans/${id}`);
}

export async function createAdminBotTrade(
  assignmentId: number,
  payload: {
    pair: string;
    direction: "buy" | "sell";
    entry_price: number;
    exit_price?: number | null;
    profit_loss?: number | null;
    opened_at: string;
    closed_at?: string | null;
  }
) {
  const { data } = await apiClient.post<{ data: BotTrade }>(
    `/admin/bot-assignments/${assignmentId}/trades`,
    payload
  );
  return data.data;
}

// Posts
export async function fetchAdminPosts() {
  const { data } = await apiClient.get<{ data: Post[] }>("/admin/posts");
  return data.data;
}

export async function fetchAdminPost(id: number) {
  const { data } = await apiClient.get<{ data: Post }>(`/admin/posts/${id}`);
  return data.data;
}

export async function createAdminPost(payload: Partial<Post> | FormData) {
  const { data } = await apiClient.post<{ data: Post }>("/admin/posts", payload);
  return data.data;
}

export async function updateAdminPost(id: number, payload: Partial<Post> | FormData) {
  if (payload instanceof FormData) {
    payload.append("_method", "PUT");
    const { data } = await apiClient.post<{ data: Post }>(`/admin/posts/${id}`, payload);
    return data.data;
  }
  const { data } = await apiClient.put<{ data: Post }>(`/admin/posts/${id}`, payload);
  return data.data;
}

export async function deleteAdminPost(id: number) {
  await apiClient.delete(`/admin/posts/${id}`);
}

// Users & orders (oversight)
export async function fetchAdminUsers() {
  const { data } = await apiClient.get<{ data: User[] }>("/admin/users");
  return data.data;
}
