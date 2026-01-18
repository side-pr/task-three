import { apiRequester, HttpStatus } from "@shared/api";
import { ApiPathParams, ApiResponse } from "@shared/api/openapi/helper";

export const todoComplete = async (pathParams: TodoCompletePathParams) => {
  const response = await apiRequester.put<TodoCompleteResponse>(
    `/api/tasks/${pathParams.taskId}/complete`
  );
  return response;
};

export type TodoCompletePathParams = ApiPathParams<
  "/api/tasks/{taskId}/complete",
  "put"
>;
export type TodoCompleteResponse = ApiResponse<
  "/api/tasks/{taskId}/complete",
  "put",
  HttpStatus.OK
>;
