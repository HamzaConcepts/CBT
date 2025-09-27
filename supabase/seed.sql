-- NOTE: This seed now uses Supabase Auth + profiles. Ensure the following auth users exist:
--   student1@example.com, teacher1@example.com
-- You can create them via the Supabase dashboard or Auth Admin API. Then run this seed.

-- Upsert profiles for existing auth users
insert into profiles (user_id, email, name, role, phone)
select u.id, u.email, 'Student One', 'USER', null
from auth.users u
where u.email = 'student1@example.com'
on conflict (user_id) do update set email = excluded.email;

insert into profiles (user_id, email, name, role, phone)
select u.id, u.email, 'Teacher One', 'USER', null
from auth.users u
where u.email = 'teacher1@example.com'
on conflict (user_id) do update set email = excluded.email;

-- Exams
insert into exams (title, type, duration_min, question_count, status, due_at, max_attempts)
values
  ('Mathematics Quiz 1', 'QUIZ', 30, 20, 'available', now() + interval '2 days', 2),
  ('Physics Midterm', 'MIDTERM', 90, 40, 'completed', now() - interval '7 days', 1),
  ('Chemistry Final', 'FINAL', 120, 50, 'upcoming', now() + interval '5 days', 1),
  ('Programming Fundamentals', 'FINAL', 120, 20, 'upcoming', now() + interval '90 days', 1)
on conflict do nothing;

-- Create an attempt and score for Physics Midterm
with s as (
  select user_id from profiles where email = 'student1@example.com'
), e as (
  select id as exam_id from exams where title = 'Physics Midterm'
)
insert into attempts (exam_id, user_id, submitted_at, score)
select e.exam_id, s.user_id, now() - interval '6 days', 85 from s, e
on conflict do nothing;

-- Notifications
with s as (
  select user_id from profiles where email = 'student1@example.com'
)
insert into notifications (user_id, type, message)
select s.user_id, 'exam', 'New exam available: Mathematics Quiz 1' from s
union all
select s.user_id, 'grade', 'Grade posted for Physics Midterm: 85%' from s
union all
select s.user_id, 'reminder', 'Chemistry Final due in 3 days' from s;

-- Create classrooms
with t as (
  select user_id as teacher_id from profiles where email = 'teacher1@example.com'
)
insert into classrooms (name, subject, teacher_id, code, description, schedule, room, color)
select 'Advanced Mathematics', 'Mathematics', teacher_id, 'MATH2024', 'Advanced calculus and linear algebra concepts', 'Mon, Wed, Fri - 10:00 AM', 'Room 204', 'bg-gradient-to-br from-blue-500 to-purple-600' from t
union all
select 'Physics Laboratory', 'Physics', teacher_id, 'PHYS2024', 'Hands-on physics experiments and theory', 'Tue, Thu - 2:00 PM', 'Lab 2', 'bg-gradient-to-br from-green-500 to-teal-600' from t
on conflict (code) do nothing;

-- Enroll student into first classroom
with s as (select user_id from profiles where email='student1@example.com'),
     c as (select id as classroom_id from classrooms where code='MATH2024')
insert into classroom_memberships (classroom_id, user_id, role, status)
select c.classroom_id, s.user_id, 'STUDENT', 'active' from s, c
on conflict do nothing;

-- Link first exam to classroom and add questions
with c as (select id as classroom_id from classrooms where code='MATH2024'),
     e as (select id as exam_id from exams where title='Mathematics Quiz 1')
update exams set classroom_id = c.classroom_id from c, e where exams.id = e.exam_id;

with e as (select id as exam_id from exams where title='Mathematics Quiz 1')
insert into questions (exam_id, prompt, type, options, points, difficulty)
select e.exam_id, 'What is the value of x in the equation 2x + 5 = 15?', 'mcq', '["x = 5","x = 10","x = 7.5","x = 2.5"]', 5, 'medium' from e
union all
select e.exam_id, 'Which of the following is a prime number?', 'mcq', '["15","21","17","25"]', 5, 'easy' from e
union all
select e.exam_id, 'Explain the Pythagorean theorem in your own words.', 'short', null, 10, 'medium' from e
on conflict do nothing;

-- Assignments
with c as (select id as classroom_id from classrooms where code='MATH2024')
insert into assignments (classroom_id, title, type, due_at, points, status, description)
select c.classroom_id, 'Calculus Problem Set 1', 'assignment', now() + interval '7 days', 100, 'active', 'Complete problems 1-15 from Chapter 3' from c
union all
select c.classroom_id, 'Linear Algebra Quiz', 'quiz', now() + interval '3 days', 50, 'completed', 'Matrix operations and transformations' from c
union all
select c.classroom_id, 'Midterm Exam', 'exam', now() + interval '20 days', 200, 'draft', 'Comprehensive exam covering chapters 1-5' from c;

-- Announcements
with c as (select id as classroom_id from classrooms where code='MATH2024')
insert into announcements (classroom_id, title, content, author)
select c.classroom_id, 'Midterm Exam Schedule', 'The midterm exam will be held on February 1st. Please review chapters 1-5.', 'Teacher One' from c
union all
select c.classroom_id, 'Office Hours Update', 'Office hours have been moved to Tuesdays and Thursdays, 2-4 PM.', 'Teacher One' from c;

with s as (select user_id from profiles where email='student1@example.com'),
     e as (select id as exam_id from exams where title='Physics Midterm')
insert into security_events (exam_id, user_id, event_type, message)
select e.exam_id, s.user_id, 'warning', 'Suspicious activity detected for student Alice Johnson' from s, e
union all
select e.exam_id, s.user_id, 'info', 'New exam submission from Bob Smith' from s, e
union all
select e.exam_id, s.user_id, 'error', 'Potential cheating attempt flagged in Physics Midterm' from s, e;


