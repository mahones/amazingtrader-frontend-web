import { apiClient } from "./client";
import type {
  ActivityItem,
  AdminKpiTrends,
  LicenseDistributionPoint,
  MonthlyPoint,
  MyKpiTrends,
  StatsPeriod,
  TrendPoint,
} from "@/types/stats";

export async function fetchAdminRevenueStats(period: StatsPeriod) {
  const { data } = await apiClient.get<{ data: TrendPoint[] }>("/admin/stats/revenue", {
    params: { period },
  });
  return data.data;
}

export async function fetchAdminRegistrationStats() {
  const { data } = await apiClient.get<{ data: MonthlyPoint[] }>("/admin/stats/registrations");
  return data.data;
}

export async function fetchMyBotPerformanceStats(period: StatsPeriod) {
  const { data } = await apiClient.get<{ data: TrendPoint[] }>("/my/stats/bot-performance", {
    params: { period },
  });
  return data.data;
}

export async function fetchMyEnrollmentStats() {
  const { data } = await apiClient.get<{ data: MonthlyPoint[] }>("/my/stats/enrollments");
  return data.data;
}

export async function fetchAdminLicenseDistribution() {
  const { data } = await apiClient.get<{ data: LicenseDistributionPoint[] }>("/admin/stats/license-distribution");
  return data.data;
}

export async function fetchAdminRecentActivity() {
  const { data } = await apiClient.get<{ data: ActivityItem[] }>("/admin/stats/recent-activity");
  return data.data;
}

export async function fetchMyLicenseDistribution() {
  const { data } = await apiClient.get<{ data: LicenseDistributionPoint[] }>("/my/stats/license-distribution");
  return data.data;
}

export async function fetchMyRecentActivity() {
  const { data } = await apiClient.get<{ data: ActivityItem[] }>("/my/stats/recent-activity");
  return data.data;
}

export async function fetchAdminKpiTrends() {
  const { data } = await apiClient.get<{ data: AdminKpiTrends }>("/admin/stats/kpi-trends");
  return data.data;
}

export async function fetchMyKpiTrends() {
  const { data } = await apiClient.get<{ data: MyKpiTrends }>("/my/stats/kpi-trends");
  return data.data;
}
