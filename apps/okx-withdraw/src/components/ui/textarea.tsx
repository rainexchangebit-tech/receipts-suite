import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      suppressHydrationWarning
      className={cn(
        "min-h-[88px] w-full resize-y rounded-[12px] bg-surface-2 px-3.5 py-2.5 text-sm text-fg leading-relaxed",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
        "placeholder:text-subtle",
        "transition-[box-shadow] duration-[var(--motion-quick)]",
        "focus:outline-none focus:shadow-[0_0_0_1px_rgba(232,230,225,0.45)]",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
