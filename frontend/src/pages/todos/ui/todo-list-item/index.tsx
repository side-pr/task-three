import { TodoItem } from "@pages/todos/api/todo-get-list";
import { TodoDeleteModal } from "@pages/todos/ui/todo-delete-modal";
import { TodoUpdateModal } from "@pages/todos/ui/todo-update-modal";
import { cn } from "@shared/lib/style";
import { CheckIcon, PenIcon, TrashIcon } from "@shared/ui/icons";
import { overlay } from "overlay-kit";
import React from "react";

export const TodoListItem = React.forwardRef<
  HTMLLIElement,
  {
    todo: TodoItem;
    onDelete: () => void;
    onUpdate: (formData: { name: string }) => void;
    onToggleComplete: () => void;
    className?: string;
  } & React.HTMLAttributes<HTMLLIElement>
>(({ todo, onDelete, onUpdate, onToggleComplete, className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      {...props}
      className={cn(
        "w-full h-11 rounded-2xl text-gray-950 py-3 bg-gray-200 flex items-center justify-between",
        todo.isCompleted && "bg-gray-100 opacity-50",
        className
      )}
    >
      <button className="flex items-center flex-1" onClick={onToggleComplete}>
        <div className="w-11 h-11 flex items-center justify-center relative">
          <div
            className={cn(
              "w-5 h-5 border border-gray-400 rounded-full bg-gray-100",
              todo.isCompleted && "bg-gray-600"
            )}
          />
          {todo.isCompleted && (
            <CheckIcon className="absolute w-4 h-4 text-gray-0" />
          )}
        </div>
        <span
          className={cn(
            "text-body1 text-gray-950 font-regular",
            todo.isCompleted && "line-through"
          )}
        >
          {todo.name}
        </span>
      </button>
      <div className="flex items-center">
        <button
          className="w-11 h-11 flex items-center justify-center"
          onClick={() => {
            overlay.open(({ isOpen, close }) => (
              <TodoUpdateModal
                isOpen={isOpen}
                close={close}
                onSubmit={(formData: { name: string }) => onUpdate(formData)}
              />
            ));
          }}
        >
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
    </li>
  );
});
