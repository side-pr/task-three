import { apiRequester, HttpStatus } from "@shared/api";
import { ApiPathParams, ApiResponse } from "@shared/api/openapi/helper";

export const scheduleMoveToTodoList = async (
  pathParams: ScheduleMoveToTodoListPathParams
) => {
  const response = await apiRequester.put<ScheduleMoveToTodoListResponse>(
    `/api/schedules/${pathParams.scheduleId}/move-to-todo-list`
  );
  return response;
};

export type ScheduleMoveToTodoListPathParams = ApiPathParams<
  "/api/schedules/{scheduleId}/move-to-todo-list",
  "put"
>;
export type ScheduleMoveToTodoListResponse = ApiResponse<
  "/api/schedules/{scheduleId}/move-to-todo-list",
  "put",
  HttpStatus.NO_CONTENT
>;
