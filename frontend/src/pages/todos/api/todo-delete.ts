import { apiRequester } from "@shared/api";
import { ApiPathParams } from "@shared/api/openapi/helper";

export const todoDelete = async (pathParams: TodoDeletePathParams) => {
  const response = await apiRequester.delete(
    `/api/tasks/${pathParams.taskId}`,
    {}
  );
  return response;
};
export type TodoDeletePathParams = ApiPathParams<
  "/api/tasks/{taskId}",
  "delete"
>;
