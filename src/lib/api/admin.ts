import { apiClient } from "./client";
import type { Course } from "@/types/course";
import type { LicensePlan } from "@/types/license";
import type { TradingBot } from "@/types/bot";
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
  const { data } = await apiClient.post(`/admin/courses/${courseId}/lessons`, payload);
  return data.data;
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

export async function createAdminTradingBot(payload: Partial<TradingBot>) {
  const { data } = await apiClient.post<{ data: TradingBot }>("/admin/trading-bots", payload);
  return data.data;
}

export async function assignBotToUser(botId: number, userId: number) {
  const { data } = await apiClient.post(`/admin/trading-bots/${botId}/assignments`, {
    user_id: userId,
  });
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

export async function createAdminPost(payload: Partial<Post>) {
  const { data } = await apiClient.post<{ data: Post }>("/admin/posts", payload);
  return data.data;
}

export async function updateAdminPost(id: number, payload: Partial<Post>) {
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
