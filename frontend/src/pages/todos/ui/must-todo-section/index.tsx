"use client";

import { ScheduleItem } from "@/pages/todos/api/schedule-get-list";
import { TodoListItem } from "@/pages/todos/ui/todo-list-item";
import { cn } from "@shared/lib/style";
import { Badge, Droppable } from "@shared/ui";
import { Draggable } from "@shared/ui/draggable";

export const MustTodoSection = ({
  scheduleItems,
  onDelete,
  onUpdate,
  onComplete,
  onCancelComplete,
}: {
  scheduleItems: { schedules: ScheduleItem[] };
  onDelete: (scheduleId: number) => void;
  onUpdate: (schedule: ScheduleItem) => void;
  onComplete: (scheduleId: number) => void;
  onCancelComplete: (scheduleId: number) => void;
}) => {
  const itemCount = scheduleItems.schedules?.length ?? 0;

  return (
    <Droppable id="must-todo-section">
      {({ ref, isOver }) => (
        <section
          ref={ref}
          className={cn(
            "flex flex-col gap-3",
            isOver ? "ring-2 ring-blue-500 rounded-2xl" : "",
          )}
        >
          <header className="flex justify-between">
            <div>
              <h2 className="text-title2 font-semibold">오늘 할 일</h2>
              <p className="text-body2 text-gray-500 font-regular">
                자기 전까지 꼭 끝낼 일
              </p>
            </div>
            <Badge>
              {scheduleItems.schedules.length}/{3}
            </Badge>
          </header>

          {itemCount === 0 ? (
            <div
              className="flex items-center justify-center h-[232px] max-h-[232px] rounded-2xl"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23D1D5DB' stroke-width='1' stroke-dasharray='8%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
              }}
            >
              <p className="text-body2 text-gray-400 font-regular">
                할 일 목록 작성 후 <br />
                여기로 옮겨주세요
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2 mt-3">
              {scheduleItems.schedules.map((schedule) => (
                <Draggable
                  key={schedule.scheduleId}
                  id={`schedule-${schedule.scheduleId}`}
                  data={{
                    scheduleId: schedule.scheduleId,
                    taskId: schedule.taskId,
                    taskName: schedule.taskName,
                    isCompleted: schedule.isCompleted,
                  }}
                >
                  {({ ref, listeners, attributes, isDragging }) => (
                    <TodoListItem
                      isMust={true}
                      ref={ref}
                      {...listeners}
                      {...attributes}
                      className={`cursor-move touch-none ${
                        isDragging ? "opacity-50" : ""
                      }`}
                      todo={{
                        taskId: schedule.taskId,
                        name: schedule.taskName,
                        isCompleted: schedule.isCompleted,
                      }}
                      onDelete={() => onDelete(schedule.scheduleId)}
                      onUpdate={() => {}}
                      onEdit={() => onUpdate(schedule)}
                      onToggleComplete={() => {
                        if (schedule.isCompleted) {
                          onCancelComplete(schedule.scheduleId);
                        } else {
                          onComplete(schedule.scheduleId);
                        }
                      }}
                    />
                  )}
                </Draggable>
              ))}
            </ul>
          )}
        </section>
      )}
    </Droppable>
  );
};
