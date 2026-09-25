import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "pending" | "approved" | "rejected" | "accent";

const tones: Record<Tone, string> = {
  neutral: "bg-[#2F3E46]/8 text-[#2F3E46]",
  pending: "bg-[#E9C46A]/25 text-[#8a6d1d]",
  approved: "bg-[#81B29A]/25 text-[#33604a]",
  rejected: "bg-[#C1443A]/12 text-[#C1443A]",
  accent: "bg-[#E07A5F]/12 text-[#c9603f]",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
