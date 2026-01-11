import { cn } from "@shared/lib/style";
import { ReactNode } from "react";

export const Badge = ({ children }: { children: ReactNode }) => {
  return (
    <div className={cn("px-[6px] py-[2px] rounded-lg h-fit bg-gray-200")}>
      <span className="text-title3 font-semibold text-gray-600 h-fit">
        {children}
      </span>
    </div>
  );
};
