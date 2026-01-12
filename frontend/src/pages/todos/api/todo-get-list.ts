import { apiRequester, HttpStatus } from "@shared/api";
import { ApiResponse } from "@shared/api/openapi/helper";

export const todoGetList = async () => {
  const response = await apiRequester.get<TodoGetListResponse>("/api/tasks");
  return response.data;
};

export type TodoGetListResponse = ApiResponse<
  "/api/tasks",
  "get",
  HttpStatus.OK
>;
