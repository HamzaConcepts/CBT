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

-- Create classrooms
with t as (
  select user_id as teacher_id from profiles where email = 'teacher1@example.com'
)
insert into classrooms (name, subject, teacher_id, code, description, schedule, room, color)
select 'Advanced Mathematics', 'Mathematics', teacher_id, 'MATH2024', 'Advanced calculus and linear algebra concepts', 'Mon, Wed, Fri - 10:00 AM', 'Room 204', 'bg-gradient-to-br from-blue-500 to-purple-600' from t
union all
select 'Physics Laboratory', 'Physics', teacher_id, 'PHYS2024', 'Hands-on physics experiments and theory', 'Tue, Thu - 2:00 PM', 'Lab 2', 'bg-gradient-to-br from-green-500 to-teal-600' from t
on conflict (code) do nothing;

-- Enroll student into mathematics classroom
with s as (select user_id from profiles where email = 'student1@example.com'),
     c as (select id as classroom_id from classrooms where code = 'MATH2024')
insert into classroom_memberships (classroom_id, user_id, role, status)
select c.classroom_id, s.user_id, 'STUDENT', 'active' from s, c
on conflict do nothing;

-- Exams seeded for classroom scenarios
with teacher as (
  select user_id as teacher_id from profiles where email = 'teacher1@example.com'
), math as (
  select id as classroom_id from classrooms where code = 'MATH2024'
)
insert into exams (classroom_id, created_by, title, type, duration_min, question_count, total_marks, status, available_from, available_until, max_attempts, description)
select math.classroom_id, teacher.teacher_id, 'Mathematics Quiz 1', 'QUIZ', 30, 3, 20, 'open', now() - interval '1 day', now() + interval '2 days', 2, 'Core algebra and geometry concepts'
from teacher, math
where not exists (select 1 from exams where title = 'Mathematics Quiz 1');

with teacher as (
  select user_id as teacher_id from profiles where email = 'teacher1@example.com'
), physics as (
  select id as classroom_id from classrooms where code = 'PHYS2024'
)
insert into exams (classroom_id, created_by, title, type, duration_min, question_count, total_marks, status, available_from, available_until, max_attempts, description)
select physics.classroom_id, teacher.teacher_id, 'Physics Midterm', 'MIDTERM', 90, 4, 80, 'closed', now() - interval '14 days', now() - interval '7 days', 1, 'Comprehensive midterm on kinematics and dynamics'
from teacher, physics
where not exists (select 1 from exams where title = 'Physics Midterm');

with teacher as (
  select user_id as teacher_id from profiles where email = 'teacher1@example.com'
), math as (
  select id as classroom_id from classrooms where code = 'MATH2024'
)
insert into exams (classroom_id, created_by, title, type, duration_min, question_count, total_marks, status, available_from, available_until, max_attempts, description)
select math.classroom_id, teacher.teacher_id, 'Chemistry Final', 'FINAL', 120, 5, 100, 'scheduled', now() + interval '5 days', now() + interval '12 days', 1, 'Final assessment on thermodynamics and stoichiometry'
from teacher, math
where not exists (select 1 from exams where title = 'Chemistry Final');

-- Exam questions and answer keys for Mathematics Quiz 1
with exam as (select id from exams where title = 'Mathematics Quiz 1')
insert into exam_questions (exam_id, prompt, question_type, options, points, sort_order)
select exam.id, 'What is the value of x in the equation 2x + 5 = 15?', 'mcq', '["x = 5","x = 10","x = 7.5","x = 2.5"]'::jsonb, 5, 1
from exam
where not exists (
  select 1 from exam_questions q where q.exam_id = exam.id and q.prompt = 'What is the value of x in the equation 2x + 5 = 15?'
);

with exam as (select id from exams where title = 'Mathematics Quiz 1')
insert into exam_questions (exam_id, prompt, question_type, options, points, sort_order)
select exam.id, 'Which of the following is a prime number?', 'mcq', '["15","21","17","25"]'::jsonb, 5, 2
from exam
where not exists (
  select 1 from exam_questions q where q.exam_id = exam.id and q.prompt = 'Which of the following is a prime number?'
);

with exam as (select id from exams where title = 'Mathematics Quiz 1')
insert into exam_questions (exam_id, prompt, question_type, options, points, sort_order)
select exam.id, 'Explain the Pythagorean theorem in your own words.', 'text', null, 10, 3
from exam
where not exists (
  select 1 from exam_questions q where q.exam_id = exam.id and q.prompt = 'Explain the Pythagorean theorem in your own words.'
);

with question as (
  select id from exam_questions where prompt = 'What is the value of x in the equation 2x + 5 = 15?'
)
insert into exam_question_answers (question_id, correct_option_index)
select question.id, 0 from question
where not exists (select 1 from exam_question_answers a where a.question_id = question.id);

