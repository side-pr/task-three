'use client';

import { Dialog } from "@shared/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@shared/ui/input";
import { useEffect } from "react";

export const ScheduleUpdateFormValues = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "HH:MM 형식으로 입력해주세요"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "HH:MM 형식으로 입력해주세요"),
}).refine((data) => data.startTime < data.endTime, {
  message: "종료 시간은 시작 시간보다 늦어야 합니다",
  path: ["endTime"],
});

export type ScheduleUpdateFormValues = z.infer<typeof ScheduleUpdateFormValues>;

export const ScheduleUpdateModal = ({
  isOpen,
  close,
  defaultValues,
  onConfirm,
}: {
  isOpen: boolean;
  close: () => void;
  defaultValues: { name: string; startTime: string; endTime: string };
  onConfirm: (formData: { name: string; startTime: string; endTime: string }) => void;
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ScheduleUpdateFormValues>({
    defaultValues,
    resolver: zodResolver(ScheduleUpdateFormValues),
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, defaultValues, reset]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={close}>
      <Dialog.Content>
        <form
          onSubmit={handleSubmit((data) => {
            onConfirm(data);
            close();
          })}
        >
          <Dialog.Title>오늘 할 일 수정</Dialog.Title>
          <Dialog.Description>
            할 일의 이름과 시간을 수정합니다.
          </Dialog.Description>

          <fieldset className="flex flex-col gap-4 py-3">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-title3 font-semibold text-gray-950"
              >
                이름
              </label>
              <Input
                id="name"
                type="text"
                {...register("name")}
                placeholder="할 일 이름"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name.message}</span>
              )}
            </div>

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
              수정
            </button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
