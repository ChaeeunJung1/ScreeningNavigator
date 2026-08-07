import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "~/env";

/**
 * Admin client — uses the service role key and bypasses Row Level Security.
 *
 * SERVER-ONLY. Never import this from a Client Component or route that
 * runs in the browser. Only call it from Server Actions / Route Handlers
 * that have already verified the caller is an admin.
 */
export function createAdminClient() {
  return createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
