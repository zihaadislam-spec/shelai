"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#2F3E46]/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl border border-dashed border-[#2F3E46]/20 bg-[#FAF9F6] p-6 shadow-xl max-h-[90vh] overflow-y-auto",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#2F3E46]/50 hover:bg-[#2F3E46]/5 hover:text-[#2F3E46]"
          aria-label="বন্ধ করুন"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
