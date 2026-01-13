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
  onCreate,
  trigger,
}: {
  onCreate: () => void;
  trigger: React.ReactNode;
}) => {
  const { register, handleSubmit } = useForm<TodoCreateFormValues>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(TodoCreateFormValues),
  });
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Content>
        <form onSubmit={handleSubmit(onCreate)}>
          <Dialog.Title>할 일 추가</Dialog.Title>
          <Dialog.Description>
            Tip. <br />
            사소한 일이라도 적으면 정리에 도움이 돼요
          </Dialog.Description>
          <fieldset className="flex flex-col h-[97px]">
            <label htmlFor="todo-name">할 일 이름</label>
            <Input
              id="todo-name"
              type="text"
              {...register("name")}
              placeholder="할 일 이름을 입력해주세요"
            />
          </fieldset>

          <div className="flex gap-3 mt-4">
            <Dialog.Close asChild>
              <button className="flex-1 h-12 bg-gray-200 text-gray-950 rounded-full">
                닫기
              </button>
            </Dialog.Close>

            <Dialog.Close asChild>
              <button
                type="submit"
                className="flex-1 h-12 bg-gray-950 text-gray-0 rounded-full"
              >
                추가
              </button>
            </Dialog.Close>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
