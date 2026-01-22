import { apiRequester, HttpStatus } from "@shared/api";
import { ApiPathParams, ApiResponse } from "@shared/api/openapi/helper";

export const scheduleDelete = async (
  pathParams: ScheduleDeletePathParams
) => {
  const response = await apiRequester.delete<ScheduleDeleteResponse>(
    `/api/schedules/${pathParams.scheduleId}`
  );
  return response;
};

export type ScheduleDeletePathParams = ApiPathParams<
  "/api/schedules/{scheduleId}",
  "delete"
>;
export type ScheduleDeleteResponse = ApiResponse<
  "/api/schedules/{scheduleId}",
  "delete",
  HttpStatus.NO_CONTENT
>;
