import { todoCreate } from "@pages/todos/api/todo-create";
import { todoQueries } from "@pages/todos/api/todo.queries";
import { DateSelectSection } from "@pages/todos/ui/date-select-section";
import { MustTodoSection } from "@pages/todos/ui/must-todo-section";
import { TodoSection } from "@pages/todos/ui/todo-section";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const TodoPage = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: createTodo } = useMutation({
    mutationFn: todoCreate,
    onSuccess: () => {
      queryClient.invalidateQueries(todoQueries.list());
    },
  });
  return (
    <main className="w-full min-w-[360px] h-full flex flex-col items-center pt-4">
      <div className="w-full h-full flex flex-col items-center gap-6  px-6">
        <DateSelectSection />

        <div className="w-full flex flex-col gap-6">
          <MustTodoSection />
          <TodoSection
            onCreate={() =>
              createTodo({
                name: "test",
              })
            }
          />
        </div>
      </div>
    </main>
  );
};
