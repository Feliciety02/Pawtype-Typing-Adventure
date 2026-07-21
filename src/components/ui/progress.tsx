"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils/utils";

type ProgressSize = "xs" | "sm" | "md";
type ProgressTone = "primary" | "xp" | "coin" | "success" | "danger" | "rainbow";

interface ProgressProps extends Omit<
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
  "max" | "value"
> {
  value?: number | null;
  max?: number;
  size?: ProgressSize;
  tone?: ProgressTone;
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value = 0, max = 100, size = "sm", tone = "primary", ...props }, ref) => {
    const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
    const safeValue =
      value === null ? null : Math.min(safeMax, Math.max(0, Number.isFinite(value) ? value : 0));
    const percentage = safeValue === null ? 0 : (safeValue / safeMax) * 100;

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn("pixel-progress", className)}
        value={safeValue}
        max={safeMax}
        data-size={size}
        data-tone={tone}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="pixel-progress-indicator"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress, type ProgressProps, type ProgressSize, type ProgressTone };
