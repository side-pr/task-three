'use client';

import { Dialog } from "@shared/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@shared/ui/input";

export const ScheduleCreateFormValues = z.object({
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "HH:MM 형식으로 입력해주세요"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "HH:MM 형식으로 입력해주세요"),
});

export type ScheduleCreateFormValues = z.infer<typeof ScheduleCreateFormValues>;

export const ScheduleCreateModal = ({
  isOpen,
  close,
  todoName,
  onConfirm,
}: {
  isOpen: boolean;
  close: () => void;
  todoName: string;
  onConfirm: (formData: { startTime: string; endTime: string }) => void;
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ScheduleCreateFormValues>({
    defaultValues: {
      startTime: "",
      endTime: "",
    },
    resolver: zodResolver(ScheduleCreateFormValues),
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={close}>
      <Dialog.Content>
        <form
          onSubmit={handleSubmit((data) => {
            onConfirm(data);
            close();
          })}
        >
          <Dialog.Title>오늘 할 일로 이동</Dialog.Title>
          <Dialog.Description>
            '{todoName}'을(를) 오늘 할 일로 이동합니다.
            <br />
            시작 시간과 종료 시간을 입력해주세요.
          </Dialog.Description>

          <fieldset className="flex flex-col gap-4 py-3">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="start-time"
                className="text-title3 font-semibold text-gray-950"
              >
                시작 시간
              </label>
              <Input
                id="start-time"
                type="time"
                {...register("startTime")}
                placeholder="09:00"
              />
              {errors.startTime && (
                <span className="text-red-500 text-sm">{errors.startTime.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="end-time"
                className="text-title3 font-semibold text-gray-950"
              >
                종료 시간
              </label>
              <Input
                id="end-time"
                type="time"
                {...register("endTime")}
                placeholder="18:00"
              />
              {errors.endTime && (
                <span className="text-red-500 text-sm">{errors.endTime.message}</span>
              )}
            </div>
          </fieldset>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={close}
              className="flex-1 h-12 bg-gray-200 text-gray-950 rounded-full"
            >
              취소
            </button>

            <button
              type="submit"
              className="flex-1 h-12 bg-gray-950 text-gray-0 rounded-full"
            >
              확인
            </button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
