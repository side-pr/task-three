import { apiRequester, ServiceApiResponse } from "@shared/api";

export interface DailyStats {
  taskTotal: number;
  taskCompleted: number;
  taskCompletionRate: number;
  scheduleTotal: number;
  scheduleCompleted: number;
  scheduleCompletionRate: number;
}

export interface CohortCell {
  taskRegistered: number;
  taskCompleted: number;
  scheduleRegistered: number;
  scheduleCompleted: number;
}

export interface CohortRow {
  date: string;
  memberCount: number;
  days: CohortCell[];
}

export interface MemberCohortRow {
  label: string;
  signupDate: string;
  days: CohortCell[];
}

export interface DashboardGetResponse {
  dailyStats: DailyStats;
  cohort: CohortRow[];
  maxDay: number;
  memberCohort: MemberCohortRow[];
  memberCohortMaxDay: number;
}

export const dashboardGet = async () => {
  const response = await apiRequester.get<
    ServiceApiResponse<DashboardGetResponse>
  >("/api/dashboard");
  return response.data.data;
};
