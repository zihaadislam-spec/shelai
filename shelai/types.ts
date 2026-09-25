// =======================================================================
// Shelai LMS — shared domain types (mirrors supabase/schema.sql)
// =======================================================================

export type UserRole = "student" | "admin" | "instructor";

export interface Profile {
  id: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  lessonId: string;
  titleBn: string;
  passingScore: number; // percentage, default 80
  questions: QuizQuestion[];
}

export type GateKind = "quiz" | "assignment" | null;

export interface Lesson {
  id: string;
  courseId: string;
  position: number;
  titleBn: string;
  videoUrl: string;
  durationSeconds: number;
  contentBn: string;
  requiresPass: GateKind;
  assignmentInstructionsBn?: string;
  quiz?: Quiz;
}

export interface Course {
  id: string;
  slug: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  descriptionBn: string;
  coverImageUrl?: string;
  previewVideoUrl?: string;
  priceBdt: number;
  instructorName: string;
  instructorBio: string;
  instructorAvatarUrl?: string;
  level: "beginner" | "intermediate" | "advanced";
  isPublished: boolean;
  lessons: Lesson[];
}

export type PaymentStatus = "pending" | "approved" | "rejected";

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitleBn: string;
  amountBdt: number;
  senderBkashNumber: string;
  trxId: string;
  status: PaymentStatus;
  adminNote?: string;
  createdAt: string;
}

export type EnrollmentStatus = "active" | "completed" | "revoked";

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  progressPct: number;
  currentLessonPosition: number;
  enrolledAt: string;
  completedAt?: string;
}

export type SubmissionKind = "quiz" | "assignment";
export type SubmissionStatus = "pending" | "approved" | "rejected" | "resubmit";

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  lessonId: string;
  courseId: string;
  kind: SubmissionKind;
  quizScorePct?: number;
  imageUrls?: string[];
  studentNote?: string;
  marks?: number;
  feedbackBn?: string;
  status: SubmissionStatus;
  createdAt: string;
}
