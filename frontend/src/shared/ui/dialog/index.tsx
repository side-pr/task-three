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
        className={cn("dialog-overlay fixed inset-0 z-50 bg-grey-black/70")}
        {...props}
      />
      <DialogPrimitive.Content
        onInteractOutside={(e) => e.preventDefault()}
        className={cn(
          "dialog-content fixed z-50 bg-grey-white rounded-[20px] px-[40px] py-[30px]",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
/** 확인 버튼 */
// function ConfirmButton({
//   className,
//   buttonText = "확인",
//   onConfirm,
//   variant = "active",
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Close> & {
//   buttonText?: string;
//   onConfirm: () => void;
//   variant?: "active" | "line" | "inactive";
// } & Omit<React.ComponentProps<typeof ButtonLarge>, "children" | "variant">) {
//   return (
//     <DialogPrimitive.Close asChild {...props}>
//       <ButtonLarge
//         variant={variant}
//         onClick={onConfirm}
//         className={className}
//         {...props}
//       >
//         {buttonText}
//       </ButtonLarge>
//     </DialogPrimitive.Close>
//   );
// }

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
      className={cn("font-bold text-grey-900 text-head-22 ", className)}
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
      className={cn("text-body-16 text-grey-800 text-center", className)}
      {...props}
    />
  );
}

export const Dialog = {
  Root,
  Trigger,
  Content,
  CloseButton,
  Title,
  Description,
};
