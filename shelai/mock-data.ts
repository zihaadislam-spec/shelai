import type { Course, Payment, Enrollment, Submission, Profile } from "./types";

// -----------------------------------------------------------------------
// Demo users — swap for real Supabase auth.users + profiles rows
// -----------------------------------------------------------------------
export const demoStudent: Profile = {
  id: "u-student-1",
  fullName: "মিতু আক্তার",
  phone: "01711223344",
  role: "student",
};

export const demoAdmin: Profile = {
  id: "u-admin-1",
  fullName: "Admin — Shelai",
  role: "admin",
};

// -----------------------------------------------------------------------
// Courses + lessons + quizzes
// -----------------------------------------------------------------------
export const courses: Course[] = [
  {
    id: "c-basic",
    slug: "shilai-basic",
    titleBn: "সেলাই বেসিক",
    titleEn: "Sewing Basics",
    subtitleBn: "শূন্য থেকে হাতে-কলমে সেলাই শেখার সম্পূর্ণ কোর্স",
    descriptionBn:
      "মেশিন চেনা থেকে শুরু করে প্রথম পোশাক তৈরি পর্যন্ত ধাপে ধাপে শেখানো হবে এই কোর্সে। প্রতিটি লেসনের সাথে থাকছে অনুশীলন ও কুইজ।",
    priceBdt: 1500,
    instructorName: "রোকেয়া বেগম",
    instructorBio: "১৫ বছরের অভিজ্ঞ দর্জি প্রশিক্ষক, ৩০০০+ শিক্ষার্থী তৈরি করেছেন।",
    level: "beginner",
    isPublished: true,
    previewVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    lessons: [
      {
        id: "l-b1",
        courseId: "c-basic",
        position: 1,
        titleBn: "সেলাই মেশিনের পরিচিতি",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        durationSeconds: 620,
        contentBn: "সেলাই মেশিনের প্রতিটি অংশ চেনা এবং সুতা লাগানোর নিয়ম।",
        requiresPass: "quiz",
        quiz: {
          id: "q-b1",
          lessonId: "l-b1",
          titleBn: "মেশিন পরিচিতি কুইজ",
          passingScore: 80,
          questions: [
            {
              question: "সেলাই মেশিনের নিচের সুতাকে কী বলা হয়?",
              options: ["ববিন থ্রেড", "নিডেল থ্রেড", "হেম থ্রেড", "প্রেসার থ্রেড"],
              correctIndex: 0,
            },
            {
              question: "কাপড় আটকে রাখার অংশটির নাম কী?",
              options: ["ববিন কেস", "প্রেসার ফুট", "টেনশন ডায়াল", "স্পুল পিন"],
              correctIndex: 1,
            },
            {
              question: "সুই ভেঙে গেলে প্রথমে কী করা উচিত?",
              options: [
                "মেশিন চালু রাখা",
                "মেশিন বন্ধ করে সুই বদলানো",
                "কাপড় টেনে বের করা",
                "গতি বাড়ানো",
              ],
              correctIndex: 1,
            },
          ],
        },
      },
      {
        id: "l-b2",
        courseId: "c-basic",
        position: 2,
        titleBn: "সোজা সেলাই ও কোনা ঘোরানো",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        durationSeconds: 540,
        contentBn: "সোজা লাইনে সেলাই এবং কোনায় কীভাবে মসৃণভাবে ঘুরতে হয়।",
        requiresPass: "assignment",
        assignmentInstructionsBn:
          "একটি A4 কাগজে আঁকা রেখা বরাবর কাপড়ে সোজা সেলাই করুন এবং একটি কোনা ঘুরিয়ে দেখান। কাজের ছবি তুলে জমা দিন।",
      },
      {
        id: "l-b3",
        courseId: "c-basic",
        position: 3,
        titleBn: "হেমিং ও বাটনহোল",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        durationSeconds: 700,
        contentBn: "কাপড়ের কিনারা ভাঁজ করে হেম করা এবং বোতামের ফুটো তৈরি।",
        requiresPass: "quiz",
        quiz: {
          id: "q-b3",
          lessonId: "l-b3",
          titleBn: "হেমিং কুইজ",
          passingScore: 80,
          questions: [
            {
              question: "হেমের জন্য কাপড় সাধারণত কতবার ভাঁজ করা হয়?",
              options: ["একবার", "দুইবার", "তিনবার", "ভাঁজ করা লাগে না"],
              correctIndex: 1,
            },
            {
              question: "বাটনহোলের আকার নির্ভর করে কীসের উপর?",
              options: ["সুতার রঙ", "বোতামের আকার", "কাপড়ের রঙ", "মেশিনের ব্র্যান্ড"],
              correctIndex: 1,
            },
          ],
        },
      },
      {
        id: "l-b4",
        courseId: "c-basic",
        position: 4,
        titleBn: "প্রথম পোশাক: সাধারণ ব্লাউজ",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        durationSeconds: 900,
        contentBn: "মাপ নেওয়া থেকে সম্পূর্ণ ব্লাউজ তৈরি — চূড়ান্ত প্রজেক্ট।",
        requiresPass: null,
      },
    ],
  },
  {
    id: "c-advance",
    slug: "shilai-advance",
    titleBn: "সেলাই এডভান্স",
    titleEn: "Sewing Advanced",
    subtitleBn: "পোশাক ডিজাইন ও প্যাটার্ন মেকিং",
    descriptionBn:
      "বেসিক কোর্স শেষ করার পর প্যাটার্ন ড্রাফটিং, ফিটিং ও ডিজাইনার পোশাক তৈরি শিখুন।",
    priceBdt: 2500,
    instructorName: "রোকেয়া বেগম",
    instructorBio: "১৫ বছরের অভিজ্ঞ দর্জি প্রশিক্ষক, ৩০০০+ শিক্ষার্থী তৈরি করেছেন।",
    level: "advanced",
    isPublished: true,
    previewVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    lessons: [
      {
        id: "l-a1",
        courseId: "c-advance",
        position: 1,
        titleBn: "প্যাটার্ন ড্রাফটিং বেসিক",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        durationSeconds: 800,
        contentBn: "মাপ অনুযায়ী কাগজে প্যাটার্ন আঁকার নিয়ম।",
        requiresPass: "quiz",
        quiz: {
          id: "q-a1",
          lessonId: "l-a1",
          titleBn: "প্যাটার্ন কুইজ",
          passingScore: 80,
          questions: [
            {
              question: "প্যাটার্ন ড্রাফটিং-এ 'dart' বলতে কী বোঝায়?",
              options: [
                "কাপড় কাটার কাঁচি",
                "শরীরের বক্রতা অনুযায়ী ভাঁজ",
                "সুতার প্রকার",
                "বোতামের অবস্থান",
              ],
              correctIndex: 1,
            },
          ],
        },
      },
      {
        id: "l-a2",
        courseId: "c-advance",
        position: 2,
        titleBn: "ফিটিং ও অ্যাডজাস্টমেন্ট",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        durationSeconds: 640,
        contentBn: "পরার পর পোশাকের মাপ ঠিক করার কৌশল।",
        requiresPass: "assignment",
        assignmentInstructionsBn: "একটি তৈরি পোশাকে ফিটিং অ্যাডজাস্টমেন্ট করে ছবি জমা দিন।",
      },
    ],
  },
  {
    id: "c-crochet",
    slug: "crochet",
    titleBn: "কুশিকাটা (Crochet)",
    titleEn: "Crochet Craft",
    subtitleBn: "ক্রোশে দিয়ে শৌখিন জিনিস তৈরি",
    descriptionBn: "ক্রোশে হুক ধরা থেকে শুরু করে ব্যাগ, টুপি ও শোপিস তৈরি শিখুন।",
    priceBdt: 1200,
    instructorName: "নাসরিন সুলতানা",
    instructorBio: "হস্তশিল্প বিশেষজ্ঞ, অনলাইনে ৫০০০+ শিক্ষার্থী।",
    level: "beginner",
    isPublished: true,
    previewVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    lessons: [
      {
        id: "l-c1",
        courseId: "c-crochet",
        position: 1,
        titleBn: "চেইন স্টিচ ও বেসিক গিঁট",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        durationSeconds: 480,
        contentBn: "ক্রোশের প্রথম ধাপ — চেইন স্টিচ শেখা।",
        requiresPass: "quiz",
        quiz: {
          id: "q-c1",
          lessonId: "l-c1",
          titleBn: "চেইন স্টিচ কুইজ",
          passingScore: 80,
          questions: [
            {
              question: "ক্রোশের সবচেয়ে প্রথম শেখা স্টিচ কোনটি?",
              options: ["চেইন স্টিচ", "ডাবল ক্রোশে", "ট্রেবল স্টিচ", "স্লিপ স্টিচ"],
              correctIndex: 0,
            },
          ],
        },
      },
    ],
  },
  {
    id: "c-embroidery",
    slug: "hand-embroidery",
    titleBn: "হ্যান্ড এম্ব্রোডারি",
    titleEn: "Hand Embroidery",
    subtitleBn: "হাতের কাজে নকশা ফুটিয়ে তোলা",
    descriptionBn: "সুই-সুতার হাতের কাজে ফুল, লতাপাতা ও নকশা ফুটিয়ে তোলা শিখুন।",
    priceBdt: 1800,
    instructorName: "নাসরিন সুলতানা",
    instructorBio: "হস্তশিল্প বিশেষজ্ঞ, অনলাইনে ৫০০০+ শিক্ষার্থী।",
    level: "intermediate",
    isPublished: true,
    previewVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    lessons: [
      {
        id: "l-e1",
        courseId: "c-embroidery",
        position: 1,
        titleBn: "রানিং স্টিচ ও ব্যাকস্টিচ",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        durationSeconds: 560,
        contentBn: "হাতের কাজের সবচেয়ে বেসিক দুটি স্টিচ।",
        requiresPass: "assignment",
        assignmentInstructionsBn: "একটি কাপড়ের টুকরায় রানিং স্টিচ ও ব্যাকস্টিচ করে ছবি জমা দিন।",
      },
    ],
  },
];

