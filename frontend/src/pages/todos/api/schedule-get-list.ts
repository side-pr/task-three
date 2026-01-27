import { apiRequester, HttpStatus, ServiceApiResponse } from "@shared/api";
import { ApiResponse } from "@shared/api/openapi/helper";

export const scheduleGetList = async (date: string) => {
  const response = await apiRequester.get<ServiceApiResponse<ScheduleGetListResponse>>(
    "/api/schedules",
    { params: { date } }
  );
  return response.data.data;
};

export type ScheduleGetListResponse = 
  ApiResponse<"/api/schedules", "get", HttpStatus.OK>
;
export type ScheduleItem = ScheduleGetListResponse["schedules"][number];
