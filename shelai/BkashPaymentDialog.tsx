"use client";

import { useState } from "react";
import { Copy, CheckCircle2, Smartphone } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatBdt } from "@/lib/utils";
import type { Course } from "@/lib/types";

const BKASH_NUMBER = "01818344414";

export function BkashPaymentDialog({
  course,
  open,
  onClose,
}: {
  course: Course;
  open: boolean;
  onClose: () => void;
}) {
  const { submitPayment } = useStore();
  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function copyNumber() {
    navigator.clipboard?.writeText(BKASH_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!senderNumber || !trxId) return;
    setLoading(true);
    await submitPayment({ courseId: course.id, senderBkashNumber: senderNumber, trxId });
    setLoading(false);
    setSubmitted(true);
  }

  function handleClose() {
    setSubmitted(false);
    setSenderNumber("");
    setTrxId("");
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      {submitted ? (
        <div className="py-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-[#81B29A]" strokeWidth={1.5} />
          <h2 className="mt-4 text-xl text-[#2F3E46]" style={{ fontFamily: "'Tiro Bangla', serif" }}>
            পেমেন্ট জমা হয়েছে
          </h2>
          <p className="mt-2 text-sm text-[#2F3E46]/60">
            আপনার তথ্য যাচাই করে ২৪ ঘণ্টার মধ্যে কোর্স আনলক করে দেওয়া হবে।
          </p>
          <Badge tone="pending" className="mt-4">
            Pending Approval
          </Badge>
          <Button className="mt-6 w-full" onClick={handleClose}>
            ঠিক আছে
          </Button>
        </div>
      ) : (
        <>
          <h2 className="text-xl text-[#2F3E46]" style={{ fontFamily: "'Tiro Bangla', serif" }}>
            বিকাশ পেমেন্ট
          </h2>
          <p className="mt-1 text-sm text-[#2F3E46]/60">
            {course.titleBn} — <span className="font-semibold text-[#E07A5F]">{formatBdt(course.priceBdt)}</span>
          </p>

          <div className="mt-4 rounded-xl border border-dashed border-[#E07A5F]/40 bg-[#E07A5F]/8 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[#2F3E46]">
              <Smartphone size={16} className="text-[#E07A5F]" /> বিকাশ পার্সোনাল নম্বর
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-semibold tracking-wide text-[#2F3E46]">{BKASH_NUMBER}</span>
              <button
                type="button"
                onClick={copyNumber}
                className="flex items-center gap-1 rounded-md border border-[#2F3E46]/15 px-2.5 py-1.5 text-xs text-[#2F3E46]/70 hover:bg-white"
              >
                <Copy size={13} /> {copied ? "কপি হয়েছে" : "কপি করুন"}
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[#2F3E46]/75">
            বিকাশ অ্যাপ থেকে <strong>Send Money</strong> করার পর TrxID এবং প্রেরকের মোবাইল নম্বর নিচে জমা দিন।
          </p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-[#2F3E46]">প্রেরকের বিকাশ নম্বর</label>
              <input
                required
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="mt-1 w-full rounded-lg border border-[#2F3E46]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#E07A5F] focus:ring-1 focus:ring-[#E07A5F]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#2F3E46]">ট্রানজেকশন আইডি (TrxID)</label>
              <input
                required
                value={trxId}
                onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                placeholder="8N7K2X9QZP"
                className="mt-1 w-full rounded-lg border border-[#2F3E46]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#E07A5F] focus:ring-1 focus:ring-[#E07A5F]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#2F3E46]">কোর্স আইডি</label>
              <input
                disabled
                value={course.id}
                className="mt-1 w-full rounded-lg border border-[#2F3E46]/10 bg-[#2F3E46]/5 px-3 py-2 text-sm text-[#2F3E46]/50"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "জমা হচ্ছে..." : "পেমেন্ট তথ্য জমা দিন"}
            </Button>
          </form>
        </>
      )}
    </Dialog>
  );
}
