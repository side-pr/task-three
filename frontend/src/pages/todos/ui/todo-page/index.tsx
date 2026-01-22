'use client';

import { getQueryClient } from "@shared/lib/react-query/get-query-client";
import { todoCreate } from "@/pages/todos/api/todo-create";
import { todoDelete } from "@/pages/todos/api/todo-delete";
import { todoQueries } from "@/pages/todos/api/todo.queries";
import { DateSelectSection } from "@/pages/todos/ui/date-select-section";
import { MustTodoSection } from "@/pages/todos/ui/must-todo-section";
import { TodoSection } from "@/pages/todos/ui/todo-section";
import { mutationOptions, useMutation } from "@tanstack/react-query";
import { todoUpdate } from "@/pages/todos/api/todo-update";
import { SuspenseQuery } from "@suspensive/react-query";
import { todoComplete } from "@/pages/todos/api/todo-complete";
import { todoCancelComplete } from "@/pages/todos/api/todo-cancel-complete";
import { scheduleQueries } from "@/pages/todos/api/schedule.queries";
import { scheduleCreate } from "@/pages/todos/api/schedule-create";
import { scheduleDelete } from "@/pages/todos/api/schedule-delete";
import { scheduleMoveToTodoList } from "@/pages/todos/api/schedule-move-to-todo-list";
import { scheduleComplete } from "@/pages/todos/api/schedule-complete";
import { scheduleCancelComplete } from "@/pages/todos/api/schedule-cancel-complete";
import { scheduleUpdate } from "@/pages/todos/api/schedule-update";
import { DndProvider } from "@shared/ui";
import { overlay } from "overlay-kit";
import { ScheduleCreateModal } from "@/pages/todos/ui/schedule-create-modal";
import { ScheduleUpdateModal } from "@/pages/todos/ui/schedule-update-modal";
import { ScheduleItem } from "@/pages/todos/api/schedule-get-list";
import { useRouter } from "next/navigation";

const getToday = () => new Date().toISOString().split("T")[0];

type DragData = {
  scheduleId?: number;
  taskId: number;
  taskName: string;
  isCompleted: boolean;
};

export const TodoPage = ({date}: {date: string}) => {
  const selectedDate = date ?? getToday();
  const router = useRouter();
  const { mutateAsync: createTodo } = useMutation(todoCreateMutationOptions(selectedDate));
  const { mutateAsync: updateTodo } = useMutation(todoUpdateMutationOptions(selectedDate));
  const { mutateAsync: deleteTodo } = useMutation(todoDeleteMutationOptions(selectedDate));
  const { mutateAsync: completeTodo } = useMutation(
    todoCompleteMutationOptions(selectedDate)
  );
  const { mutateAsync: cancelCompleteTodo } = useMutation(
    todoCancelCompleteMutationOptions(selectedDate)
  );
  const { mutateAsync: createSchedule } = useMutation(
    scheduleCreateMutationOptions(selectedDate)
  );
  const { mutateAsync: deleteSchedule } = useMutation(
    scheduleDeleteMutationOptions(selectedDate)
  );
  const { mutateAsync: completeSchedule } = useMutation(
    scheduleCompleteMutationOptions(selectedDate)
  );
  const { mutateAsync: cancelCompleteSchedule } = useMutation(
    scheduleCancelCompleteMutationOptions(selectedDate)
  );
  const { mutateAsync: moveScheduleToTodoList } = useMutation(
    scheduleMoveToTodoListMutationOptions(selectedDate)
  );
  const { mutateAsync: updateSchedule } = useMutation(
    scheduleUpdateMutationOptions(selectedDate)
  );

  const handleScheduleUpdate = (schedule: ScheduleItem) => {
    overlay.open(({ isOpen, close }) => (
      <ScheduleUpdateModal
        isOpen={isOpen}
        close={close}
        defaultValues={{
          name: schedule.taskName,
          startTime: schedule.startTime.slice(0, 5),
          endTime: schedule.endTime.slice(0, 5),
        }}
        onConfirm={(formData) => {
          updateSchedule({
            pathParams: { scheduleId: schedule.scheduleId },
            formData: {
              taskId: schedule.taskId,
              name: formData.name,
              startTime: formData.startTime + ":00",
              endTime: formData.endTime + ":00",
              targetDate: schedule.targetDate,
            },
          });
        }}
      />
    ));
  };

  const handleDragEnd = (data: DragData, overId: string | null) => {
    // todo -> must-todo: schedule 생성
    if (overId === "must-todo-section" && !data.scheduleId) {
      overlay.open(({ isOpen, close }) => (
          <ScheduleCreateModal
          isOpen={isOpen}
          close={close}
          todoName={data.taskName}
          onConfirm={(formData) => {
            createSchedule({
              taskId: data.taskId,
              startTime: formData.startTime + ":00",
              endTime: formData.endTime + ":00",
              targetDate: new Date().toISOString().split("T")[0],
            });
            close();
          }}
        />
      ));
    }

    // must-todo -> todo: 할 일 목록으로 이동
    if (overId === "todo-section" && data.scheduleId) {
      moveScheduleToTodoList({ scheduleId: data.scheduleId });
    }
  };

  return (
    <DndProvider<DragData>
      onDragEnd={handleDragEnd}
      renderOverlay={(activeItem) =>
        activeItem ? (
          <div className="w-full h-11 rounded-2xl text-gray-950 py-3 bg-gray-200 flex items-center justify-between px-4 cursor-grabbing shadow-lg">
            <span className="text-body1 text-gray-950 font-regular">
              {activeItem.taskName}
            </span>
          </div>
        ) : null
      }
    >
      <main className="w-full min-w-[360px] h-full flex flex-col items-center pt-4">
        <div className="w-full h-full flex flex-col items-center gap-6  px-6">
          <DateSelectSection
            selectedDate={selectedDate}
            onDateChange={(date) => {
              router.push(`?date=${date}`);
            }}
          />

          <div className="w-full flex flex-col gap-6">
            <SuspenseQuery {...scheduleQueries.list(selectedDate)}>
              {({ data: scheduleItems }) => (
                <MustTodoSection
                  scheduleItems={scheduleItems}
                  onDelete={(scheduleId) => deleteSchedule({ scheduleId })}
                  onUpdate={handleScheduleUpdate}
                  onComplete={(scheduleId) => completeSchedule({ scheduleId })}
                  onCancelComplete={(scheduleId) =>
                    cancelCompleteSchedule({ scheduleId })
                  }
                />
              )}
            </SuspenseQuery>

            <SuspenseQuery {...todoQueries.list(selectedDate)}>
              {({ data: todoItems }) => (
                <TodoSection
                  todoItems={todoItems}
                  onCreate={(formData: { name: string }) => createTodo(formData)}
                  onUpdate={(todoId: number, formData: { name: string }) =>
                    updateTodo({
                      pathParams: { taskId: todoId },
                      formData,
                    })
                  }
                  onDelete={(todoId) => deleteTodo({ taskId: todoId })}
                  onComplete={(todoId) => completeTodo({ taskId: todoId })}
                  onCancelComplete={(todoId) =>
                    cancelCompleteTodo({ taskId: todoId })
                  }
                />
              )}
            </SuspenseQuery>
          </div>
        </div>
      </main>
    </DndProvider>
  );
};
const todoUpdateMutationOptions = (date: string) => {
  return mutationOptions({
    mutationFn: todoUpdate,
    onSuccess: () => {
      getQueryClient().invalidateQueries(todoQueries.list(date));
    },
  });
};
const todoCreateMutationOptions = (date: string) => {
  return mutationOptions({
    mutationFn: todoCreate,
    onSuccess: () => {
      getQueryClient().invalidateQueries(todoQueries.list(date));
    },
  });
};

