-- The original screening_results/profiles migration relied on the legacy
-- "auto_expose_new_tables" default (new tables reachable by Data API roles
-- without explicit GRANTs). That default is now off, so authenticated
-- requests to these tables fail with "permission denied" even though RLS
-- policies already restrict access correctly. Grant the privileges RLS
-- expects to enforce.
grant select, insert, update on public.screening_results to authenticated;
grant select on public.profiles to authenticated;
