-- =====================================================================
-- Shelai (সেলাই) LMS — Supabase / PostgreSQL Schema
-- Craft & sewing academy learning platform
-- =====================================================================

-- ---------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
create type user_role        as enum ('student', 'admin', 'instructor');
create type payment_status   as enum ('pending', 'approved', 'rejected');
create type submission_kind  as enum ('quiz', 'assignment');
create type submission_status as enum ('pending', 'approved', 'rejected', 'resubmit');
create type enrollment_status as enum ('active', 'completed', 'revoked');

-- ---------------------------------------------------------------------
-- profiles  (mirrors auth.users, 1:1)
-- ---------------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  phone         text,
  avatar_url    text,
  role          user_role not null default 'student',
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- courses
-- ---------------------------------------------------------------------
create table public.courses (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title_bn        text not null,          -- সেলাই বেসিক
  title_en        text,
  subtitle_bn     text,
  description_bn  text,
  cover_image_url text,
  preview_video_url text,
  price_bdt       numeric(10,2) not null default 0,
  instructor_name text not null,
  instructor_bio  text,
  instructor_avatar_url text,
  level           text default 'beginner', -- beginner | intermediate | advanced
  is_published    boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- lessons (belong to a course, ordered, sequentially unlocked)
-- ---------------------------------------------------------------------
create table public.lessons (
  id              uuid primary key default gen_random_uuid(),
  course_id       uuid not null references public.courses(id) on delete cascade,
  position        integer not null,             -- 1-based order, unlock sequence
  title_bn        text not null,
  video_url       text,                          -- youtube/vimeo/html5 src
  duration_seconds integer,
  content_bn      text,                          -- notes / description markdown
  requires_pass   submission_kind,               -- 'quiz' | 'assignment' | null (no gate)
  assignment_instructions_bn text,
  created_at      timestamptz not null default now(),
  unique (course_id, position)
);

-- ---------------------------------------------------------------------
-- quizzes (one quiz can belong to a lesson)
-- ---------------------------------------------------------------------
create table public.quizzes (
  id            uuid primary key default gen_random_uuid(),
  lesson_id     uuid not null references public.lessons(id) on delete cascade,
  title_bn      text not null,
  passing_score integer not null default 80,     -- percentage required to unlock next lesson
  questions     jsonb not null default '[]',      -- [{question, options[], correct_index}]
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- enrollments (student <-> course)
-- ---------------------------------------------------------------------
create table public.enrollments (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid not null references public.profiles(id) on delete cascade,
  course_id       uuid not null references public.courses(id) on delete cascade,
  status          enrollment_status not null default 'active',
  progress_pct    integer not null default 0,
  current_lesson_position integer not null default 1,
  enrolled_at     timestamptz not null default now(),
  completed_at    timestamptz,
  unique (student_id, course_id)
);

-- ---------------------------------------------------------------------
-- payments (manual Bkash verification flow)
-- ---------------------------------------------------------------------
create table public.payments (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references public.profiles(id) on delete cascade,
  course_id         uuid not null references public.courses(id) on delete cascade,
  amount_bdt        numeric(10,2) not null,
  bkash_receive_number text not null default '01818344414',
  sender_bkash_number text not null,
  trx_id            text not null,
  status            payment_status not null default 'pending',
  admin_note        text,
  reviewed_by        uuid references public.profiles(id),
  reviewed_at        timestamptz,
  created_at         timestamptz not null default now(),
  unique (trx_id)
);

-- ---------------------------------------------------------------------
-- submissions (quiz attempts + assignment uploads, gate progression)
-- ---------------------------------------------------------------------
create table public.submissions (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.profiles(id) on delete cascade,
  lesson_id     uuid not null references public.lessons(id) on delete cascade,
  kind          submission_kind not null,
  -- quiz fields
  quiz_score_pct integer,
  quiz_answers   jsonb,
  -- assignment fields
  image_urls     text[],
  student_note   text,
  marks          integer,               -- 0-100, set by admin
  feedback_bn    text,
  status         submission_status not null default 'pending',
  reviewed_by    uuid references public.profiles(id),
  reviewed_at    timestamptz,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Helpful indexes
-- ---------------------------------------------------------------------
create index idx_lessons_course        on public.lessons(course_id, position);
create index idx_enrollments_student   on public.enrollments(student_id);
create index idx_enrollments_course    on public.enrollments(course_id);
create index idx_payments_status       on public.payments(status);
create index idx_submissions_lesson    on public.submissions(lesson_id);
create index idx_submissions_student   on public.submissions(student_id, status);

-- ---------------------------------------------------------------------
-- updated_at trigger for courses
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_courses_updated_at
before update on public.courses
for each row execute procedure public.set_updated_at();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles     enable row level security;
alter table public.courses      enable row level security;
alter table public.lessons      enable row level security;
alter table public.quizzes      enable row level security;
alter table public.enrollments  enable row level security;
alter table public.payments     enable row level security;
alter table public.submissions  enable row level security;

-- profiles: users can read/update their own row; admins can read all
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- courses: published courses are public; admins manage all
create policy "courses_public_read"
  on public.courses for select
  using (is_published = true or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "courses_admin_write"
  on public.courses for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- lessons: only visible to enrolled students (or admins); preview lesson (position=1) public
create policy "lessons_enrolled_or_admin"
  on public.lessons for select
  using (
    position = 1
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
    or exists (
      select 1 from public.enrollments e
      where e.course_id = lessons.course_id and e.student_id = auth.uid() and e.status = 'active'
    )
  );

create policy "lessons_admin_write"
  on public.lessons for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- enrollments: student sees own; admin sees all
create policy "enrollments_own_or_admin"
  on public.enrollments for select
  using (student_id = auth.uid() or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "enrollments_admin_write"
  on public.enrollments for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- payments: student can insert/select own; admin can select/update all
create policy "payments_student_insert"
  on public.payments for insert
  with check (student_id = auth.uid());

create policy "payments_own_or_admin_select"
  on public.payments for select
  using (student_id = auth.uid() or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "payments_admin_update"
  on public.payments for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- submissions: student inserts/selects own; admin selects/updates all
create policy "submissions_student_insert"
  on public.submissions for insert
  with check (student_id = auth.uid());

create policy "submissions_own_or_admin_select"
  on public.submissions for select
  using (student_id = auth.uid() or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "submissions_admin_update"
  on public.submissions for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- =====================================================================
-- Seed data
-- =====================================================================
insert into public.courses (slug, title_bn, title_en, subtitle_bn, price_bdt, instructor_name, level, is_published, cover_image_url)
values
  ('shilai-basic',   'সেলাই বেসিক',        'Sewing Basics',    'শূন্য থেকে সেলাই শেখার সম্পূর্ণ কোর্স', 1500, 'রোকেয়া বেগম', 'beginner',     true, ''),
  ('shilai-advance', 'সেলাই এডভান্স',      'Sewing Advanced',  'পোশাক ডিজাইন ও প্যাটার্ন মেকিং',        2500, 'রোকেয়া বেগম', 'advanced',     true, ''),
  ('crochet',        'কুশিকাটা (Crochet)', 'Crochet Craft',    'ক্রোশে দিয়ে শৌখিন জিনিস তৈরি',          1200, 'নাসরিন সুলতানা', 'beginner',   true, ''),
  ('hand-embroidery','হ্যান্ড এম্ব্রোডারি', 'Hand Embroidery',  'হাতের কাজে নকশা ফুটিয়ে তোলা',           1800, 'নাসরিন সুলতানা', 'intermediate', true, '');
