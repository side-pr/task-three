'use client';

import { Dialog } from "@shared/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@shared/ui/input";
export const TodoUpdateFormValues = z.object({
  name: z.string().min(1).max(20),
});
export type TodoUpdateFormValues = z.infer<typeof TodoUpdateFormValues>;
export const TodoUpdateModal = ({
  isOpen,
  close,
  onSubmit,
}: {
  isOpen: boolean;
  close: () => void;
  onSubmit: (formData: { name: string }) => void;
}) => {
  const { register, handleSubmit } = useForm<TodoUpdateFormValues>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(TodoUpdateFormValues),
  });
  return (
    <Dialog.Root open={isOpen} onOpenChange={close}>
      <Dialog.Content>
        <form
          onSubmit={() => {
            handleSubmit(onSubmit)();
            close();
          }}
        >
          <Dialog.Title>할 일 수정</Dialog.Title>

          <fieldset className="h-[97px] py-3">
            <div className="flex flex-col gap-2">
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
            </div>
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
              수정
            </button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
