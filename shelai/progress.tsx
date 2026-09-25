import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={cn("h-2 w-full rounded-full bg-[#2F3E46]/8 overflow-hidden", className)}>
      <div
        className="h-full rounded-full bg-[#E07A5F] transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
