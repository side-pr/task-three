import { apiRequester, HttpStatus } from "@shared/api";
import { ApiRequest, ApiResponse } from "@shared/api/openapi/helper";

export const scheduleCreate = async (formData: ScheduleCreateRequest) => {
  const response = await apiRequester.post<ScheduleCreateResponse>(
    "/api/schedules",
    formData
  );
  return response;
};

export type ScheduleCreateRequest = ApiRequest<"/api/schedules", "post">;
export type ScheduleCreateResponse = ApiResponse<
  "/api/schedules",
  "post",
  HttpStatus.CREATED
>;
