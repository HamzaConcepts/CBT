-- Fix profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles of classmates and teachers" ON profiles;

CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = user_id);

-- Fix classrooms policies  
DROP POLICY IF EXISTS "Teachers can manage their own classrooms" ON classrooms;
DROP POLICY IF EXISTS "Members can view their classrooms" ON classrooms;

CREATE POLICY "Anyone can view classrooms" ON classrooms
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create classrooms" ON classrooms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Teachers can update own classrooms" ON classrooms
  FOR UPDATE USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own classrooms" ON classrooms
  FOR DELETE USING (auth.uid() = teacher_id);

-- Fix memberships policies
DROP POLICY IF EXISTS "Users can view memberships in their classrooms" ON classroom_memberships;
DROP POLICY IF EXISTS "Teachers can manage memberships in their classrooms" ON classroom_memberships;
DROP POLICY IF EXISTS "Students can join classrooms" ON classroom_memberships;

CREATE POLICY "Users can view their memberships" ON classroom_memberships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join classrooms" ON classroom_memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can manage memberships in their classrooms" ON classroom_memberships
  FOR ALL USING (
    classroom_id IN (
      SELECT id FROM classrooms WHERE teacher_id = auth.uid()
    )
  );

-- Fix other table policies to be more permissive for debugging
DROP POLICY IF EXISTS "Teachers can manage exams in their classrooms" ON exams;
DROP POLICY IF EXISTS "Students can view exams in their classrooms" ON exams;

CREATE POLICY "Authenticated users can manage exams" ON exams
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can manage their own attempts" ON attempts;
DROP POLICY IF EXISTS "Teachers can view attempts for their exams" ON attempts;

CREATE POLICY "Authenticated users can manage attempts" ON attempts
  FOR ALL USING (auth.role() = 'authenticated');

-- Fix assignments policies
DROP POLICY IF EXISTS "Teachers can manage assignments in their classrooms" ON assignments;
DROP POLICY IF EXISTS "Students can view assignments in their classrooms" ON assignments;

CREATE POLICY "Authenticated users can manage assignments" ON assignments
  FOR ALL USING (auth.role() = 'authenticated');

-- Fix announcements policies
DROP POLICY IF EXISTS "Teachers can manage announcements in their classrooms" ON announcements;
DROP POLICY IF EXISTS "Students can view announcements in their classrooms" ON announcements;

CREATE POLICY "Authenticated users can manage announcements" ON announcements
  FOR ALL USING (auth.role() = 'authenticated');

-- Fix materials policies
DROP POLICY IF EXISTS "Teachers can manage materials in their classrooms" ON materials;
DROP POLICY IF EXISTS "Students can view materials in their classrooms" ON materials;

CREATE POLICY "Authenticated users can manage materials" ON materials
  FOR ALL USING (auth.role() = 'authenticated');

-- Fix submissions policies
DROP POLICY IF EXISTS "Students can manage their own submissions" ON submissions;
DROP POLICY IF EXISTS "Teachers can view submissions for their assignments" ON submissions;
DROP POLICY IF EXISTS "Teachers can update submissions for grading" ON submissions;

CREATE POLICY "Authenticated users can manage submissions" ON submissions
  FOR ALL USING (auth.role() = 'authenticated');

-- Fix notifications policies
DROP POLICY IF EXISTS "Users can manage their own notifications" ON notifications;

CREATE POLICY "Users can manage their own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- Fix security events policies
DROP POLICY IF EXISTS "System can log security events" ON security_events;
DROP POLICY IF EXISTS "Teachers can view security events for their exams" ON security_events;
DROP POLICY IF EXISTS "Users can view their own security events" ON security_events;

CREATE POLICY "Authenticated users can manage security events" ON security_events
  FOR ALL USING (auth.role() = 'authenticated');

-- Fix questions policies
DROP POLICY IF EXISTS "Teachers can manage questions for their exams" ON questions;
DROP POLICY IF EXISTS "Students can view questions during exams" ON questions;

CREATE POLICY "Authenticated users can manage questions" ON questions
  FOR ALL USING (auth.role() = 'authenticated');