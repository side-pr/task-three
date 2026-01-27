import { todoGetList } from "@/pages/todos/api/todo-get-list";
import { queryOptions } from "@tanstack/react-query";

export const todoQueries = {
  all: () => ["todos"] as const,

  //TODO: 상세조회하고 수정 연결해야함

  lists: () => [...todoQueries.all(), "list"] as const,
  list: (date: string) =>
    queryOptions({
      queryKey: [...todoQueries.lists(), date] as const,
      queryFn: () => todoGetList(date),
    }),
};