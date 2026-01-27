import { todoGetList } from "@/pages/todos/api/todo-get-list";
import { todoGetDetail } from "@pages/todos/api/todo-get-detail";
import { queryOptions } from "@tanstack/react-query";

export const todoQueries = {
  all: () => ["todos"] as const,

  details: () => [...todoQueries.all(), "detail"] as const,
  detail: (taskId: number) =>
    queryOptions({
      queryKey: [...todoQueries.details(), taskId] as const,
      queryFn: () => todoGetDetail(taskId),
    }),

  lists: () => [...todoQueries.all(), "list"] as const,
  list: (date: string) =>
    queryOptions({
      queryKey: [...todoQueries.lists(), date] as const,
      queryFn: () => todoGetList(date),
    }),
};
