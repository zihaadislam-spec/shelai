"use client";

import { Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Course, Submission } from "@/lib/types";

export function GradeReport({
  course,
  studentName,
  submissions,
}: {
  course: Course;
  studentName: string;
  submissions: Submission[];
}) {
  const rows = course.lessons.map((l) => {
    const sub = submissions.find((s) => s.lessonId === l.id);
    return {
      lesson: l.titleBn,
      kind: l.requiresPass,
      score: sub?.kind === "quiz" ? `${sub.quizScorePct}%` : sub?.marks != null ? `${sub.marks}/100` : "—",
      status: sub?.status ?? "—",
    };
  });

  function downloadCertificate() {
    const html = `<!doctype html><html lang="bn"><head><meta charset="utf-8"/>
      <title>সার্টিফিকেট — ${course.titleBn}</title>
      <style>
        body{font-family:'Hind Siliguri',sans-serif;background:#FAF9F6;padding:60px;color:#2F3E46;}
        .cert{border:3px dashed #E07A5F;border-radius:24px;padding:60px;text-align:center;max-width:800px;margin:0 auto;}
        h1{font-size:14px;letter-spacing:2px;color:#E07A5F;text-transform:uppercase;}
        h2{font-size:36px;margin:16px 0;}
        .name{font-size:28px;color:#E07A5F;margin:24px 0;border-bottom:1px solid #2F3E46;display:inline-block;padding-bottom:8px;}
        .course{font-size:20px;margin:16px 0;}
        .meta{margin-top:40px;font-size:13px;color:#2F3E46aa;}
      </style></head>
      <body>
        <div class="cert">
          <h1>সেলাই — সম্পন্নতার সনদ</h1>
          <h2>Certificate of Completion</h2>
          <p>এই মর্মে প্রত্যয়ন করা যাচ্ছে যে</p>
          <div class="name">${studentName}</div>
          <p class="course">সফলভাবে সম্পন্ন করেছেন — <strong>${course.titleBn}</strong></p>
          <p class="meta">প্রদান তারিখ: ${new Date().toLocaleDateString("bn-BD")}</p>
        </div>
      </body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${course.slug}-certificate.html`;
    a.click();
  }

  return (
    <div className="rounded-xl border border-dashed border-[#2F3E46]/15 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-[#2F3E46]" style={{ fontFamily: "'Tiro Bangla', serif" }}>
          গ্রেড রিপোর্ট
        </h3>
        <Button size="sm" variant="outline" onClick={downloadCertificate}>
          <Award size={14} /> সার্টিফিকেট ডাউনলোড
        </Button>
      </div>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="border-b border-dashed border-[#2F3E46]/15 text-left text-[#2F3E46]/50">
            <th className="py-2 font-medium">লেসন</th>
            <th className="py-2 font-medium">ধরন</th>
            <th className="py-2 font-medium">স্কোর</th>
            <th className="py-2 font-medium">স্ট্যাটাস</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-dashed border-[#2F3E46]/8 last:border-0">
              <td className="py-2 text-[#2F3E46]">{r.lesson}</td>
              <td className="py-2 text-[#2F3E46]/60">{r.kind ?? "—"}</td>
              <td className="py-2 text-[#2F3E46]/60">{r.score}</td>
              <td className="py-2 text-[#2F3E46]/60">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button variant="ghost" size="sm" className="mt-3">
        <Download size={14} /> PDF হিসেবে সংরক্ষণ (প্রিন্ট)
      </Button>
    </div>
  );
}
