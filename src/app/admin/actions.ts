"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "~/lib/supabase/admin";
import { createClient } from "~/lib/supabase/server";

/**
 * Every action here re-checks that the caller is an admin, independent of
 * the page-level redirect in admin/page.tsx — Server Actions are callable
 * directly, so the page's own gate isn't enough on its own.
 */
async function assertIsAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.is_admin !== true) {
    throw new Error("Not authorized.");
  }

  return user;
}

export async function setAdminStatus(userId: string, isAdmin: boolean) {
  const caller = await assertIsAdmin();

  if (userId === caller.id && !isAdmin) {
    throw new Error("You can't remove your own admin access.");
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    app_metadata: { is_admin: isAdmin },
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export async function deleteUserAccount(userId: string) {
  const caller = await assertIsAdmin();

  if (userId === caller.id) {
    throw new Error("You can't delete your own account.");
  }

  const admin = createAdminClient();
  // profiles and screening_results both reference auth.users with
  // `on delete cascade`, so this removes their rows too.
  const { error } = await admin.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}