with question as (
  select id from exam_questions where prompt = 'Which of the following is a prime number?'
)
insert into exam_question_answers (question_id, correct_option_index)
select question.id, 2 from question
where not exists (select 1 from exam_question_answers a where a.question_id = question.id);

with question as (
  select id from exam_questions where prompt = 'Explain the Pythagorean theorem in your own words.'
)
insert into exam_question_answers (question_id, correct_text_answer)
select question.id, 'In a right triangle, the square of the hypotenuse equals the sum of the squares of the legs.' from question
where not exists (select 1 from exam_question_answers a where a.question_id = question.id);

-- Sample attempt data for Mathematics Quiz 1
with exam as (select id from exams where title = 'Mathematics Quiz 1'),
     student as (select user_id from profiles where email = 'student1@example.com'),
     target as (
       select exam.id as exam_id, student.user_id
       from exam, student
     ),
     inserted as (
       insert into attempts (exam_id, user_id, started_at, submitted_at, status, auto_score, manual_score, total_score, score)
       select target.exam_id, target.user_id, now() - interval '2 hours', now() - interval '90 minutes', 'submitted', 10, null, 10, 10
       from target
       where not exists (
         select 1 from attempts existing
         where existing.exam_id = target.exam_id and existing.user_id = target.user_id
       )
       returning id, exam_id, user_id
     ),
     fallback as (
       select id, exam_id, user_id
       from attempts
       where (exam_id, user_id) in (select exam_id, user_id from target)
       order by started_at desc
       limit 1
     ),
     attempt_row as (
       select * from inserted
       union all
       select * from fallback
       limit 1
     ),
     answer_seed as (
       select attempt_row.id as attempt_id,
              q.id as question_id,
              s.correct_option_index,
              s.correct_text_answer,
              s.is_correct,
              s.score_awarded
       from attempt_row
       join exam_questions q on q.exam_id = attempt_row.exam_id
       join (
         values
           ('What is the value of x in the equation 2x + 5 = 15?', 0, null, true, 5),
           ('Which of the following is a prime number?', 2, null, true, 5),
           ('Explain the Pythagorean theorem in your own words.', null, 'The square of the hypotenuse equals the sum of the squares of the legs.', null, null)
       ) as s(prompt, correct_option_index, correct_text_answer, is_correct, score_awarded)
         on q.prompt = s.prompt
     )
insert into exam_attempt_answers (attempt_id, question_id, answer_option_index, answer_text, is_correct, score_awarded)
select attempt_id,
       question_id,
       correct_option_index,
       correct_text_answer,
       is_correct,
       score_awarded
from answer_seed
where not exists (
  select 1 from exam_attempt_answers existing
  where existing.attempt_id = answer_seed.attempt_id
    and existing.question_id = answer_seed.question_id
);

-- Notifications for student demo
with s as (
  select user_id from profiles where email = 'student1@example.com'
)
insert into notifications (user_id, type, message)
select s.user_id, 'exam', 'Mathematics Quiz 1 is now open for 48 hours.' from s
union all
select s.user_id, 'exam', 'Chemistry Final will unlock in 5 days.' from s
union all
select s.user_id, 'grade', 'Physics Midterm feedback is available.' from s
on conflict do nothing;

-- Assignments
with c as (select id as classroom_id from classrooms where code = 'MATH2024')
insert into assignments (classroom_id, title, type, due_at, points, status, description)
select c.classroom_id, 'Calculus Problem Set 1', 'assignment', now() + interval '7 days', 100, 'active', 'Complete problems 1-15 from Chapter 3' from c
union all
select c.classroom_id, 'Linear Algebra Quiz', 'quiz', now() + interval '3 days', 50, 'completed', 'Matrix operations and transformations' from c
union all
select c.classroom_id, 'Midterm Exam', 'exam', now() + interval '20 days', 200, 'draft', 'Comprehensive exam covering chapters 1-5' from c
on conflict do nothing;

-- Announcements
with c as (select id as classroom_id from classrooms where code = 'MATH2024')
insert into announcements (classroom_id, title, content, author)
select c.classroom_id, 'Midterm Exam Schedule', 'The midterm exam will be held on February 1st. Please review chapters 1-5.', 'Teacher One' from c
union all
select c.classroom_id, 'Office Hours Update', 'Office hours have been moved to Tuesdays and Thursdays, 2-4 PM.', 'Teacher One' from c
on conflict do nothing;

-- Security events targeting the closed Physics Midterm
with s as (select user_id from profiles where email = 'student1@example.com'),
     e as (select id as exam_id from exams where title = 'Physics Midterm')
insert into security_events (exam_id, user_id, event_type, message)
select e.exam_id, s.user_id, 'warning', 'Suspicious activity detected for student Alice Johnson' from s, e
union all
select e.exam_id, s.user_id, 'info', 'New exam submission from Bob Smith' from s, e
union all
select e.exam_id, s.user_id, 'error', 'Potential cheating attempt flagged in Physics Midterm' from s, e
on conflict do nothing;


