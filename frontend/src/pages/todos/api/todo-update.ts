import { apiRequester, HttpStatus } from "@shared/api";
import {
  ApiPathParams,
  ApiRequest,
  ApiResponse,
} from "@shared/api/openapi/helper";

export const todoUpdate = async ({
  pathParams,
  formData,
}: {
  pathParams: TodoUpdatePathParams;
  formData: TodoUpdateRequest;
}) => {
  const response = await apiRequester.put<TodoUpdateResponse>(
    `/api/tasks/${pathParams.taskId}`,
    {
      ...formData,
    }
  );
  return response;
};

export type TodoUpdateRequest = ApiRequest<"/api/tasks/{taskId}", "put">;
export type TodoUpdateResponse = ApiResponse<
  "/api/tasks/{taskId}",
  "put",
  HttpStatus.OK
>;
export type TodoUpdatePathParams = ApiPathParams<"/api/tasks/{taskId}", "put">;
