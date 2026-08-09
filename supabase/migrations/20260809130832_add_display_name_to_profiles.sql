-- Adds a user-editable display name to profiles, for the Settings page.
-- profiles previously had no update policy (it was written only by the
-- handle_new_user trigger); this adds a narrow "update own row" policy so
-- a user can set their own display_name via the app.
alter table public.profiles
  add column if not exists display_name text;

create policy "profiles_update_own" on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
