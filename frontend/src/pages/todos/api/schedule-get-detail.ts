import { apiRequester, HttpStatus, ServiceApiResponse } from "@shared/api";
import { ApiPathParams, ApiResponse } from "@shared/api/openapi/helper";

export const scheduleGetDetail = async (
  pathParams: ScheduleGetDetailPathParams
) => {
  const response = await apiRequester.get<ServiceApiResponse<ScheduleGetDetailResponse>>(
    `/api/schedules/${pathParams.scheduleId}`
  );
  return response.data.data;
};

export type ScheduleGetDetailPathParams = ApiPathParams<
  "/api/schedules/{scheduleId}",
  "get"
>;
export type ScheduleGetDetailResponse = ApiResponse<
  "/api/schedules/{scheduleId}",
  "get",
  HttpStatus.OK
>;