// -----------------------------------------------------------------------
// Enrollments — demoStudent is enrolled in the basic course already,
// having passed lesson 1's quiz, currently unlocked up to lesson 2.
// -----------------------------------------------------------------------
export const enrollments: Enrollment[] = [
  {
    id: "e-1",
    studentId: demoStudent.id,
    courseId: "c-basic",
    status: "active",
    progressPct: 25,
    currentLessonPosition: 2,
    enrolledAt: "2026-08-01T10:00:00Z",
  },
];

// -----------------------------------------------------------------------
// Payments (manual Bkash verification queue)
// -----------------------------------------------------------------------
export const payments: Payment[] = [
  {
    id: "p-1",
    studentId: demoStudent.id,
    studentName: demoStudent.fullName,
    courseId: "c-basic",
    courseTitleBn: "সেলাই বেসিক",
    amountBdt: 1500,
    senderBkashNumber: "01711223344",
    trxId: "8N7K2X9QZP",
    status: "approved",
    createdAt: "2026-08-01T09:40:00Z",
  },
  {
    id: "p-2",
    studentId: "u-student-2",
    studentName: "শারমিন জাহান",
    courseId: "c-crochet",
    courseTitleBn: "কুশিকাটা (Crochet)",
    amountBdt: 1200,
    senderBkashNumber: "01911556677",
    trxId: "5T2M8Y1LWN",
    status: "pending",
    createdAt: "2026-09-24T14:12:00Z",
  },
  {
    id: "p-3",
    studentId: "u-student-3",
    studentName: "ফাহিমা আক্তার",
    courseId: "c-advance",
    courseTitleBn: "সেলাই এডভান্স",
    amountBdt: 2500,
    senderBkashNumber: "01611998877",
    trxId: "3Q9R4T7VBC",
    status: "pending",
    createdAt: "2026-09-25T08:05:00Z",
  },
];

// -----------------------------------------------------------------------
// Submissions (quiz results + assignment uploads)
// -----------------------------------------------------------------------
export const submissions: Submission[] = [
  {
    id: "s-1",
    studentId: demoStudent.id,
    studentName: demoStudent.fullName,
    lessonId: "l-b1",
    courseId: "c-basic",
    kind: "quiz",
    quizScorePct: 100,
    status: "approved",
    createdAt: "2026-08-02T11:00:00Z",
  },
  {
    id: "s-2",
    studentId: "u-student-2",
    studentName: "শারমিন জাহান",
    lessonId: "l-c1",
    courseId: "c-crochet",
    kind: "assignment",
    imageUrls: ["https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400"],
    studentNote: "প্রথমবার চেষ্টা করেছি, একটু আঁকাবাঁকা হয়েছে।",
    status: "pending",
    createdAt: "2026-09-23T16:30:00Z",
  },
];
