"use client";

import Link from "next/link";
import { Scissors } from "lucide-react";
import { useStore, demoStudent, demoAdmin } from "@/lib/store";

export function Navbar() {
  const { currentUser, setCurrentUser } = useStore();

  return (
    <header className="sticky top-0 z-40 border-b border-dashed border-[#2F3E46]/15 bg-[#FAF9F6]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E07A5F] text-white">
            <Scissors size={16} strokeWidth={2} />
          </span>
          <span className="text-lg text-[#2F3E46]" style={{ fontFamily: "'Tiro Bangla', serif" }}>
            সেলাই
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[#2F3E46]/70 sm:flex">
          <Link href="/" className="hover:text-[#2F3E46]">
            কোর্সসমূহ
          </Link>
          <Link href="/dashboard/student" className="hover:text-[#2F3E46]">
            আমার ড্যাশবোর্ড
          </Link>
          <Link href="/dashboard/admin" className="hover:text-[#2F3E46]">
            অ্যাডমিন
          </Link>
        </nav>

        {/* Demo role switcher — replace with real auth/session UI */}
        <div className="flex items-center gap-1 rounded-full border border-dashed border-[#2F3E46]/20 p-1 text-xs">
          <button
            onClick={() => setCurrentUser(demoStudent)}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              currentUser.id === demoStudent.id ? "bg-[#2F3E46] text-white" : "text-[#2F3E46]/60"
            }`}
          >
            শিক্ষার্থী
          </button>
          <button
            onClick={() => setCurrentUser(demoAdmin)}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              currentUser.id === demoAdmin.id ? "bg-[#2F3E46] text-white" : "text-[#2F3E46]/60"
            }`}
          >
            অ্যাডমিন
          </button>
        </div>
      </div>
    </header>
  );
}
