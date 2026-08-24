import { apiClient } from "./client";
import type { Course, Enrollment, Lesson } from "@/types/course";
import type { LicensePlan, LicensePurchaseDetails, UserLicense } from "@/types/license";
import type {
  BotAssignment,
  BotAssignmentStatus,
  BotFile,
  BotLicensePlan,
  BotLicensePurchaseDetails,
  BotPerformanceLink,
  BotRequirement,
  BotTrade,
  TradingBot,
  UserBotLicense,
} from "@/types/bot";
import type { Post } from "@/types/post";
import type { User, UserProfile } from "@/types/user";
import type { Broker } from "@/types/broker";

// Courses
export async function fetchAdminCourses() {
  const { data } = await apiClient.get<{ data: Course[] }>("/admin/courses");
  return data.data;
}

export async function fetchAdminCourse(id: number) {
  const { data } = await apiClient.get<{ data: Course }>(`/admin/courses/${id}`);
  return data.data;
}

export async function createAdminCourse(payload: Partial<Course> | FormData) {
  const { data } = await apiClient.post<{ data: Course }>("/admin/courses", payload);
  return data.data;
}

export async function updateAdminCourse(id: number, payload: Partial<Course> | FormData) {
  if (payload instanceof FormData) {
    payload.append("_method", "PUT");
    const { data } = await apiClient.post<{ data: Course }>(`/admin/courses/${id}`, payload);
    return data.data;
  }
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

// Bot files
export async function fetchAdminBotFiles(botId: number) {
  const { data } = await apiClient.get<{ data: BotFile[] }>(`/admin/trading-bots/${botId}/files`);
  return data.data;
}

export async function createAdminBotFiles(botId: number, formData: FormData) {
  const { data } = await apiClient.post<{ data: BotFile[] }>(
    `/admin/trading-bots/${botId}/files`,
    formData
  );
  return data.data;
}

export async function updateAdminBotFile(id: number, payload: { label?: string; position?: number }) {
  const { data } = await apiClient.put<{ data: BotFile }>(`/admin/bot-files/${id}`, payload);
  return data.data;
}

export async function deleteAdminBotFile(id: number) {
  await apiClient.delete(`/admin/bot-files/${id}`);
}

// Users & orders (oversight)
export async function fetchAdminUsers() {
  const { data } = await apiClient.get<{ data: User[] }>("/admin/users");
  return data.data;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export async function fetchAdminUsersPaged(params: {
  search?: string;
  role?: string;
  purchase?: string;
  license_status?: "activated" | "pending";
  is_active?: boolean;
  page?: number;
}) {
  const { data } = await apiClient.get<PaginatedResponse<User>>("/admin/users", { params });
  return data;
}

export async function fetchAdminUserProfile(id: number) {
  const { data } = await apiClient.get<{ data: UserProfile }>(`/admin/users/${id}`);
  return data.data;
}

export async function updateAdminUserStatus(id: number, isActive: boolean) {
  const { data } = await apiClient.patch<{ data: User }>(`/admin/users/${id}/status`, {
    is_active: isActive,
  });
  return data.data;
}

export async function createAdminUser(payload: {
  name: string;
  email: string;
  password: string;
  course_ids?: number[];
  licenses?: Array<{ license_plan_id: number } & Partial<LicensePurchaseDetails>>;
  bot_licenses?: Array<{ bot_license_plan_id: number } & Partial<BotLicensePurchaseDetails>>;
}) {
  const { data } = await apiClient.post<{ data: UserProfile }>("/admin/users", payload);
  return data.data;
}

export async function assignLicenseToUser(
  userId: number,
  payload: { license_plan_id: number; activate?: boolean } & Partial<LicensePurchaseDetails>
) {
  const { data } = await apiClient.post<{ data: UserLicense }>(`/admin/users/${userId}/licenses`, payload);
  return data.data;
}

export async function assignBotLicenseToUser(
  userId: number,
  payload: { bot_license_plan_id: number; activate?: boolean } & Partial<BotLicensePurchaseDetails>
) {
  const { data } = await apiClient.post<{ data: UserBotLicense }>(
    `/admin/users/${userId}/bot-licenses`,
    payload
  );
  return data.data;
}

export async function assignCoursesToUser(userId: number, courseIds: number[]) {
  const { data } = await apiClient.post<{ data: Enrollment[] }>(`/admin/users/${userId}/enrollments`, {
    course_ids: courseIds,
  });
  return data.data;
}

export async function createAdminAccount(payload: { name: string; email: string; password: string }) {
  const { data } = await apiClient.post<{ data: User }>("/admin/admins", payload);
  return data.data;
}

// Brokers
export async function fetchAdminBrokers() {
  const { data } = await apiClient.get<{ data: Broker[] }>("/admin/brokers");
  return data.data;
}

export async function createAdminBroker(payload: FormData) {
  const { data } = await apiClient.post<{ data: Broker }>("/admin/brokers", payload);
  return data.data;
}

export async function updateAdminBroker(id: number, payload: FormData) {
  payload.append("_method", "PUT");
  const { data } = await apiClient.post<{ data: Broker }>(`/admin/brokers/${id}`, payload);
  return data.data;
}

export async function deleteAdminBroker(id: number) {
  await apiClient.delete(`/admin/brokers/${id}`);
}

// License activation
export async function activateUserLicense(id: number) {
  const { data } = await apiClient.patch<{ data: UserLicense }>(`/admin/user-licenses/${id}/activate`);
  return data.data;
}

export async function activateUserBotLicense(id: number) {
  const { data } = await apiClient.patch<{ data: UserBotLicense }>(`/admin/user-bot-licenses/${id}/activate`);
  return data.data;
}

export async function fetchPendingActivationCount() {
  const { data } = await apiClient.get<{ count: number }>("/admin/licenses/pending-count");
  return data.count;
}

// Purchase-details change approval
export async function approveLicensePurchaseDetailsChange(id: number) {
  const { data } = await apiClient.patch<{ data: UserLicense }>(
    `/admin/user-licenses/${id}/purchase-details/approve`
  );
  return data.data;
}

export async function rejectLicensePurchaseDetailsChange(id: number) {
  const { data } = await apiClient.patch<{ data: UserLicense }>(
    `/admin/user-licenses/${id}/purchase-details/reject`
  );
  return data.data;
}

export async function approveBotLicensePurchaseDetailsChange(id: number) {
  const { data } = await apiClient.patch<{ data: UserBotLicense }>(
    `/admin/user-bot-licenses/${id}/purchase-details/approve`
  );
  return data.data;
}

export async function rejectBotLicensePurchaseDetailsChange(id: number) {
  const { data } = await apiClient.patch<{ data: UserBotLicense }>(
    `/admin/user-bot-licenses/${id}/purchase-details/reject`
  );
  return data.data;
}

export async function fetchPendingCredentialsChangeCount() {
  const { data } = await apiClient.get<{ count: number }>("/admin/licenses/pending-credentials-count");
  return data.count;
}
