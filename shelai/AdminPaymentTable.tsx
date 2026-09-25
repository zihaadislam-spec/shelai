"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { formatBdt } from "@/lib/utils";
import type { Payment } from "@/lib/types";

export function AdminPaymentTable({ payments }: { payments: Payment[] }) {
  const { reviewPayment } = useStore();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function act(id: string, status: "approved" | "rejected") {
    setBusyId(id);
    await reviewPayment(id, status);
    setBusyId(null);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-dashed border-[#2F3E46]/15">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dashed border-[#2F3E46]/15 bg-[#2F3E46]/3 text-left text-[#2F3E46]/60">
            <th className="px-4 py-3 font-medium">শিক্ষার্থী</th>
            <th className="px-4 py-3 font-medium">কোর্স</th>
            <th className="px-4 py-3 font-medium">পরিমাণ</th>
            <th className="px-4 py-3 font-medium">প্রেরক নম্বর</th>
            <th className="px-4 py-3 font-medium">TrxID</th>
            <th className="px-4 py-3 font-medium">স্ট্যাটাস</th>
            <th className="px-4 py-3 font-medium text-right">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-b border-dashed border-[#2F3E46]/10 last:border-0">
              <td className="px-4 py-3 text-[#2F3E46]">{p.studentName}</td>
              <td className="px-4 py-3 text-[#2F3E46]/70">{p.courseTitleBn}</td>
              <td className="px-4 py-3 font-medium text-[#E07A5F]">{formatBdt(p.amountBdt)}</td>
              <td className="px-4 py-3 text-[#2F3E46]/70">{p.senderBkashNumber}</td>
              <td className="px-4 py-3 font-mono text-[#2F3E46]/70">{p.trxId}</td>
              <td className="px-4 py-3">
                <Badge tone={p.status === "approved" ? "approved" : p.status === "rejected" ? "rejected" : "pending"}>
                  {p.status === "approved" ? "Approved" : p.status === "rejected" ? "Rejected" : "Pending Approval"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {p.status === "pending" ? (
                  <div className="flex justify-end gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === p.id}
                      onClick={() => act(p.id, "approved")}
                      className="!border-[#81B29A]/40 !text-[#33604a] hover:!bg-[#81B29A]/10"
                    >
                      <Check size={14} /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === p.id}
                      onClick={() => act(p.id, "rejected")}
                      className="!border-[#C1443A]/40 !text-[#C1443A] hover:!bg-[#C1443A]/10"
                    >
                      <X size={14} /> Reject
                    </Button>
                  </div>
                ) : (
                  <span className="block text-right text-xs text-[#2F3E46]/40">সম্পন্ন</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
