
-- Legacy `users` table removed. Auth is managed by Supabase `auth.users` and app profiles in `public.profiles`.

-- Profiles linked to Supabase Auth (preferred for security & scale)
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  role text not null default 'USER', -- USER account-level; classroom roles handled per membership
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on profiles(role);

-- Backfill note: the legacy `users` table can be migrated into `profiles`.
-- For new relations below we reference `profiles(user_id)` instead of `users(id)`.

create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  classroom_id uuid,
  created_by uuid,
  title text not null,
  description text,
  type text not null default 'CLASSROOM', -- QUIZ | MIDTERM | FINAL | PRACTICE
  duration_min int default 60,
  question_count int not null default 0,
  total_marks int not null default 0,
  status text not null default 'draft', -- draft | scheduled | open | closed
  available_from timestamptz,
  available_until timestamptz,
  due_at timestamptz,
  max_attempts int not null default 1,
  lock_on_start boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams(id) on delete cascade,
  user_id uuid not null,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  status text not null default 'in_progress', -- in_progress | submitted | graded
  auto_score numeric(6,2),
  manual_score numeric(6,2),
  total_score numeric(6,2),
  score numeric(6,2),
  unique (exam_id, user_id, started_at)
);

-- Ensure FK to profiles (drop old FK if present)
do $$ begin
  alter table attempts drop constraint if exists attempts_user_id_fkey;
exception when undefined_object then null;
end $$;

alter table if exists attempts
  add constraint attempts_user_id_fkey foreign key (user_id) references profiles(user_id) on delete cascade;

create index if not exists idx_attempts_user on attempts(user_id);
create index if not exists idx_attempts_exam on attempts(exam_id);

alter table if exists attempts
  add column if not exists status text not null default 'in_progress',
  add column if not exists auto_score numeric(6,2),
  add column if not exists manual_score numeric(6,2),
  add column if not exists total_score numeric(6,2),
  add column if not exists score numeric(6,2);

create table if not exists notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  type text not null,
  message text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

do $$ begin
  alter table notifications drop constraint if exists notifications_user_id_fkey;
exception when undefined_object then null;
end $$;

alter table if exists notifications
  add constraint notifications_user_id_fkey foreign key (user_id) references profiles(user_id) on delete cascade;

-- Classrooms and memberships
create table if not exists classrooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text,
  teacher_id uuid not null,
  code text unique not null,
  description text,
  schedule text,
  room text,
  color text,
  created_at timestamptz not null default now()
);

do $$ begin
  alter table classrooms drop constraint if exists classrooms_teacher_id_fkey;
exception when undefined_object then null;
end $$;

alter table if exists classrooms
  add constraint classrooms_teacher_id_fkey foreign key (teacher_id) references profiles(user_id) on delete cascade;

create table if not exists classroom_memberships (
  id uuid primary key default gen_random_uuid(),
  classroom_id uuid not null references classrooms(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'STUDENT', -- STUDENT | TEACHER
  status text not null default 'active',
  joined_at timestamptz not null default now(),
  unique(classroom_id, user_id)
);

do $$ begin
  alter table classroom_memberships drop constraint if exists classroom_memberships_user_id_fkey;
exception when undefined_object then null;
end $$;

alter table if exists classroom_memberships
  add constraint classroom_memberships_user_id_fkey foreign key (user_id) references profiles(user_id) on delete cascade;

-- Assignments/announcements (class-scoped)
create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  classroom_id uuid not null references classrooms(id) on delete cascade,
  title text not null,
  type text not null default 'assignment', -- assignment | quiz | exam
  due_at timestamptz,
  points int default 100,
  status text not null default 'active', -- draft | active | completed
  description text,
  created_at timestamptz not null default now()
);

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  classroom_id uuid not null references classrooms(id) on delete cascade,
  title text not null,
  content text not null,
  author text,
  created_at timestamptz not null default now()
);

-- Ensure exams metadata columns exist and constraints are in place
alter table if exists exams
  add column if not exists description text,
  add column if not exists classroom_id uuid,
  add column if not exists created_by uuid,
  add column if not exists total_marks int not null default 0,
  add column if not exists available_from timestamptz,
  add column if not exists available_until timestamptz,
  add column if not exists lock_on_start boolean not null default true;

alter table if exists exams
  alter column duration_min drop not null,
  alter column duration_min set default 60,
  alter column due_at drop not null,
  alter column type set default 'CLASSROOM',
  alter column status set default 'draft';

do $$ begin
  alter table exams drop constraint if exists exams_classroom_id_fkey;
exception when undefined_object then null;
end $$;

alter table if exists exams
  add constraint if not exists exams_classroom_id_fkey
  foreign key (classroom_id) references classrooms(id) on delete cascade;

do $$ begin
  alter table exams drop constraint if exists exams_created_by_fkey;
exception when undefined_object then null;
end $$;

alter table if exists exams
  add constraint if not exists exams_created_by_fkey
  foreign key (created_by) references profiles(user_id) on delete set null;

-- Exam questions and answers
create table if not exists exam_questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams(id) on delete cascade,
  prompt text not null,
  question_type text not null default 'mcq', -- mcq | text
  options jsonb,
  points int not null default 1,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_exam_questions_exam on exam_questions(exam_id);

create table if not exists exam_question_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references exam_questions(id) on delete cascade,
  correct_option_index int,
  correct_text_answer text,
  created_at timestamptz not null default now(),
  unique(question_id)
);

create table if not exists exam_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references attempts(id) on delete cascade,
  question_id uuid not null references exam_questions(id) on delete cascade,
  answer_option_index int,
  answer_text text,
  is_correct boolean,
  score_awarded numeric(6,2),
  created_at timestamptz not null default now(),
  unique(attempt_id, question_id)
);

create index if not exists idx_exam_attempt_answers_attempt on exam_attempt_answers(attempt_id);
create index if not exists idx_exam_attempt_answers_question on exam_attempt_answers(question_id);

-- Security events for monitoring
create table if not exists security_events (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references exams(id) on delete cascade,
  user_id uuid references profiles(user_id) on delete cascade,
  event_type text not null, -- tab_switch, copy_paste, webcam_off, etc.
  message text not null,
  created_at timestamptz not null default now()
);

-- Materials uploaded by teachers
create table if not exists materials (
  id uuid primary key default gen_random_uuid(),
  classroom_id uuid not null references classrooms(id) on delete cascade,
  title text not null,
  description text,
  file_url text,
  type text not null default 'document', -- document, video, image, link
  uploaded_at timestamptz not null default now(),
  uploaded_by uuid not null references profiles(user_id) on delete cascade
);

-- Student submissions for assignments
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  user_id uuid not null references profiles(user_id) on delete cascade,
  content text,
  file_url text,
  submitted_at timestamptz not null default now(),
  status text not null default 'submitted', -- submitted, graded, returned
  score decimal(5,2),
  feedback text,
  graded_at timestamptz,
  graded_by uuid references profiles(user_id),
  unique(assignment_id, user_id)
);

create index if not exists idx_materials_classroom on materials(classroom_id);
create index if not exists idx_submissions_assignment on submissions(assignment_id);
create index if not exists idx_submissions_user on submissions(user_id);


