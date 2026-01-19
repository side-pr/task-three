import { TodoItem } from "@pages/todos/api/todo-get-list";
import { TodoCreateModal } from "@pages/todos/ui/todo-create-modal";
import { Draggable } from "@shared/ui/draggable";
import { TodoListItem } from "@pages/todos/ui/todo-list-item";
import { PlusIcon } from "@shared/ui/icons";
import { overlay } from "overlay-kit";

export const TodoSection = ({
  todoItems,
  onCreate,
  onUpdate,
  onDelete,
  onComplete,
  onCancelComplete,
}: {
  todoItems: { tasks: TodoItem[] };
  onCreate: (formData: { name: string }) => void;
  onUpdate: (todoId: number, formData: { name: string }) => void;
  onDelete: (todoId: number) => void;
  onComplete: (todoId: number) => void;
  onCancelComplete: (todoId: number) => void;
}) => {
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
          <Draggable
            key={todo.taskId}
            id={`todo-${todo.taskId}`}
            data={{ taskId: todo.taskId, taskName: todo.name, isCompleted: todo.isCompleted }}
          >
            {({ ref, listeners, attributes, isDragging }) => (
              <TodoListItem
                ref={ref}
                {...listeners}
                {...attributes}
                className={`cursor-move ${isDragging ? "opacity-50" : ""}`}
                todo={todo}
                onDelete={() => onDelete(todo.taskId)}
                onUpdate={(formData: { name: string }) =>
                  onUpdate(todo.taskId, formData)
                }
                onToggleComplete={() => {
                  if (todo.isCompleted) {
                    onCancelComplete(todo.taskId);
                  } else {
                    onComplete(todo.taskId);
                  }
                }}
              />
            )}
          </Draggable>
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
            className="flex flex-col items-center justify-center"
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
          </button>
          <span className="text-gray-950 text-body2">눌러서 할 일 추가</span>
        </div>
      )}
    </section>
  );
};
