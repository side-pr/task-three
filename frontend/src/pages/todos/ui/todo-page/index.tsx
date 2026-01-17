import { getQueryClient } from "@app/providers/get-query-client";
import { todoCreate } from "@pages/todos/api/todo-create";
import { todoDelete } from "@pages/todos/api/todo-delete";
import { todoQueries } from "@pages/todos/api/todo.queries";
import { DateSelectSection } from "@pages/todos/ui/date-select-section";
import { MustTodoSection } from "@pages/todos/ui/must-todo-section";
import { TodoSection } from "@pages/todos/ui/todo-section";
import { mutationOptions, useMutation } from "@tanstack/react-query";
import { todoUpdate } from "@pages/todos/api/todo-update";
export const TodoPage = () => {
  const { mutateAsync: createTodo } = useMutation(todoCreateMutationOptions());
  const { mutateAsync: updateTodo } = useMutation(todoUpdateMutationOptions());
  const { mutateAsync: deleteTodo } = useMutation(todoDeleteMutationOptions());

  return (
    <main className="w-full min-w-[360px] h-full flex flex-col items-center pt-4">
      <div className="w-full h-full flex flex-col items-center gap-6  px-6">
        <DateSelectSection />

        <div className="w-full flex flex-col gap-6">
          <MustTodoSection />
          <TodoSection
            onCreate={(formData: { name: string }) => createTodo(formData)}
            onUpdate={(todoId: number, formData: { name: string }) =>
              updateTodo({
                pathParams: { taskId: todoId },
                formData,
              })
            }
            onDelete={(todoId) => deleteTodo({ taskId: todoId })}
          />
        </div>
      </div>
    </main>
  );
};
const todoUpdateMutationOptions = () => {
  return mutationOptions({
    mutationFn: todoUpdate,
    onSuccess: () => {
      getQueryClient().invalidateQueries(todoQueries.list());
    },
  });
};
const todoCreateMutationOptions = () => {
  return mutationOptions({
    mutationFn: todoCreate,
    onSuccess: () => {
      getQueryClient().invalidateQueries(todoQueries.list());
    },
  });
};

const todoDeleteMutationOptions = () => {
  return mutationOptions({
    mutationFn: todoDelete,
    onSuccess: () => {
      getQueryClient().invalidateQueries(todoQueries.list());
    },
  });
};
