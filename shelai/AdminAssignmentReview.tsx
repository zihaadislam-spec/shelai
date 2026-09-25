"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import type { Submission } from "@/lib/types";

export function AdminAssignmentReview({ submissions }: { submissions: Submission[] }) {
  const { reviewAssignment } = useStore();
  const [drafts, setDrafts] = useState<Record<string, { marks: number; feedback: string }>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  function setDraft(id: string, patch: Partial<{ marks: number; feedback: string }>) {
    setDrafts((prev) => ({ ...prev, [id]: { marks: 0, feedback: "", ...prev[id], ...patch } }));
  }

  async function act(sub: Submission, status: "approved" | "rejected" | "resubmit") {
    setBusyId(sub.id);
    const draft = drafts[sub.id] ?? { marks: 0, feedback: "" };
    await reviewAssignment(sub.id, status, status === "approved" ? draft.marks : undefined, draft.feedback);
    setBusyId(null);
  }

  if (submissions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[#2F3E46]/15 p-8 text-center text-sm text-[#2F3E46]/50">
        রিভিউয়ের জন্য কোনো অ্যাসাইনমেন্ট নেই।
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {submissions.map((s) => {
        const draft = drafts[s.id] ?? { marks: 0, feedback: "" };
        return (
          <Card key={s.id}>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="font-medium text-[#2F3E46]">{s.studentName}</p>
                <Badge tone="pending">Under Review</Badge>
              </div>
              <p className="mt-1 text-xs text-[#2F3E46]/50">{new Date(s.createdAt).toLocaleString("bn-BD")}</p>
              <div className="mt-3 flex gap-2">
                {(s.imageUrls ?? []).map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt={`sub-${i}`} className="h-24 w-24 rounded-lg border border-[#2F3E46]/10 object-cover" />
                ))}
              </div>
              {s.studentNote && (
                <p className="mt-2 rounded-lg bg-[#2F3E46]/5 p-2.5 text-xs text-[#2F3E46]/70">{s.studentNote}</p>
              )}

              <div className="mt-3 flex items-center gap-2">
                <label className="text-xs font-medium text-[#2F3E46]/60">মার্ক (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={draft.marks}
                  onChange={(e) => setDraft(s.id, { marks: Number(e.target.value) })}
                  className="w-20 rounded-md border border-[#2F3E46]/15 px-2 py-1 text-sm outline-none focus:border-[#E07A5F]"
                />
              </div>
              <textarea
                value={draft.feedback}
                onChange={(e) => setDraft(s.id, { feedback: e.target.value })}
                placeholder="ফিডব্যাক লিখুন..."
                rows={2}
                className="mt-2 w-full rounded-lg border border-[#2F3E46]/15 px-3 py-2 text-sm outline-none focus:border-[#E07A5F]"
              />

              <div className="mt-3 flex gap-1.5">
                <Button
                  size="sm"
                  disabled={busyId === s.id}
                  onClick={() => act(s, "approved")}
                  className="flex-1 !bg-[#81B29A] hover:!bg-[#6b9c83]"
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === s.id}
                  onClick={() => act(s, "resubmit")}
                >
                  Resubmit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={busyId === s.id}
                  onClick={() => act(s, "rejected")}
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
