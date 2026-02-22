"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SuspenseQuery } from "@suspensive/react-query";
import { dashboardQueries } from "@/pages/dashboard/api/dashboard.queries";
import { DailyCohort } from "@/pages/dashboard/ui/daily-cohort";
import { MemberCohort } from "@/pages/dashboard/ui/member-cohort";

type CohortTab = "daily" | "member";

export const DashboardPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CohortTab>("daily");

  return (
    <main className="w-full min-w-[360px] h-full flex flex-col items-center pt-4">
      <div className="w-full h-full flex flex-col items-center gap-6 px-6">
        <div className="w-full flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            &larr; 돌아가기
          </button>
          <h1 className="text-lg font-bold text-gray-900">대시보드</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "daily"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            일별 코호트
          </button>
          <button
            onClick={() => setActiveTab("member")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "member"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            멤버별 코호트
          </button>
        </div>

        <SuspenseQuery {...dashboardQueries.data()}>
          {({ data }) =>
            activeTab === "daily" ? (
              <DailyCohort cohort={data.cohort} maxDay={data.maxDay} />
            ) : (
              <MemberCohort
                memberCohort={data.memberCohort}
                memberCohortMaxDay={data.memberCohortMaxDay}
              />
            )
          }
        </SuspenseQuery>
      </div>
    </main>
  );
};
