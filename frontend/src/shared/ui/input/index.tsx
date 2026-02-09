import { cn } from "@shared/lib/style";
import { ComponentProps } from "react";
import { cva, VariantProps } from "class-variance-authority";

interface InputProps
  extends ComponentProps<"input">,
    VariantProps<typeof InputVariants> {
  className?: string;
}

const InputVariants = cva([
  "h-[43px] max-h-[43px] min-w-[279px] max-w-[279px] rounded-2xl bg-gray-100 px-[14px] py-3 ", //default 모양
  "text-gray-950 text-body2 font-regular", //default 텍스트
  "placeholder:text-gray-500 placeholder:text-body2 placeholder:font-normal", //placeholder
  "focus:text-gray-800 focus:ring-1 focus:ring-gray-600 focus:outline-none focus:bg-gray-50", //focus
  "disabled:bg-gray-50 disabled:text-gray-200 disabled:cursor-not-allowed", //disabled
]);

export const Input = ({ className, ...inputProps }: InputProps) => {
  return <input className={cn(InputVariants(), className)} {...inputProps} />;
};
