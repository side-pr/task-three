import { apiRequester, HttpStatus } from "@shared/api";
import { ApiPathParams, ApiResponse } from "@shared/api/openapi/helper";

export const scheduleComplete = async (
  pathParams: ScheduleCompletePathParams
) => {
  const response = await apiRequester.put<ScheduleCompleteResponse>(
    `/api/schedules/${pathParams.scheduleId}/complete`
  );
  return response;
};

export type ScheduleCompletePathParams = ApiPathParams<
  "/api/schedules/{scheduleId}/complete",
  "put"
>;
export type ScheduleCompleteResponse = ApiResponse<
  "/api/schedules/{scheduleId}/complete",
  "put",
  HttpStatus.OK
>;
