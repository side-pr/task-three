"use client";

import { cn } from "@shared/lib/style";
import { useMemo, useRef, useEffect } from "react";

type DateSelectSectionProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
};

const DAY_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"] as const;

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const generateMonthDates = (baseDate: Date) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();

  const dates: Date[] = [];
  for (let d = 1; d <= lastDay; d++) {
    dates.push(new Date(year, month, d));
  }
  return dates;
};

export const DateSelectSection = ({
  selectedDate,
  onDateChange,
}: DateSelectSectionProps) => {
  const selectedDateObj = new Date(selectedDate);
  const dates = useMemo(
    () => generateMonthDates(selectedDateObj),
    [selectedDate],
  );
  const listRef = useRef<HTMLUListElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (listRef.current) {
      const selectedDay = new Date(selectedDate).getDate();
      const selectedIndex = selectedDay - 1;
      const itemWidth = 56; // w-14 = 56px
      const gap = 8; // gap-2 = 8px
      const scrollPosition = selectedIndex * (itemWidth + gap);

      listRef.current.scrollTo({
        left: scrollPosition,
        behavior: isInitialMount.current ? "instant" : "smooth",
      });
      isInitialMount.current = false;
    }
  }, [selectedDate]);

  const year = selectedDateObj.getFullYear();
  const month = selectedDateObj.getMonth() + 1;

  return (
    <section className="flex flex-col w-full gap-3">
      <h2 className="text-title1 font-bold text-gray-950">
        {year}년 {month}월
      </h2>
      <div className="flex gap-2 -mx-6 w-screen">
        <ul
          ref={listRef}
          className="flex gap-2 w-full overflow-x-auto scroll-hide px-6"
        >
          {dates.map((date) => (
            <DateSelection
              key={formatDate(date)}
              day={date.getDate()}
              dayOfWeek={DAY_OF_WEEK[date.getDay()]}
              isSelected={formatDate(date) === selectedDate}
              onClick={() => onDateChange(formatDate(date))}
            />
          ))}
          <li className="min-w-[calc(100vw-80px)] shrink-0" aria-hidden />
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
        isSelected && "bg-gray-800 text-gray-0",
      )}
    >
      <div className="w-10 h-10 flex flex-col items-center justify-center">
        <span className="text-body2 h-[19px] font-regular">{dayOfWeek}</span>
        <span className="text-body2 h-[19px] font-semibold">{day}</span>
      </div>
    </li>
  );
};
