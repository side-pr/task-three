import { Dialog } from "@shared/ui";

export const TodoDeleteModal = ({
  onDelete,
  todoName,
  trigger,
}: {
  onDelete: () => void;
  todoName: string;
  trigger: React.ReactNode;
}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>할 일 삭제</Dialog.Title>
        <p>{todoName}을 삭제할까요?</p>

        <div className="flex gap-3 mt-4">
          <Dialog.Close asChild>
            <button className="flex-1 h-12 bg-gray-200 text-gray-950 rounded-full">
              취소
            </button>
          </Dialog.Close>

          <Dialog.Close asChild>
            <button
              onClick={onDelete}
              className="flex-1 h-12 bg-gray-950 text-gray-0 rounded-full"
            >
              삭제
            </button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
