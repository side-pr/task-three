import { apiRequester, HttpStatus } from "@shared/api";
import { ApiPathParams, ApiResponse } from "@shared/api/openapi/helper";

export const todoCancelComplete = async (
  pathParams: TodoCancelCompletePathParams
) => {
  const response = await apiRequester.put<TodoCancelCompleteResponse>(
    `/api/tasks/${pathParams.taskId}/cancel-complete`
  );
  return response;
};

export type TodoCancelCompletePathParams = ApiPathParams<
  "/api/tasks/{taskId}/cancel-complete",
  "put"
>;
export type TodoCancelCompleteResponse = ApiResponse<
  "/api/tasks/{taskId}/cancel-complete",
  "put",
  HttpStatus.OK
>;
