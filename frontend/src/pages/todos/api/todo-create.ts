import { apiRequester, HttpStatus } from "@shared/api";
import { ApiRequest, ApiResponse } from "@shared/api/openapi/helper";

export const todoCreate = async (formData: TodoCreateRequest) => {
  const response = await apiRequester.post<TodoCreateResponse>("/api/tasks", {
    ...formData,
  });
  return response;
};

export type TodoCreateRequest = ApiRequest<"/api/tasks", "post">;
export type TodoCreateResponse = ApiResponse<
  "/api/tasks",
  "post",
  HttpStatus.CREATED
>;
