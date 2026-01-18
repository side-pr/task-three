import { apiRequester, HttpStatus } from "@shared/api";
import { ApiResponse } from "@shared/api/openapi/helper";
import { AxiosResponse } from "axios";

export const scheduleGetList = async () => {
  const response = await apiRequester.get<ScheduleGetListResponse>(
    "/api/schedules"
  );
  return response.data.data;
};

export type ScheduleGetListResponse = AxiosResponse<
  ApiResponse<"/api/schedules", "get", HttpStatus.OK>
>;
export type ScheduleItem = ScheduleGetListResponse["data"]["schedules"][number];
