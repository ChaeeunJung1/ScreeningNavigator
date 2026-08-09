-- One-time backfill: the on_auth_user_created trigger (added in
-- 20260804144458_add_profiles_and_screening_results.sql) only populates
-- public.profiles for auth.users rows inserted after the trigger was
-- created. Accounts that signed up before that migration was deployed
-- never got a matching profiles row, which made them invisible in the
-- admin view even though their screening_results rows exist.
--
-- This inserts a profiles row for every existing auth.users row that's
-- missing one. Safe to re-run: `on conflict (id) do nothing`.
insert into public.profiles (id, email, created_at)
select id, email, created_at
from auth.users
on conflict (id) do nothing;
