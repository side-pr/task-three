import { queryOptions } from "@tanstack/react-query";
import {
  scheduleGetDetail,
  ScheduleGetDetailPathParams,
} from "./schedule-get-detail";
import { scheduleGetList } from "./schedule-get-list";

export const scheduleQueries = {
  all: () => ["schedules"] as const,
  list: () =>
    queryOptions({
      queryKey: [...scheduleQueries.all(), "list"] as const,
      queryFn: () => scheduleGetList(),
    }),
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
