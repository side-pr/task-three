import type { MemberCohortRow } from "@/pages/dashboard/api/dashboard-get";
import { CohortTable } from "@/pages/dashboard/ui/cohort-table";

type MemberCohortProps = {
  memberCohort: MemberCohortRow[];
  memberCohortMaxDay: number;
};

export const MemberCohort = ({
  memberCohort,
  memberCohortMaxDay,
}: MemberCohortProps) => {
  const dayHeaders = Array.from(
    { length: memberCohortMaxDay + 1 },
    (_, i) => `D${i}`,
  );

  return (
    <div className="w-full rounded-2xl bg-gray-50 p-4 flex flex-col gap-6">
      <h2 className="text-sm font-semibold text-gray-700">멤버별 코호트</h2>

      <CohortTable
        label="Task"
        labelColor="text-blue-600"
        activeCellClass="text-blue-700 bg-blue-50"
        rows={memberCohort}
        columns={[
          {
            header: "멤버",
            sticky: true,
            render: (row) => row.label,
          },
          { header: "가입일", render: (row) => row.signupDate.slice(5) },
        ]}
        dayHeaders={dayHeaders}
        getDays={(row) => row.days}
        getRegistered={(c) => c.taskRegistered}
        getCompleted={(c) => c.taskCompleted}
        rowKey={(row) => row.label}
      />

      <CohortTable
        label="Schedule"
        labelColor="text-green-600"
        activeCellClass="text-green-700 bg-green-50"
        rows={memberCohort}
        columns={[
          {
            header: "멤버",
            sticky: true,
            render: (row) => row.label,
          },
          { header: "가입일", render: (row) => row.signupDate.slice(5) },
        ]}
        dayHeaders={dayHeaders}
        getDays={(row) => row.days}
        getRegistered={(c) => c.scheduleRegistered}
        getCompleted={(c) => c.scheduleCompleted}
        rowKey={(row) => row.label}
      />

      <div className="text-[10px] text-gray-500">
        셀 = 등록 / 완료 &middot; D0 = 가입일
      </div>
    </div>
  );
};
