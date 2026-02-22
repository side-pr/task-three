import type { CohortRow } from "@/pages/dashboard/api/dashboard-get";

type DailyCohortProps = {
  cohort: CohortRow[];
  maxDay: number;
};

const CohortTable = ({
  label,
  labelColor,
  activeCellClass,
  cohort,
  dayHeaders,
  getRegistered,
  getCompleted,
}: {
  label: string;
  labelColor: string;
  activeCellClass: string;
  cohort: CohortRow[];
  dayHeaders: string[];
  getRegistered: (cell: CohortRow["days"][number]) => number;
  getCompleted: (cell: CohortRow["days"][number]) => number;
}) => (
  <div>
    <h3 className={`text-xs font-semibold mb-2 ${labelColor}`}>{label}</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr className="text-gray-500">
            <th className="sticky left-0 bg-gray-50 px-2 py-1 text-left font-medium">
              가입일
            </th>
            <th className="px-2 py-1 text-center font-medium">유저</th>
            {dayHeaders.map((h) => (
              <th key={h} className="px-2 py-1 text-center font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohort.map((row) => (
            <tr key={row.date} className="border-t border-gray-200">
              <td className="sticky left-0 bg-gray-50 px-2 py-1.5 text-gray-700 font-medium whitespace-nowrap">
                {row.date.slice(5)}
              </td>
              <td className="px-2 py-1.5 text-center text-gray-600">
                {row.memberCount}
              </td>
              {dayHeaders.map((_, i) => {
                const cell = row.days[i];
                if (!cell) {
                  return (
                    <td
                      key={i}
                      className="px-2 py-1.5 text-center text-gray-300"
                    >
                      -
                    </td>
                  );
                }
                const registered = getRegistered(cell);
                const completed = getCompleted(cell);
                const hasActivity = registered > 0 || completed > 0;
                return (
                  <td
                    key={i}
                    className={`px-2 py-1.5 text-center whitespace-nowrap font-medium ${
                      hasActivity ? activeCellClass : "text-gray-400"
                    }`}
                  >
                    {registered}/{completed}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const DailyCohort = ({ cohort, maxDay }: DailyCohortProps) => {
  const dayHeaders = Array.from({ length: maxDay + 1 }, (_, i) => `D${i}`);

  return (
    <div className="w-full rounded-2xl bg-gray-50 p-4 flex flex-col gap-6">
      <h2 className="text-sm font-semibold text-gray-700">일별 코호트</h2>

      <CohortTable
        label="Task"
        labelColor="text-blue-600"
        activeCellClass="text-blue-700 bg-blue-50"
        cohort={cohort}
        dayHeaders={dayHeaders}
        getRegistered={(c) => c.taskRegistered}
        getCompleted={(c) => c.taskCompleted}
      />

      <CohortTable
        label="Schedule"
        labelColor="text-green-600"
        activeCellClass="text-green-700 bg-green-50"
        cohort={cohort}
        dayHeaders={dayHeaders}
        getRegistered={(c) => c.scheduleRegistered}
        getCompleted={(c) => c.scheduleCompleted}
      />

      <div className="text-[10px] text-gray-500">
        셀 = 등록 / 완료 &middot; D0 = 가입일
      </div>
    </div>
  );
};
