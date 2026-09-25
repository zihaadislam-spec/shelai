import Link from "next/link";
import { Scissors, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBdt } from "@/lib/utils";
import type { Course } from "@/lib/types";

const levelLabel: Record<Course["level"], string> = {
  beginner: "বিগিনার",
  intermediate: "মিডিয়াম",
  advanced: "এডভান্স",
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-[0_2px_0_0_#E07A5F]">
        <div className="flex h-36 items-center justify-center bg-[#2F3E46]/5 border-b border-dashed border-[#2F3E46]/15">
          <Scissors className="h-10 w-10 text-[#E07A5F]/70" strokeWidth={1.5} />
        </div>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge tone="accent">{levelLabel[course.level]}</Badge>
            <span className="text-sm text-[#2F3E46]/50">{course.lessons.length} লেসন</span>
          </div>
          <h3
            className="mt-3 text-xl text-[#2F3E46]"
            style={{ fontFamily: "'Tiro Bangla', serif" }}
          >
            {course.titleBn}
          </h3>
          <p className="mt-1 text-sm text-[#2F3E46]/60 line-clamp-2">{course.subtitleBn}</p>
          <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#2F3E46]/15 pt-4">
            <span className="flex items-center gap-1.5 text-sm text-[#2F3E46]/70">
              <User size={14} /> {course.instructorName}
            </span>
            <span className="text-lg font-semibold text-[#E07A5F]">{formatBdt(course.priceBdt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
