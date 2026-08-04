-- Mirror of auth.users for the app to query (auth.users isn't exposed via PostgREST).
-- Populated by a trigger on new signups; existing users need a one-time manual backfill.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "profiles_select_admin" on public.profiles
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true');

-- No insert/update/delete policies: rows are only ever written by the
-- trigger below (runs as table owner, bypasses RLS). profiles is
-- read-only from the app's perspective.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- One row per user: their most recent questionnaire outcome.
create table if not exists public.screening_results (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state_code text not null,
  insurance_status text not null,
  program_name text,
  updated_at timestamptz not null default now()
);

alter table public.screening_results enable row level security;

create policy "screening_results_insert_own" on public.screening_results
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "screening_results_update_own" on public.screening_results
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "screening_results_select_own" on public.screening_results
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "screening_results_select_admin" on public.screening_results
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true');

-- No delete policy: results are retained, not deleted, by the app.
