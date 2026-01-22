import { apiRequester, HttpStatus } from "@shared/api";
import { ApiPathParams, ApiResponse } from "@shared/api/openapi/helper";

export const scheduleCancelComplete = async (
  pathParams: ScheduleCancelCompletePathParams
) => {
  const response = await apiRequester.put<ScheduleCancelCompleteResponse>(
    `/api/schedules/${pathParams.scheduleId}/cancel-complete`
  );
  return response;
};

export type ScheduleCancelCompletePathParams = ApiPathParams<
  "/api/schedules/{scheduleId}/cancel-complete",
  "put"
>;
export type ScheduleCancelCompleteResponse = ApiResponse<
  "/api/schedules/{scheduleId}/cancel-complete",
  "put",
  HttpStatus.NO_CONTENT
>;
