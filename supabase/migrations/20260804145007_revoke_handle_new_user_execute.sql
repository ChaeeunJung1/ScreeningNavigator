-- handle_new_user() is a SECURITY DEFINER trigger function, only meant to run
-- automatically on auth.users inserts. Postgres grants EXECUTE to PUBLIC by
-- default on new functions, which would let anon/authenticated call it
-- directly via /rest/v1/rpc/handle_new_user. Trigger execution doesn't need
-- this grant, so revoke it.
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;
