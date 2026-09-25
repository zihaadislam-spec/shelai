"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import type { Quiz } from "@/lib/types";
import { CheckCircle2, XCircle } from "lucide-react";

export function QuizModal({
  quiz,
  open,
  onClose,
  onPassed,
}: {
  quiz: Quiz;
  open: boolean;
  onClose: () => void;
  onPassed: () => void;
}) {
  const { submitQuiz } = useStore();
  const [answers, setAnswers] = useState<number[]>(Array(quiz.questions.length).fill(-1));
  const [result, setResult] = useState<{ scorePct: number; passed: boolean } | null>(null);

  function selectAnswer(qIdx: number, optIdx: number) {
    setAnswers((prev) => prev.map((a, i) => (i === qIdx ? optIdx : a)));
  }

  async function handleSubmit() {
    const correct = quiz.questions.filter((q, i) => q.correctIndex === answers[i]).length;
    const scorePct = Math.round((correct / quiz.questions.length) * 100);
    await submitQuiz(quiz.lessonId, scorePct);
    setResult({ scorePct, passed: scorePct >= quiz.passingScore });
  }

  function handleClose() {
    setAnswers(Array(quiz.questions.length).fill(-1));
    setResult(null);
    onClose();
  }

  const allAnswered = answers.every((a) => a !== -1);

  return (
    <Dialog open={open} onClose={handleClose} className="max-w-xl">
      <h2 className="text-xl text-[#2F3E46]" style={{ fontFamily: "'Tiro Bangla', serif" }}>
        {quiz.titleBn}
      </h2>
      <p className="mt-1 text-sm text-[#2F3E46]/60">
        পাস মার্ক: {quiz.passingScore}% — পরের লেসন আনলক করতে এই স্কোর প্রয়োজন।
      </p>

      {result ? (
        <div className="mt-6 text-center">
          {result.passed ? (
            <CheckCircle2 className="mx-auto h-12 w-12 text-[#81B29A]" strokeWidth={1.5} />
          ) : (
            <XCircle className="mx-auto h-12 w-12 text-[#C1443A]" strokeWidth={1.5} />
          )}
          <p className="mt-3 text-2xl font-semibold text-[#2F3E46]">{result.scorePct}%</p>
          <Badge tone={result.passed ? "approved" : "rejected"} className="mt-2">
            {result.passed ? "পাস করেছেন 🎉" : "পাস মার্কের নিচে"}
          </Badge>
          <p className="mt-3 text-sm text-[#2F3E46]/60">
            {result.passed
              ? "পরবর্তী লেসন এখন আনলক হয়েছে।"
              : "আবার চেষ্টা করুন, চিন্তার কিছু নেই।"}
          </p>
          <div className="mt-6 flex gap-2">
            {!result.passed && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setAnswers(Array(quiz.questions.length).fill(-1));
                  setResult(null);
                }}
              >
                আবার দিন
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={() => {
                if (result.passed) onPassed();
                handleClose();
              }}
            >
              বন্ধ করুন
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {quiz.questions.map((q, qi) => (
            <div key={qi}>
              <p className="text-sm font-medium text-[#2F3E46]">
                {qi + 1}. {q.question}
              </p>
              <div className="mt-2 space-y-1.5">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => selectAnswer(qi, oi)}
                    className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      answers[qi] === oi
                        ? "border-[#E07A5F] bg-[#E07A5F]/10 text-[#2F3E46]"
                        : "border-[#2F3E46]/15 bg-white text-[#2F3E46]/80 hover:bg-[#2F3E46]/5"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <Button disabled={!allAnswered} className="w-full" onClick={handleSubmit}>
            কুইজ জমা দিন
          </Button>
        </div>
      )}
    </Dialog>
  );
}
