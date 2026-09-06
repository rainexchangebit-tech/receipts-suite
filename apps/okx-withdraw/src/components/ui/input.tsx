import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      suppressHydrationWarning
      className={cn(
        "h-11 w-full rounded-[12px] bg-surface-2 px-3.5 text-sm text-fg",
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
