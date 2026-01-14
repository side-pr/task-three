import { Dialog } from "@shared/ui";

export const TodoDeleteModal = ({
  isOpen,
  close,
  onDelete,
  todoName,
}: {
  isOpen: boolean;
  close: () => void;
  onDelete: () => void;
  todoName: string;
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={close}>
      <Dialog.Content>
        <Dialog.Title>할 일 삭제</Dialog.Title>
        <p>{todoName}을 삭제할까요?</p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={close}
            className="flex-1 h-12 bg-gray-200 text-gray-950 rounded-full"
          >
            취소
          </button>

          <button
            onClick={() => {
              onDelete();
              close();
            }}
            className="flex-1 h-12 bg-gray-950 text-gray-0 rounded-full"
          >
            삭제
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
