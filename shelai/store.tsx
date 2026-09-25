"use client";

// =======================================================================
// In-memory / localStorage-backed store that stands in for Supabase.
// Every mutator here is written as an async function so swapping the
// body for a real `supabase.from(...).insert/update()` call later is a
// drop-in change — see comments marked SUPABASE:// in each function.
// =======================================================================

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  courses as seedCourses,
  enrollments as seedEnrollments,
  payments as seedPayments,
  submissions as seedSubmissions,
  demoStudent,
  demoAdmin,
} from "./mock-data";
import type {
  Course,
  Enrollment,
  Payment,
  Profile,
  Submission,
} from "./types";

const STORAGE_KEY = "shelai_mock_db_v1";

interface DB {
  courses: Course[];
  enrollments: Enrollment[];
  payments: Payment[];
  submissions: Submission[];
}

function loadDB(): DB {
  if (typeof window === "undefined") {
    return {
      courses: seedCourses,
      enrollments: seedEnrollments,
      payments: seedPayments,
      submissions: seedSubmissions,
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore malformed cache */
  }
  return {
    courses: seedCourses,
    enrollments: seedEnrollments,
    payments: seedPayments,
    submissions: seedSubmissions,
  };
}

interface StoreShape {
  db: DB;
  currentUser: Profile;
  setCurrentUser: (p: Profile) => void;

  // student actions
  submitPayment: (input: {
    courseId: string;
    senderBkashNumber: string;
    trxId: string;
  }) => Promise<Payment>;
  submitQuiz: (lessonId: string, scorePct: number) => Promise<Submission>;
  submitAssignment: (input: {
    lessonId: string;
    imageUrls: string[];
    studentNote: string;
  }) => Promise<Submission>;

  // admin actions
  reviewPayment: (paymentId: string, status: "approved" | "rejected", note?: string) => Promise<void>;
  reviewAssignment: (
    submissionId: string,
    status: "approved" | "rejected" | "resubmit",
    marks?: number,
    feedbackBn?: string
  ) => Promise<void>;

  // derived helpers
  getEnrollment: (studentId: string, courseId: string) => Enrollment | undefined;
  isEnrolled: (studentId: string, courseId: string) => boolean;
  getLessonUnlockState: (studentId: string, courseId: string) => Record<string, boolean>;
}

const StoreContext = createContext<StoreShape | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(loadDB);
  const [currentUser, setCurrentUser] = useState<Profile>(demoStudent);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }, [db]);

  const value = useMemo<StoreShape>(() => {
    function getEnrollment(studentId: string, courseId: string) {
      return db.enrollments.find((e) => e.studentId === studentId && e.courseId === courseId);
    }

    function isEnrolled(studentId: string, courseId: string) {
      return !!getEnrollment(studentId, courseId);
    }

    // Sequential-unlock logic: lesson N+1 unlocks once lesson N's gate
    // (quiz >=80% or an approved assignment) has been cleared.
    function getLessonUnlockState(studentId: string, courseId: string) {
      const course = db.courses.find((c) => c.id === courseId);
      const state: Record<string, boolean> = {};
      if (!course) return state;
      let previousCleared = true;
      for (const lesson of [...course.lessons].sort((a, b) => a.position - b.position)) {
        state[lesson.id] = previousCleared;
        if (!lesson.requiresPass) {
          previousCleared = previousCleared; // no gate, stays open for next too
          continue;
        }
        const sub = db.submissions.find(
          (s) => s.studentId === studentId && s.lessonId === lesson.id && s.kind === lesson.requiresPass
        );
        if (lesson.requiresPass === "quiz") {
          previousCleared = !!sub && (sub.quizScorePct ?? 0) >= (lesson.quiz?.passingScore ?? 80);
        } else {
          previousCleared = !!sub && sub.status === "approved";
        }
      }
      return state;
    }

    async function submitPayment(input: { courseId: string; senderBkashNumber: string; trxId: string }) {
      // SUPABASE:// await supabase.from('payments').insert({...}).select().single()
      const course = db.courses.find((c) => c.id === input.courseId);
      const payment: Payment = {
        id: `p-${Date.now()}`,
        studentId: currentUser.id,
        studentName: currentUser.fullName,
        courseId: input.courseId,
        courseTitleBn: course?.titleBn ?? "",
        amountBdt: course?.priceBdt ?? 0,
        senderBkashNumber: input.senderBkashNumber,
        trxId: input.trxId,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setDb((prev) => ({ ...prev, payments: [payment, ...prev.payments] }));
      return payment;
    }

    async function reviewPayment(paymentId: string, status: "approved" | "rejected", note?: string) {
      // SUPABASE:// await supabase.from('payments').update({status, admin_note: note}).eq('id', paymentId)
      setDb((prev) => {
        const payment = prev.payments.find((p) => p.id === paymentId);
        const payments = prev.payments.map((p) =>
          p.id === paymentId ? { ...p, status, adminNote: note } : p
        );
        let enrollments = prev.enrollments;
        if (payment && status === "approved") {
          const already = prev.enrollments.find(
            (e) => e.studentId === payment.studentId && e.courseId === payment.courseId
          );
          if (!already) {
            // SUPABASE:// await supabase.from('enrollments').insert({...})
            enrollments = [
              ...prev.enrollments,
              {
                id: `e-${Date.now()}`,
                studentId: payment.studentId,
                courseId: payment.courseId,
                status: "active",
                progressPct: 0,
                currentLessonPosition: 1,
                enrolledAt: new Date().toISOString(),
              },
            ];
          }
        }
        return { ...prev, payments, enrollments };
      });
    }

    function recomputeProgress(prev: DB, studentId: string, courseId: string): Enrollment[] {
      const course = prev.courses.find((c) => c.id === courseId);
      if (!course) return prev.enrollments;
      const total = course.lessons.length;
      const unlock = (() => {
        let previousCleared = true;
        let clearedCount = 0;
        for (const lesson of [...course.lessons].sort((a, b) => a.position - b.position)) {
          if (!previousCleared) break;
          clearedCount += 1;
          if (!lesson.requiresPass) continue;
          const sub = prev.submissions.find(
            (s) => s.studentId === studentId && s.lessonId === lesson.id && s.kind === lesson.requiresPass
          );
          if (lesson.requiresPass === "quiz") {
            previousCleared = !!sub && (sub.quizScorePct ?? 0) >= (lesson.quiz?.passingScore ?? 80);
          } else {
            previousCleared = !!sub && sub.status === "approved";
          }
        }
        return clearedCount;
      })();
      const pct = Math.round((unlock / total) * 100);
      return prev.enrollments.map((e) =>
        e.studentId === studentId && e.courseId === courseId
          ? {
              ...e,
              progressPct: pct,
              currentLessonPosition: Math.min(unlock + 1, total),
              status: pct >= 100 ? "completed" : e.status,
              completedAt: pct >= 100 ? new Date().toISOString() : e.completedAt,
            }
          : e
      );
    }

    async function submitQuiz(lessonId: string, scorePct: number) {
      // SUPABASE:// await supabase.from('submissions').insert({kind:'quiz', quiz_score_pct: scorePct, ...})
      const lesson = db.courses.flatMap((c) => c.lessons).find((l) => l.id === lessonId);
      const submission: Submission = {
        id: `s-${Date.now()}`,
        studentId: currentUser.id,
        studentName: currentUser.fullName,
        lessonId,
        courseId: lesson?.courseId ?? "",
        kind: "quiz",
        quizScorePct: scorePct,
        status: scorePct >= (lesson?.quiz?.passingScore ?? 80) ? "approved" : "rejected",
        createdAt: new Date().toISOString(),
      };
      setDb((prev) => {
        const submissions = [submission, ...prev.submissions];
        const enrollments = recomputeProgress(
          { ...prev, submissions },
          currentUser.id,
          lesson?.courseId ?? ""
        );
        return { ...prev, submissions, enrollments };
      });
      return submission;
    }

    async function submitAssignment(input: { lessonId: string; imageUrls: string[]; studentNote: string }) {
      // SUPABASE:// await supabase.from('submissions').insert({kind:'assignment', image_urls: [...], ...})
      const lesson = db.courses.flatMap((c) => c.lessons).find((l) => l.id === input.lessonId);
      const submission: Submission = {
        id: `s-${Date.now()}`,
        studentId: currentUser.id,
        studentName: currentUser.fullName,
        lessonId: input.lessonId,
        courseId: lesson?.courseId ?? "",
        kind: "assignment",
        imageUrls: input.imageUrls,
        studentNote: input.studentNote,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setDb((prev) => ({ ...prev, submissions: [submission, ...prev.submissions] }));
      return submission;
    }

    async function reviewAssignment(
      submissionId: string,
      status: "approved" | "rejected" | "resubmit",
      marks?: number,
      feedbackBn?: string
    ) {
      // SUPABASE:// await supabase.from('submissions').update({status, marks, feedback_bn}).eq('id', submissionId)
      setDb((prev) => {
        const target = prev.submissions.find((s) => s.id === submissionId);
        const submissions = prev.submissions.map((s) =>
          s.id === submissionId ? { ...s, status, marks, feedbackBn } : s
        );
        const enrollments = target
          ? recomputeProgress({ ...prev, submissions }, target.studentId, target.courseId)
          : prev.enrollments;
        return { ...prev, submissions, enrollments };
      });
    }

    return {
      db,
      currentUser,
      setCurrentUser,
      submitPayment,
      submitQuiz,
      submitAssignment,
      reviewPayment,
      reviewAssignment,
      getEnrollment,
      isEnrolled,
      getLessonUnlockState,
    };
  }, [db, currentUser]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}

export { demoStudent, demoAdmin };
