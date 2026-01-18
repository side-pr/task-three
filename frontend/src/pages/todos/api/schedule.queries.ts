import { queryOptions } from "@tanstack/react-query";
import {
  scheduleGetDetail,
  ScheduleGetDetailPathParams,
} from "./schedule-get-detail";

export const scheduleQueries = {
  all: () => ["schedules"] as const,
  detail: (pathParams: ScheduleGetDetailPathParams) =>
    queryOptions({
      queryKey: [
        ...scheduleQueries.all(),
        "detail",
        pathParams.scheduleId,
      ] as const,
      queryFn: () => scheduleGetDetail(pathParams),
    }),
};
