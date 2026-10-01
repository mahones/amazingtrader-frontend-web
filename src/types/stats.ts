export interface TrendPoint {
  date: string;
  value: number;
}

export interface MonthlyPoint {
  month: string;
  value: number;
}

export type StatsPeriod = 7 | 30 | 90;

export interface LicenseDistributionPoint {
  key: string;
  label: string;
  value: number;
}

export type ActivityType = "achat" | "retrait" | "partenaire" | "inscription" | "activation" | "formation_terminee";

export interface ActivityItem {
  type: ActivityType;
  label: string;
  detail: string | null;
  timestamp: string;
}

export interface AdminKpiTrends {
  formations: number | null;
  auto_trading: number | null;
  users: number | null;
}

export interface MyKpiTrends {
  formations: number | null;
  auto_trading: number | null;
  bots: number | null;
}
