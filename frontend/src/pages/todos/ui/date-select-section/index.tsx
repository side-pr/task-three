import { cn } from "@shared/lib/style";

export const DateSelectSection = () => {
  return (
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
  );
};

const DateSelection = ({
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
