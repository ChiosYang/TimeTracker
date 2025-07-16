"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

// Helper function to determine the color class based on progress value
const getProgressColorClass = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "bg-gray-400"; // Default or error color
  if (value === 100) return "bg-yellow-400"; // Gold for 100%
  if (value <= 25) return "bg-green-500";
  if (value <= 50) return "bg-cyan-500"; // Cyan
  if (value <= 75) return "bg-blue-500";
  return "bg-purple-500"; // Purple for 76-99%
};

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const colorClass = getProgressColorClass(value);

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1 transition-all", colorClass)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
