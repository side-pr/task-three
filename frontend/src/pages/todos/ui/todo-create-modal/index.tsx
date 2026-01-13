import { cn } from "@shared/lib/style";
import * as Dialog from "@radix-ui/react-dialog";

export const TodoCreateModal = ({
  onCreate,
  trigger,
}: {
  onCreate: () => void;
  trigger: React.ReactNode;
}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={cn("fixed inset-0 z-50 bg-gray-950/25")} />
        <Dialog.Content
          onInteractOutside={(e) => e.preventDefault()}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[327px] p-6",
            "-translate-x-1/2 -translate-y-1/2",
            "bg-gray-0 rounded-[24px]",
            "focus:outline-none flex flex-col gap-4"
          )}
        >
          <Dialog.Title className="text-title1 text-gray-950 font-bold">
            할 일 추가
          </Dialog.Title>
          <Dialog.Description className="text-body2 text-gray-500 font-regular">
            Tip. <br />
            사소한 일이라도 적으면 정리에 도움이 돼요
          </Dialog.Description>
          <p>aaaa</p>

          <div className="flex gap-3 mt-4">
            <Dialog.Close asChild>
              <button className="flex-1 h-12 bg-gray-200 text-gray-950 rounded-full">
                닫기
              </button>
            </Dialog.Close>

            <Dialog.Close asChild>
              <button
                onClick={onCreate}
                className="flex-1 h-12 bg-gray-950 text-gray-0 rounded-full"
              >
                추가
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
