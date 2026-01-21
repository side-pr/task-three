import { cn } from "@shared/lib/style";
import { useMemo } from "react";

type DateSelectSectionProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
};

const DAY_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"] as const;

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const generateDates = (baseDate: Date, range: number = 7) => {
  const dates: Date[] = [];
  for (let i = -range; i <= range; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    dates.push(date);
  }
  return dates;
};

export const DateSelectSection = ({
  selectedDate,
  onDateChange,
}: DateSelectSectionProps) => {
  const today = useMemo(() => new Date(), []);
  const dates = useMemo(() => generateDates(today), [today]);

  const selectedDateObj = new Date(selectedDate);
  const year = selectedDateObj.getFullYear();
  const month = selectedDateObj.getMonth() + 1;

  return (
    <section className="flex flex-col w-full">
      <h2>{year}년 {month}월</h2>
      <div className="flex gap-2 -mx-6 w-screen">
        <ul className="flex gap-2 w-full overflow-x-auto scroll-hide px-6">
          {dates.map((date) => (
            <DateSelection
              key={formatDate(date)}
              day={date.getDate()}
              dayOfWeek={DAY_OF_WEEK[date.getDay()]}
              isSelected={formatDate(date) === selectedDate}
              onClick={() => onDateChange(formatDate(date))}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

const DateSelection = ({
  isSelected,
  day,
  dayOfWeek,
  onClick,
}: {
  isSelected: boolean;
  day: number;
  dayOfWeek: string;
  onClick: () => void;
}) => {
  return (
    <li
      onClick={onClick}
      className={cn(
        "min-w-14 min-h-14 w-14 h-14",
        "flex flex-col items-center justify-center rounded-2xl",
        "bg-gray-100 text-gray-900 cursor-pointer",
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
