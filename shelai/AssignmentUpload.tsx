"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Clock, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import type { Lesson, Submission } from "@/lib/types";

export function AssignmentUpload({
  lesson,
  existingSubmission,
}: {
  lesson: Lesson;
  existingSubmission?: Submission;
}) {
  const { submitAssignment } = useStore();
  const [files, setFiles] = useState<{ url: string; name: string }[]>([]);
  const [note, setNote] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const next = Array.from(fileList)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setFiles((prev) => [...prev, ...next]);
  }

  async function handleSubmit() {
    if (files.length === 0) return;
    setSubmitting(true);
    await submitAssignment({
      lessonId: lesson.id,
      imageUrls: files.map((f) => f.url),
      studentNote: note,
    });
    setSubmitting(false);
    setFiles([]);
    setNote("");
  }

  if (existingSubmission && existingSubmission.status !== "resubmit") {
    return (
      <div className="rounded-xl border border-dashed border-[#2F3E46]/15 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[#2F3E46]">আপনার জমা দেওয়া অ্যাসাইনমেন্ট</p>
          <StatusBadge submission={existingSubmission} />
        </div>
        <div className="mt-3 flex gap-2">
          {(existingSubmission.imageUrls ?? []).map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={url} alt={`submission-${i}`} className="h-20 w-20 rounded-lg object-cover border border-[#2F3E46]/10" />
          ))}
        </div>
        {existingSubmission.status === "approved" && (
          <p className="mt-3 text-sm text-[#81B29A]">Approved — Marks: {existingSubmission.marks ?? 0}/100</p>
        )}
        {existingSubmission.feedbackBn && (
          <p className="mt-2 rounded-lg bg-[#2F3E46]/5 p-3 text-sm text-[#2F3E46]/70">
            শিক্ষকের মন্তব্য: {existingSubmission.feedbackBn}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-[#2F3E46]/15 p-5">
      {existingSubmission?.status === "resubmit" && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-[#E9C46A]/15 p-3 text-sm text-[#8a6d1d]">
          <RotateCcw size={16} /> আগেরটি Resubmit Needed — নতুন করে জমা দিন।
          {existingSubmission.feedbackBn && <span> ({existingSubmission.feedbackBn})</span>}
        </div>
      )}
      <p className="text-sm font-medium text-[#2F3E46]">{lesson.assignmentInstructionsBn}</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? "border-[#E07A5F] bg-[#E07A5F]/8" : "border-[#2F3E46]/20 hover:bg-[#2F3E46]/3"
        }`}
      >
        <UploadCloud className="h-8 w-8 text-[#E07A5F]/70" strokeWidth={1.5} />
        <p className="mt-2 text-sm text-[#2F3E46]/70">ছবি টেনে আনুন অথবা ক্লিক করে বেছে নিন</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {files.map((f, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt={f.name} className="h-20 w-20 rounded-lg object-cover border border-[#2F3E46]/10" />
              <button
                onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-[#2F3E46] p-0.5 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="নোট (ঐচ্ছিক)"
        rows={2}
        className="mt-3 w-full rounded-lg border border-[#2F3E46]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#E07A5F] focus:ring-1 focus:ring-[#E07A5F]"
      />

      <Button
        className="mt-3 w-full"
        disabled={files.length === 0 || submitting}
        onClick={handleSubmit}
      >
        {submitting ? "জমা হচ্ছে..." : "অ্যাসাইনমেন্ট জমা দিন"}
      </Button>
    </div>
  );
}

function StatusBadge({ submission }: { submission: Submission }) {
  if (submission.status === "pending")
    return (
      <Badge tone="pending" className="gap-1">
        <Clock size={12} /> Under Review by Admin
      </Badge>
    );
  if (submission.status === "approved")
    return (
      <Badge tone="approved" className="gap-1">
        <CheckCircle2 size={12} /> Approved — {submission.marks ?? 0}/100
      </Badge>
    );
  if (submission.status === "resubmit") return <Badge tone="pending">Resubmit Needed</Badge>;
  return <Badge tone="rejected">Rejected</Badge>;
}
