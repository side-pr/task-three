import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // font-size, color끼리 병합되는 현상을 막음
      "font-size": [
        "text-heading1",
        "text-heading2",
        "text-title1",
        "text-title2",
        "text-title3",
        "text-body1",
        "text-body2",
        "text-body3",
      ],
    },
  },
});
