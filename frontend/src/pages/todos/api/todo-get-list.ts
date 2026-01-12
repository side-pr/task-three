import { apiRequester, HttpStatus } from "@shared/api";
import { ApiResponse } from "@shared/api/openapi/helper";
import { AxiosResponse } from "axios";

export const todoGetList = async () => {
  const response = await apiRequester.get<TodoGetListResponse>("/api/tasks");
  return response.data.data;
};

export type TodoGetListResponse = AxiosResponse<
  ApiResponse<"/api/tasks", "get", HttpStatus.OK>
>;
export type TodoItem = TodoGetListResponse["data"]["tasks"][number];
