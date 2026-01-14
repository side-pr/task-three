import { Dialog } from "@shared/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@shared/ui/input";
export const TodoCreateFormValues = z.object({
  name: z.string().min(1).max(20),
});
export type TodoCreateFormValues = z.infer<typeof TodoCreateFormValues>;
export const TodoCreateModal = ({
  isOpen,
  close,
  onCreate,
}: {
  isOpen: boolean;
  close: () => void;
  onCreate: (formData: { name: string }) => void;
}) => {
  const { register, handleSubmit } = useForm<TodoCreateFormValues>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(TodoCreateFormValues),
  });
  return (
    <Dialog.Root open={isOpen} onOpenChange={close}>
      <Dialog.Content>
        <form
          onSubmit={() => {
            handleSubmit(onCreate)();
            close();
          }}
        >
          <Dialog.Title>할 일 추가</Dialog.Title>
          <Dialog.Description>
            Tip. <br />
            사소한 일이라도 적으면 정리에 도움이 돼요
          </Dialog.Description>
          <fieldset className="flex flex-col h-[97px] gap-2 py-3">
            <label
              htmlFor="todo-name"
              className="text-title3 font-semibold text-gray-950"
            >
              할 일
            </label>
            <Input
              id="todo-name"
              type="text"
              {...register("name")}
              placeholder="할 일 이름을 입력해주세요"
            />
          </fieldset>

          <div className="flex gap-3 mt-4">
            <button
              onClick={close}
              className="flex-1 h-12 bg-gray-200 text-gray-950 rounded-full"
            >
              닫기
            </button>

            <button
              type="submit"
              className="flex-1 h-12 bg-gray-950 text-gray-0 rounded-full"
            >
              추가
            </button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
