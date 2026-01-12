"use client";

import { PlusIcon } from "@shared/ui/icons";
import { TodoCreateModal } from "@pages/todos/ui/todo-create-modal";

export const TodoCreateContainerButton = ({
  onCreate,
}: {
  onCreate: () => void;
}) => {
  return (
    <TodoCreateModal
      onCreate={onCreate}
      trigger={
        <button>
          <PlusIcon className="w-12 h-12 bg-gray-950 text-gray-0 rounded-full p-[14px]" />
          <span className="text-gray-950 text-body2">눌러서 할 일 추가</span>
        </button>
      }
    />
  );
};
