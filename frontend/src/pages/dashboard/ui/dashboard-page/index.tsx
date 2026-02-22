"use client";

import { useRouter } from "next/navigation";
import { SuspenseQuery } from "@suspensive/react-query";
import { dashboardQueries } from "@/pages/dashboard/api/dashboard.queries";
import { DailyCohort } from "@/pages/dashboard/ui/daily-cohort";

export const DashboardPage = () => {
  const router = useRouter();

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

        <SuspenseQuery {...dashboardQueries.data()}>
          {({ data }) => (
            <DailyCohort cohort={data.cohort} maxDay={data.maxDay} />
          )}
        </SuspenseQuery>
      </div>
    </main>
  );
};