const todoDeleteMutationOptions = (date: string) => {
  return mutationOptions({
    mutationFn: todoDelete,
    onSuccess: () => {
      getQueryClient().invalidateQueries(todoQueries.list(date));
    },
  });
};

const todoCompleteMutationOptions = (date: string) => {
  return mutationOptions({
    mutationFn: todoComplete,
    onSuccess: () => {
      getQueryClient().invalidateQueries(todoQueries.list(date));
    },
  });
};

const todoCancelCompleteMutationOptions = (date: string) => {
  return mutationOptions({
    mutationFn: todoCancelComplete,
    onSuccess: () => {
      getQueryClient().invalidateQueries(todoQueries.list(date));
    },
  });
};

const scheduleCreateMutationOptions = (date: string) => {
  return mutationOptions({
    mutationFn: scheduleCreate,
    onSuccess: () => {
      getQueryClient().invalidateQueries(scheduleQueries.list(date));
      getQueryClient().invalidateQueries(todoQueries.list(date));
    },
  });
};

const scheduleDeleteMutationOptions = (date: string) => {
  return mutationOptions({
    mutationFn: scheduleDelete,
    onSuccess: () => {
      getQueryClient().invalidateQueries(scheduleQueries.list(date));
      getQueryClient().invalidateQueries(todoQueries.list(date));
    },
  });
};

const scheduleCompleteMutationOptions = (date: string) => {
  return mutationOptions({
    mutationFn: scheduleComplete,
    onSuccess: () => {
      getQueryClient().invalidateQueries(scheduleQueries.list(date));
    },
  });
};

const scheduleCancelCompleteMutationOptions = (date: string) => {
  return mutationOptions({
    mutationFn: scheduleCancelComplete,
    onSuccess: () => {
      getQueryClient().invalidateQueries(scheduleQueries.list(date));
    },
  });
};

const scheduleMoveToTodoListMutationOptions = (date: string) => {
  return mutationOptions({
    mutationFn: scheduleMoveToTodoList,
    onSuccess: () => {
      getQueryClient().invalidateQueries(scheduleQueries.list(date));
      getQueryClient().invalidateQueries(todoQueries.list(date));
    },
  });
};

const scheduleUpdateMutationOptions = (date: string) => {
  return mutationOptions({
    mutationFn: ({
      pathParams,
      formData,
    }: {
      pathParams: { scheduleId: number };
      formData: {
        taskId: number;
        name: string;
        startTime: string;
        endTime: string;
        targetDate: string;
      };
    }) => scheduleUpdate(pathParams, formData),
    onSuccess: () => {
      getQueryClient().invalidateQueries(scheduleQueries.list(date));
    },
  });
};
