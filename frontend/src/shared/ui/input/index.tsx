import { cn } from "@shared/lib/style";
import { ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {
  className?: string;
}
export const Input = ({ className, ...inputProps }: InputProps) => {
  return (
    <input
      className={cn(
        "h-[43px] min-w-[279px] max-w-[279px] bg-gray-100 rounded-2xl px-[14px] py-3 text-gray-950 text-body2 font-regular",
        "placeholder:text-gray-500 placeholder:text-body2 placeholder:font-normal", //placeholder
        "focus:text-gray-800 focus:ring-1 focus:ring-gray-600 focus:outline-none focus:bg-gray-50", //focus
        "disabled:bg-gray-50 disabled:text-gray-200 disabled:cursor-not-allowed", //disabled
        className
      )}
      {...inputProps}
    />
  );
};
