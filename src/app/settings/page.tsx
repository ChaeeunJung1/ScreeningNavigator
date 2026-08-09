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

  const { data: screeningResult } = await supabase
    .from("screening_results")
    .select("state_code, insurance_status, age, household_size, income")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <SettingsForm
      email={user.email ?? ""}
      screeningResult={screeningResult ?? null}
    />
  );
}
