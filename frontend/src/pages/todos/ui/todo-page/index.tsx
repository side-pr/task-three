import { cn } from "@shared/lib/style";
import { ReactNode } from "react";

export const TodoPage = () => {
  return (
    <main className="w-full min-w-[360px] h-full flex flex-col items-center pt-4">
      <div className="w-full h-full flex flex-col items-center gap-6  px-6">
        <section className="flex flex-col w-full">
          <h2>2026년 1월</h2>
          <div className="flex gap-2 -mx-6 w-screen">
            <ul className="flex gap-2 w-full overflow-x-auto scroll-hide">
              <DateSelection day={1} dayOfWeek="일" isSelected={true} />
              <DateSelection day={2} dayOfWeek="월" isSelected={false} />
              <DateSelection day={3} dayOfWeek="화" isSelected={false} />
              <DateSelection day={4} dayOfWeek="수" isSelected={false} />
              <DateSelection day={5} dayOfWeek="목" isSelected={false} />
              <DateSelection day={6} dayOfWeek="금" isSelected={false} />
              <DateSelection day={7} dayOfWeek="토" isSelected={false} />
              <DateSelection day={8} dayOfWeek="일" isSelected={false} />
            </ul>
          </div>
        </section>

        <div className="w-full flex flex-col gap-6">
          <div className="w-full">
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
          </div>

          <div className="w-full h-[207px] min-h-[207px]">
            <section>
              <h2 className="text-title2 font-semibold text-gray-950">
                할 일 목록
              </h2>
              <p className="text-body2 text-gray-500 font-regular">
                생각나는 일 모두 적기
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export const Badge = ({ children }: { children: ReactNode }) => {
  return (
    <div className={cn("px-[6px] py-[2px] rounded-lg h-fit bg-gray-200")}>
      <span className="text-title3 font-semibold text-gray-600 h-fit">
        {children}
      </span>
    </div>
  );
};

export const DateSelection = ({
  isSelected,
  day,
  dayOfWeek,
}: {
  isSelected: boolean;
  day: number;
  dayOfWeek: string;
}) => {
  return (
    <li
      className={cn(
        "min-w-14 min-h-14 w-14 h-14",
        "flex flex-col items-center justify-center rounded-2xl",
        "bg-gray-100 text-gray-900",
        isSelected && "bg-gray-800 text-gray-0"
      )}
    >
      <div className="w-10 h-10 flex flex-col items-center justify-center">
        <span className="text-body2 h-[19px] font-regular">{dayOfWeek}</span>
        <span className="text-body2 h-[19px] font-semibold">{day}</span>
      </div>
    </li>
  );
};
