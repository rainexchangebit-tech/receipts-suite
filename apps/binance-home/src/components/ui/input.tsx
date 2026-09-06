import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-border bg-elevated px-3 font-mono text-[15px] text-fg tabular-nums tracking-tight outline-none transition-colors placeholder:text-subtle focus-visible:border-fg/40 focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}
