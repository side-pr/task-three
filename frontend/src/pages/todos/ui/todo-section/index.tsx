import { TodoItem } from "@pages/todos/api/todo-get-list";
import { todoQueries } from "@pages/todos/api/todo.queries";
import { TodoCreateModal } from "@pages/todos/ui/todo-create-modal";
import { TodoDeleteModal } from "@pages/todos/ui/todo-delete-modal";
import { cn } from "@shared/lib/style";
import { CheckIcon, PenIcon, PlusIcon, TrashIcon } from "@shared/ui/icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { overlay } from "overlay-kit";
export const TodoSection = ({
  onCreate,
  onDelete,
}: {
  onCreate: () => void;
  onDelete: (todoId: number) => void;
}) => {
  const { data: todoItems } = useSuspenseQuery(todoQueries.list());
  const itemCount = todoItems.tasks?.length ?? 0;

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-title2 font-semibold text-gray-950">
            할 일 목록
          </h2>
          <p className="text-body2 text-gray-500 font-regular">
            생각나는 일 모두 적기
          </p>
        </div>
        {itemCount > 0 && (
          <button
            onClick={() => {
              overlay.open(({ isOpen, close }) => (
                <TodoCreateModal
                  onCreate={onCreate}
                  isOpen={isOpen}
                  close={close}
                />
              ));
            }}
            className="w-13 h-10 bg-gray-100 flex items-center justify-center rounded-2xl py-[10px] px-4"
          >
            <PlusIcon className="w-4 h-4 bg-transparent text-gray-950 rounded-full" />
          </button>
        )}
      </header>

      <ul className="flex flex-col gap-2">
        {todoItems?.tasks?.map((todo) => (
          <li key={todo.taskId}>
            <TodoListItem
              todo={todo}
              isDone={true}
              onDelete={() => onDelete(todo.taskId)}
            />
          </li>
        ))}
      </ul>
      {itemCount === 0 && (
        <div
          className="w-full rounded-2xl min-h-[207px] bg-gray-50 flex flex-col items-center justify-center gap-2"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23D1D5DB' stroke-width='1' stroke-dasharray='8%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
          }}
        >
          <button
            onClick={() => {
              overlay.open(({ isOpen, close }) => (
                <TodoCreateModal
                  onCreate={onCreate}
                  isOpen={isOpen}
                  close={close}
                />
              ));
            }}
          >
            <PlusIcon className="w-12 h-12 bg-gray-950 text-gray-0 rounded-full p-[14px]" />
            <span className="text-gray-950 text-body2">눌러서 할 일 추가</span>
          </button>
        </div>
      )}
    </section>
  );
};

export const TodoListItem = ({
  todo,
  isDone = false,
  onDelete,
}: {
  todo: TodoItem;
  isDone?: boolean;
  onDelete: () => void;
}) => {
  return (
    <div
      className={cn(
        "w-full h-11 rounded-2xl text-gray-950 py-3 bg-gray-200 flex items-center justify-between",
        isDone && "bg-gray-100 opacity-50"
      )}
      key={todo.taskId}
    >
      <div className="flex items-center">
        <div className="w-11 h-11 flex items-center justify-center relative">
          <div
            className={cn(
              "w-5 h-5 border border-gray-400 rounded-full bg-gray-100",
              isDone && "bg-gray-600"
            )}
          />
          {isDone && <CheckIcon className="absolute w-4 h-4 text-gray-0" />}
        </div>
        <span
          className={cn(
            "text-body1 text-gray-950 font-regular",
            isDone && "line-through"
          )}
        >
          {todo.name}
        </span>
      </div>
      <div className="flex items-center">
        <button className="w-11 h-11 flex items-center justify-center">
          <PenIcon className="w-4 h-4 text-gray-950" />
        </button>
        <button
          className="w-11 h-11 flex items-center justify-center"
          onClick={() => {
            overlay.open(({ isOpen, close }) => (
              <TodoDeleteModal
                isOpen={isOpen}
                close={close}
                onDelete={onDelete}
                todoName={todo.name}
              />
            ));
          }}
        >
          <TrashIcon className="w-4 h-4 text-gray-950" />
        </button>
      </div>
    </div>
  );
};
