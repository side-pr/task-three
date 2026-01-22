import { apiRequester, HttpStatus } from "@shared/api";
import {
  ApiPathParams,
  ApiRequest,
  ApiResponse,
} from "@shared/api/openapi/helper";

export const scheduleUpdate = async (
  pathParams: ScheduleUpdatePathParams,
  formData: ScheduleUpdateRequest
) => {
  const response = await apiRequester.put<ScheduleUpdateResponse>(
    `/api/schedules/${pathParams.scheduleId}`,
    formData
  );
  return response;
};

export type ScheduleUpdateRequest = ApiRequest<
  "/api/schedules/{scheduleId}",
  "put"
>;
export type ScheduleUpdateResponse = ApiResponse<
  "/api/schedules/{scheduleId}",
  "put",
  HttpStatus.CREATED
>;
export type ScheduleUpdatePathParams = ApiPathParams<
  "/api/schedules/{scheduleId}",
  "put"
>;
