-- Enable RLS on all tables
alter table profiles enable row level security;
alter table exams enable row level security;
alter table attempts enable row level security;
alter table notifications enable row level security;
alter table classrooms enable row level security;
alter table classroom_memberships enable row level security;
alter table assignments enable row level security;
alter table announcements enable row level security;
alter table exam_questions enable row level security;
alter table exam_question_answers enable row level security;
alter table exam_attempt_answers enable row level security;
alter table security_events enable row level security;
alter table materials enable row level security;
alter table submissions enable row level security;

-- Profiles policies
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = user_id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = user_id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = user_id);

-- Allow users to view other profiles they interact with (classmates, teachers)
create policy "Users can view profiles of classmates and teachers" on profiles
  for select using (
    user_id in (
      select cm.user_id from classroom_memberships cm
      where cm.classroom_id in (
        select classroom_id from classroom_memberships 
        where user_id = auth.uid()
      )
    )
  );

-- Classrooms policies
create policy "Teachers can manage their own classrooms" on classrooms
  for all using (auth.uid() = teacher_id);

create policy "Members can view their classrooms" on classrooms
  for select using (
    id in (
      select classroom_id from classroom_memberships 
      where user_id = auth.uid()
    )
  );

-- Classroom memberships policies
create policy "Users can view memberships in their classrooms" on classroom_memberships
  for select using (
    classroom_id in (
      select classroom_id from classroom_memberships 
      where user_id = auth.uid()
    )
  );

create policy "Teachers can manage memberships in their classrooms" on classroom_memberships
  for all using (
    classroom_id in (
      select id from classrooms where teacher_id = auth.uid()
    )
  );

create policy "Students can join classrooms" on classroom_memberships
  for insert with check (auth.uid() = user_id and role = 'STUDENT');

-- Exams policies
create policy "Teachers can manage exams in their classrooms" on exams
  for all using (
    classroom_id in (
      select id from classrooms where teacher_id = auth.uid()
    )
  );

create policy "Students can view exams in their classrooms" on exams
  for select using (
    classroom_id in (
      select classroom_id from classroom_memberships 
      where user_id = auth.uid() and role = 'STUDENT'
    )
  );

-- Attempts policies
create policy "Users can manage their own attempts" on attempts
  for all using (auth.uid() = user_id);

create policy "Teachers can view attempts for their exams" on attempts
  for select using (
    exam_id in (
      select e.id from exams e
      join classrooms c on e.classroom_id = c.id
      where c.teacher_id = auth.uid()
    )
  );

-- Exam question policies
create policy "Teachers can manage exam questions" on exam_questions
  for all using (
    exam_id in (
      select e.id from exams e
      join classrooms c on e.classroom_id = c.id
      where c.teacher_id = auth.uid()
    )
  );

create policy "Students can view exam questions when enrolled" on exam_questions
  for select using (
    exam_id in (
      select e.id from exams e
      join classrooms c on e.classroom_id = c.id
      join classroom_memberships cm on c.id = cm.classroom_id
      where cm.user_id = auth.uid() and cm.role = 'STUDENT'
    )
  );

-- Exam question answer policies
create policy "Teachers manage exam answer keys" on exam_question_answers
  for all using (
    question_id in (
      select q.id from exam_questions q
      join exams e on q.exam_id = e.id
      join classrooms c on e.classroom_id = c.id
      where c.teacher_id = auth.uid()
    )
  );

-- Exam attempt answer policies
create policy "Students can manage their exam responses" on exam_attempt_answers
  for all using (
    attempt_id in (
      select a.id from attempts a where a.user_id = auth.uid()
    )
  );

create policy "Teachers can view exam responses" on exam_attempt_answers
  for select using (
    attempt_id in (
      select a.id from attempts a
      join exams e on a.exam_id = e.id
      join classrooms c on e.classroom_id = c.id
      where c.teacher_id = auth.uid()
    )
  );

-- Assignments policies
create policy "Teachers can manage assignments in their classrooms" on assignments
  for all using (
    classroom_id in (
      select id from classrooms where teacher_id = auth.uid()
    )
  );

create policy "Students can view assignments in their classrooms" on assignments
  for select using (
    classroom_id in (
      select classroom_id from classroom_memberships 
      where user_id = auth.uid() and role = 'STUDENT'
    )
  );

-- Submissions policies
create policy "Students can manage their own submissions" on submissions
  for all using (auth.uid() = user_id);

create policy "Teachers can view submissions for their assignments" on submissions
  for select using (
    assignment_id in (
      select a.id from assignments a
      join classrooms c on a.classroom_id = c.id
      where c.teacher_id = auth.uid()
    )
  );

create policy "Teachers can update submissions for grading" on submissions
  for update using (
    assignment_id in (
      select a.id from assignments a
      join classrooms c on a.classroom_id = c.id
      where c.teacher_id = auth.uid()
    )
  );

-- Materials policies
create policy "Teachers can manage materials in their classrooms" on materials
  for all using (
    classroom_id in (
      select id from classrooms where teacher_id = auth.uid()
    )
  );

create policy "Students can view materials in their classrooms" on materials
  for select using (
    classroom_id in (
      select classroom_id from classroom_memberships 
      where user_id = auth.uid() and role = 'STUDENT'
    )
  );

-- Announcements policies
create policy "Teachers can manage announcements in their classrooms" on announcements
  for all using (
    classroom_id in (
      select id from classrooms where teacher_id = auth.uid()
    )
  );

create policy "Students can view announcements in their classrooms" on announcements
  for select using (
    classroom_id in (
      select classroom_id from classroom_memberships 
      where user_id = auth.uid() and role = 'STUDENT'
    )
  );

-- Notifications policies
create policy "Users can manage their own notifications" on notifications
  for all using (auth.uid() = user_id);

-- Security events policies
create policy "System can log security events" on security_events
  for insert with check (true);

create policy "Teachers can view security events for their exams" on security_events
  for select using (
    exam_id in (
      select e.id from exams e
      join classrooms c on e.classroom_id = c.id
      where c.teacher_id = auth.uid()
    )
  );

create policy "Users can view their own security events" on security_events
  for select using (auth.uid() = user_id);