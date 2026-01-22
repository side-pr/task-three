import { apiRequester, HttpStatus } from "@shared/api";
import { ApiPathParams, ApiResponse } from "@shared/api/openapi/helper";

export const scheduleGetDetail = async (
  pathParams: ScheduleGetDetailPathParams
) => {
  const response = await apiRequester.get<ScheduleGetDetailResponse>(
    `/api/schedules/${pathParams.scheduleId}`
  );
  return response.data.data;
};

export type ScheduleGetDetailPathParams = ApiPathParams<
  "/api/schedules/{taskId}",
  "get"
>;
export type ScheduleGetDetailResponse = ApiResponse<
  "/api/schedules/{taskId}",
  "get",
  HttpStatus.OK
>;
