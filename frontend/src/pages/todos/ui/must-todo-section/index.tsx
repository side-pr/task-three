import { Badge } from "@shared/ui";

export const MustTodoSection = () => {
  return (
    <section className="opacity-50">
      <div className="flex justify-between">
        <div>
          <h2 className="text-title2 font-semibold">오늘 할 일</h2>
          <p className="text-body2 text-gray-500 font-regular">
            자기 전까지 꼭 끝낼 일
          </p>
        </div>
        <Badge>0/3</Badge>
      </div>

      <div className="flex items-center justify-center bg-gray-300 h-[232px] max-h-[232px]">
        <p className="text-body2 text-gray-400 font-regular">
          할 일 목록 작성 후 <br />
          여기로 옮겨주세요
        </p>
      </div>
    </section>
  );
};
