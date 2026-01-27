import { apiRequester, HttpStatus, ServiceApiResponse } from "@shared/api";
import { ApiResponse } from "@shared/api/openapi/helper";

export const todoGetList = async (date: string) => {
  const response = await apiRequester.get<ServiceApiResponse<TodoGetListResponse>>("/api/tasks", {
    params: { date },
  });
  return response.data.data;
};

export type TodoGetListResponse = ApiResponse<"/api/tasks", "get", HttpStatus.OK>;
export type TodoItem = TodoGetListResponse["tasks"][number];
