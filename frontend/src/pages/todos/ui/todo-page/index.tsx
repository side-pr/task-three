import { getQueryClient } from "@app/providers/get-query-client";
import { todoCreate } from "@pages/todos/api/todo-create";
import { todoDelete } from "@pages/todos/api/todo-delete";
import { todoQueries } from "@pages/todos/api/todo.queries";
import { DateSelectSection } from "@pages/todos/ui/date-select-section";
import { MustTodoSection } from "@pages/todos/ui/must-todo-section";
import { TodoSection } from "@pages/todos/ui/todo-section";
import { mutationOptions, useMutation } from "@tanstack/react-query";
import { todoUpdate } from "@pages/todos/api/todo-update";
import { SuspenseQuery } from "@suspensive/react-query";
import { todoComplete } from "@pages/todos/api/todo-complete";
import { todoCancelComplete } from "@pages/todos/api/todo-cancel-complete";
import { scheduleQueries } from "@pages/todos/api/schedule.queries";
import { scheduleCreate } from "@pages/todos/api/schedule-create";
import { scheduleDelete } from "@pages/todos/api/schedule-delete";
import { scheduleMoveToTodoList } from "@pages/todos/api/schedule-move-to-todo-list";
import { scheduleComplete } from "@pages/todos/api/schedule-complete";
import { scheduleCancelComplete } from "@pages/todos/api/schedule-cancel-complete";
import { DndProvider } from "@shared/ui";
import { overlay } from "overlay-kit";
import { ScheduleCreateModal } from "@pages/todos/ui/schedule-create-modal";

type DragData = {
  scheduleId?: number;
  taskId: number;
  taskName: string;
  isCompleted: boolean;
};

export const TodoPage = () => {
  const { mutateAsync: createTodo } = useMutation(todoCreateMutationOptions());
  const { mutateAsync: updateTodo } = useMutation(todoUpdateMutationOptions());
  const { mutateAsync: deleteTodo } = useMutation(todoDeleteMutationOptions());
  const { mutateAsync: completeTodo } = useMutation(
    todoCompleteMutationOptions()
  );
  const { mutateAsync: cancelCompleteTodo } = useMutation(
    todoCancelCompleteMutationOptions()
  );
  const { mutateAsync: createSchedule } = useMutation(
    scheduleCreateMutationOptions()
  );
  const { mutateAsync: deleteSchedule } = useMutation(
    scheduleDeleteMutationOptions()
  );
  const { mutateAsync: completeSchedule } = useMutation(
    scheduleCompleteMutationOptions()
  );
  const { mutateAsync: cancelCompleteSchedule } = useMutation(
    scheduleCancelCompleteMutationOptions()
  );
  const { mutateAsync: moveScheduleToTodoList } = useMutation(
    scheduleMoveToTodoListMutationOptions()
  );

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
          <DateSelectSection />

          <div className="w-full flex flex-col gap-6">
            <SuspenseQuery {...scheduleQueries.list()}>
              {({ data: scheduleItems }) => (
                <MustTodoSection
                  scheduleItems={scheduleItems}
                  onDelete={(scheduleId) => deleteSchedule({ scheduleId })}
                  onComplete={(scheduleId) => completeSchedule({ scheduleId })}
                  onCancelComplete={(scheduleId) =>
                    cancelCompleteSchedule({ scheduleId })
                  }
                />
              )}
            </SuspenseQuery>
            
            <SuspenseQuery {...todoQueries.list()}>
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

const todoCompleteMutationOptions = () => {
  return mutationOptions({
    mutationFn: todoComplete,
    onSuccess: () => {
      getQueryClient().invalidateQueries(todoQueries.list());
    },
  });
};

const todoCancelCompleteMutationOptions = () => {
  return mutationOptions({
    mutationFn: todoCancelComplete,
    onSuccess: () => {
      getQueryClient().invalidateQueries(todoQueries.list());
    },
  });
};

const scheduleCreateMutationOptions = () => {
  return mutationOptions({
    mutationFn: scheduleCreate,
    onSuccess: () => {
      getQueryClient().invalidateQueries(scheduleQueries.list());
      getQueryClient().invalidateQueries(todoQueries.list());
    },
  });
};

const scheduleDeleteMutationOptions = () => {
  return mutationOptions({
    mutationFn: scheduleDelete,
    onSuccess: () => {
      getQueryClient().invalidateQueries(scheduleQueries.list());
      getQueryClient().invalidateQueries(todoQueries.list());
    },
  });
};

const scheduleCompleteMutationOptions = () => {
  return mutationOptions({
    mutationFn: scheduleComplete,
    onSuccess: () => {
      getQueryClient().invalidateQueries(scheduleQueries.list());
    },
  });
};

const scheduleCancelCompleteMutationOptions = () => {
  return mutationOptions({
    mutationFn: scheduleCancelComplete,
    onSuccess: () => {
      getQueryClient().invalidateQueries(scheduleQueries.list());
    },
  });
};

const scheduleMoveToTodoListMutationOptions = () => {
  return mutationOptions({
    mutationFn: scheduleMoveToTodoList,
    onSuccess: () => {
      getQueryClient().invalidateQueries(scheduleQueries.list());
      getQueryClient().invalidateQueries(todoQueries.list());
    },
  });
};
