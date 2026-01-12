"use client";

import { PlusIcon } from "@shared/ui/icons";
import { TodoCreateModal } from "@pages/todos/ui/todo-create-modal";

export const TodoCreateIconButton = ({
  onCreate,
}: {
  onCreate: () => void;
}) => {
  return (
    <TodoCreateModal
      onCreate={onCreate}
      trigger={
        <button className="w-13 h-10 bg-gray-100 flex items-center justify-center rounded-2xl py-[10px] px-4">
          <PlusIcon className="w-4 h-4 bg-transparent text-gray-950 rounded-full" />
        </button>
      }
    />
  );
};
