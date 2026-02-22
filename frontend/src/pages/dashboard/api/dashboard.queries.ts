import { queryOptions } from "@tanstack/react-query";
import { dashboardGet } from "@/pages/dashboard/api/dashboard-get";

export const dashboardQueries = {
  all: () => ["dashboard"] as const,

  data: () =>
    queryOptions({
      queryKey: dashboardQueries.all(),
      queryFn: () => dashboardGet(),
    }),
};
