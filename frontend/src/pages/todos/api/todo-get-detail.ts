import { apiRequester } from "@shared/api";

import { HttpStatus } from "@shared/api";
import { ApiPathParams, ApiResponse } from "@shared/api/openapi/helper";
import { ServiceApiResponse } from "@shared/api/service-api-response";

export const todoGetDetail = async (pathParams: TodoGetDetailPathParams) => {
  const response = await apiRequester.get<ServiceApiResponse<TodoGetDetailResponse>>(
    `/api/tasks/${pathParams.taskId}`
  );
  return response.data.data;
};


// Todo Get Detail
export type TodoGetDetailPathParams = ApiPathParams<"/api/tasks/{taskId}", "get">;
export type TodoGetDetailResponse = ApiResponse<
  "/api/tasks/{taskId}",
  "get",
  HttpStatus.OK
>;
