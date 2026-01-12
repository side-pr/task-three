import { todoGetList } from "@pages/todos/api/todo-get-list";
import { queryOptions } from "@tanstack/react-query";

export const todoQueries = {
  all: () => ["todos"],

  lists: () => [...todoQueries.all(), "list"],
  list: () =>
    queryOptions({
      queryKey: [...todoQueries.lists()],
      queryFn: () => todoGetList(),
    }),

  //   details: () => [...baseCouponQueries.all(), 'detail'],
  //   detail: (query?: PostDetailQuery) =>
  //     queryOptions({
  //       queryKey: [...baseCouponQueries.details(), query?.id],
  //       queryFn: () => getDetailPost({ id: query?.id }),
  //       staleTime: 5000,
  //     }),
};
