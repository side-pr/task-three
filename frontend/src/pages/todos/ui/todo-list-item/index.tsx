"use client";

import { TodoItem } from "@/pages/todos/api/todo-get-list";
import { TodoDeleteModal } from "@/pages/todos/ui/todo-delete-modal";
import { TodoUpdateModal } from "@/pages/todos/ui/todo-update-modal";
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
    onEdit?: () => void;
    onToggleComplete: () => void;
    className?: string;
    isMust?: boolean;
  } & React.HTMLAttributes<HTMLLIElement>
>(
  (
    {
      todo,
      onDelete,
      onUpdate,
      onEdit,
      onToggleComplete,
      className,
      isMust,
      ...props
    },
    ref,
  ) => {
    return (
      <li
        ref={ref}
        {...props}
        className={cn(
          "w-full h-fit rounded-2xl text-gray-950 py-3 bg-gray-200 px-3 flex flex-col gap-3",
          todo.isCompleted && "bg-gray-100 opacity-50",
          className,
        )}
      >
        <div className="flex items-center justify-between w-full">
          <button
            className="flex items-center flex-1 gap-3"
            onClick={onToggleComplete}
          >
            <div className="w-5 h-5 flex items-center justify-center relative">
              <div
                className={cn(
                  "w-5 h-5 border border-gray-400 rounded-full bg-gray-100",
                  todo.isCompleted && "bg-gray-600",
                )}
              />
              {todo.isCompleted && (
                <CheckIcon className="absolute w-4 h-4 text-gray-0" />
              )}
            </div>
            <span
              className={cn(
                "text-body1 text-gray-950 font-regular",
                todo.isCompleted && "line-through",
              )}
            >
              {todo.name}
            </span>
          </button>
          <div className="flex items-center gap-6">
            <button
              className="w-5 h-5 flex items-center justify-center"
              onClick={() => {
                if (onEdit) {
                  onEdit();
                } else {
                  overlay.open(({ isOpen, close }) => (
                    <TodoUpdateModal
                      taskId={todo.taskId}
                      isOpen={isOpen}
                      close={close}
                      onSubmit={(formData: { name: string }) =>
                        onUpdate(formData)
                      }
                    />
                  ));
                }
              }}
            >
              <PenIcon className="w-5 h-5 text-gray-950" />
            </button>
            <button
              className="w-5 h-5 flex items-center justify-center"
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
              <TrashIcon className="w-5 h-5 text-gray-950" />
            </button>
          </div>
        </div>
        {isMust && (
          <div className="flex items-center gap-2 w-full justify-center">
            <span className="text-body3 text-gray-400 font-regular text-nowrap">
              오후 8:00
            </span>
            <div className="w-[186px] h-1 bg-gray-300 rounded-full">
              <div className="w-[50%] h-full bg-gray-400 rounded-full" />
            </div>
            <span className="text-body3 text-gray-400 font-regular text-nowrap">
              오후 11:55
            </span>
          </div>
        )}
      </li>
    );
  },
);
