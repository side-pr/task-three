'use client';

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@shared/lib/style";

function Root({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

function Trigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

function Content({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn("dialog-overlay fixed inset-0 z-50 bg-gray-950/25")}
      />
      <DialogPrimitive.Content
        onInteractOutside={(e) => e.preventDefault()}
        className={cn(
          "dialog-content fixed left-1/2 top-1/2 z-50 w-[327px] p-6",
          "-translate-x-1/2 -translate-y-1/2",
          "bg-gray-0 rounded-[24px]",
          "focus:outline-none flex flex-col gap-4",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/**취소 버튼 */
function CloseButton({
  className,
  buttonText = "취소",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close> & {
  buttonText?: string;
}) {
  return (
    <DialogPrimitive.Close {...props} asChild>
      취소버튼
      {/* <ButtonLarge variant="line" className={className}>
        {buttonText}
      </ButtonLarge> */}
    </DialogPrimitive.Close>
  );
}

/**타이틀 */
function Title({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      {...props}
      className={cn("text-title1 text-gray-950 font-bold", className)}
    >
      {children}
    </DialogPrimitive.Title>
  );
}

/**설명 */
function Description({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-body2 text-gray-500 font-regular", className)}
      {...props}
    />
  );
}

function Close({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close {...props} />;
}

export const Dialog = {
  Root,
  Trigger,
  Content,
  Close,
  CloseButton,
  Title,
  Description,
};
