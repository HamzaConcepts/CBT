-- Fix missing profiles for existing users
-- This query will create profile records for any auth.users who don't have profiles

INSERT INTO public.profiles (user_id, email, name, role)
SELECT 
  au.id as user_id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1)
  ) as name,
  'STUDENT' as role
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.user_id IS NULL
AND au.email_confirmed_at IS NOT NULL;

-- Update any existing profiles that have null names
UPDATE public.profiles
SET name = COALESCE(
  name,
  split_part(email, '@', 1)
)
WHERE name IS NULL OR name = '';