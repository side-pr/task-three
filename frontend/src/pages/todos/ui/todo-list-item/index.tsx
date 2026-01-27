"use client";

import { ScheduleItem } from "@/pages/todos/api/schedule-get-list";
import { TodoItem } from "@/pages/todos/api/todo-get-list";
import { TodoDeleteModal } from "@/pages/todos/ui/todo-delete-modal";
import { TodoUpdateModal } from "@/pages/todos/ui/todo-update-modal";
import { cn } from "@shared/lib/style";
import { CheckIcon, PenIcon, TrashIcon } from "@shared/ui/icons";
import { overlay } from "overlay-kit";
import React from "react";

type BaseProps = {
  todo: TodoItem;
  onDelete: () => void;
  onUpdate: (formData: { name: string }) => void;
  onEdit?: () => void;
  onToggleComplete: () => void;
  className?: string;
} & React.HTMLAttributes<HTMLLIElement>;

type TodoListItemProps =
  | (BaseProps & { isMust?: false; schedule?: never })
  | (BaseProps & { isMust: true; schedule: ScheduleItem });

export const TodoListItem = React.forwardRef<HTMLLIElement, TodoListItemProps>(
  (props, ref) => {
    const {
      todo,
      onDelete,
      onUpdate,
      onEdit,
      onToggleComplete,
      className,
      isMust,
      ...restProps
    } = props;
    const schedule = props.isMust ? props.schedule : undefined;
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours, 10);
      const period = hour < 12 ? "오전" : "오후";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${period} ${displayHour}:${minutes}`;
    };

    const getTimeProgress = (startTime: string, endTime: string) => {
      const toMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
      };
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = toMinutes(startTime);
      const endMinutes = toMinutes(endTime);
      const progress =
        ((currentMinutes - startMinutes) / (endMinutes - startMinutes)) * 100;
      return Math.min(100, Math.max(0, progress));
    };

    return (
      <li
        ref={ref}
        {...restProps}
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
        {isMust && schedule && (
          <div className="flex items-center gap-2 w-full justify-center">
            <span className="text-body3 text-gray-400 font-regular text-nowrap">
              {formatTime(schedule.startTime)}
            </span>
            <div className="w-[186px] h-1 bg-gray-300 rounded-full">
              <div
                className="h-full bg-gray-400 rounded-full"
                style={{
                  width: `${getTimeProgress(schedule.startTime, schedule.endTime)}%`,
                }}
              />
            </div>
            <span className="text-body3 text-gray-400 font-regular text-nowrap">
              {formatTime(schedule.endTime)}
            </span>
          </div>
        )}
      </li>
    );
  },
);
