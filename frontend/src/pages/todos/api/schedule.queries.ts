import { queryOptions } from "@tanstack/react-query";
import {
  scheduleGetDetail,
  ScheduleGetDetailPathParams,
} from "./schedule-get-detail";
import { scheduleGetList } from "./schedule-get-list";

export const scheduleQueries = {
  all: () => ["schedules"] as const,


  lists: () => [...scheduleQueries.all(), "list"] as const,
  list: (date: string) =>
    queryOptions({
      queryKey: [...scheduleQueries.lists(), date] as const,
      queryFn: () => scheduleGetList(date),
    }),

  details: () => [...scheduleQueries.all(), "detail"] as const,
  detail: (pathParams: ScheduleGetDetailPathParams) =>
    queryOptions({
      queryKey: [
        ...scheduleQueries.details(),
        pathParams.scheduleId,
      ] as const,
      queryFn: () => scheduleGetDetail(pathParams),
    }),
};
