"use client";
import { TodoCreateButton } from "@pages/todos/ui/todo-create-button";

export const TodoSection = () => {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-title2 font-semibold text-gray-950">할 일 목록</h2>
        <p className="text-body2 text-gray-500 font-regular">
          생각나는 일 모두 적기
        </p>
      </div>

      <div
        className="w-full rounded-2xl min-h-[207px] bg-gray-50 flex flex-col items-center justify-center gap-2"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23D1D5DB' stroke-width='1' stroke-dasharray='8%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
        }}
      >
        <TodoCreateButton
          onConfirm={() => {
            console.log("모달 확인");
          }}
        />
        <span className="text-gray-950 text-body2">눌러서 할 일 추가</span>
      </div>
    </section>
  );
};
