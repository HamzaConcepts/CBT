-- Create a view that combines classroom memberships with auth.users data
-- This eliminates the need for the profiles table for basic user info

create or replace view classroom_roster as
select 
  cm.id,
  cm.classroom_id,
  cm.user_id,
  cm.role,
  cm.status,
  cm.joined_at,
  au.email,
  coalesce(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1)
  ) as name,
  au.created_at as user_created_at,
  au.last_sign_in_at
from classroom_memberships cm
left join auth.users au on cm.user_id = au.id;

-- Grant access to the view
grant select on classroom_roster to authenticated;

-- Note: Views cannot have RLS enabled directly. 
-- Security is handled through the underlying classroom_memberships table RLS policies.