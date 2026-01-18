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
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { overlay } from "overlay-kit";
import { ScheduleCreateModal } from "@pages/todos/ui/schedule-create-modal";
import { useState } from "react";
import { TodoItem } from "@pages/todos/api/todo-get-list";

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

  const [activeTodo, setActiveTodo] = useState<TodoItem | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { taskId, taskName, isCompleted } = event.active.data.current as {
      taskId: number;
      taskName: string;
      isCompleted: boolean;
    };
    setActiveTodo({ taskId, name: taskName, isCompleted });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTodo(null);

    if (event.over?.id === "must-todo-section") {
      const { taskId, taskName } = event.active.data.current as {
        taskId: number;
        taskName: string;
      };

      overlay.open(({ isOpen, close }) => (
        <ScheduleCreateModal
          isOpen={isOpen}
          close={close}
          todoName={taskName}
          onConfirm={(formData) => {
            createSchedule({
              taskId,
              startTime: formData.startTime + ":00",
              endTime: formData.endTime + ":00",
              targetDate: new Date().toISOString().split("T")[0],
            });
            close();
          }}
        />
      ));
    }
  };

  const handleDragCancel = () => {
    setActiveTodo(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <main className="w-full min-w-[360px] h-full flex flex-col items-center pt-4">
        <div className="w-full h-full flex flex-col items-center gap-6  px-6">
          <DateSelectSection />

          <div className="w-full flex flex-col gap-6">
            <SuspenseQuery {...scheduleQueries.list()}>
              {({ data: scheduleItems }) => (
                <MustTodoSection
                  scheduleItems={scheduleItems}
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
      <DragOverlay>
        {activeTodo ? (
          <div className="w-full h-11 rounded-2xl text-gray-950 py-3 bg-gray-200 flex items-center justify-between px-4 cursor-grabbing shadow-lg">
            <span className="text-body1 text-gray-950 font-regular">
              {activeTodo.name}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
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
    },
  });
};
