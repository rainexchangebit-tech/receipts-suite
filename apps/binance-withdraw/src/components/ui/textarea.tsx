import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-20 w-full rounded-lg bg-surface-2 px-3 py-2 text-sm text-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_10%,transparent)] outline-none transition-[box-shadow] duration-150 placeholder:text-fg-subtle focus-visible:shadow-[0_0_0_2px_var(--color-ring)]",
        className,
      )}
      {...props}
    />
  );
}
