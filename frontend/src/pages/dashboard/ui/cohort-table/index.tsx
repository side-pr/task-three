import type { ReactNode } from "react";
import type { CohortCell } from "@/pages/dashboard/api/dashboard-get";

type Column<T> = {
  header: string;
  sticky?: boolean;
  render: (row: T) => ReactNode;
};

type CohortTableProps<T> = {
  label: string;
  labelColor: string;
  activeCellClass: string;
  rows: T[];
  columns: Column<T>[];
  dayHeaders: string[];
  getDays: (row: T) => (CohortCell | null)[];
  getRegistered: (cell: CohortCell) => number;
  getCompleted: (cell: CohortCell) => number;
  rowKey: (row: T) => string;
};

export const CohortTable = <T,>({
  label,
  labelColor,
  activeCellClass,
  rows,
  columns,
  dayHeaders,
  getDays,
  getRegistered,
  getCompleted,
  rowKey,
}: CohortTableProps<T>) => (
  <div>
    <h3 className={`text-xs font-semibold mb-2 ${labelColor}`}>{label}</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr className="text-gray-500">
            {columns.map((col) => (
              <th
                key={col.header}
                className={`px-2 py-1 text-${col.sticky ? "left" : "center"} font-medium ${
                  col.sticky ? "sticky left-0 bg-gray-50" : ""
                }`}
              >
                {col.header}
              </th>
            ))}
            {dayHeaders.map((h) => (
              <th key={h} className="px-2 py-1 text-center font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-t border-gray-200">
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={`px-2 py-1.5 font-medium whitespace-nowrap ${
                    col.sticky
                      ? "sticky left-0 bg-gray-50 text-gray-700"
                      : "text-center text-gray-600"
                  }`}
                >
                  {col.render(row)}
                </td>
              ))}
              {dayHeaders.map((_, i) => {
                const days = getDays(row);
                const cell = days[i];
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
