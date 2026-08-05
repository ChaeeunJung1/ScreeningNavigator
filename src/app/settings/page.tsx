import { redirect } from "next/navigation";
import { SettingsForm } from "~/components/settings-form";
import { createClient } from "~/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/settings");
  }

  return <SettingsForm email={user.email ?? ""} />;
}
