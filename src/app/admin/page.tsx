import { redirect } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { createClient } from "~/lib/supabase/server";

interface Profile {
  id: string;
  email: string | null;
  created_at: string;
}

interface ScreeningResult {
  user_id: string;
  state_code: string;
  insurance_status: string;
  program_name: string | null;
  updated_at: string;
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (user.app_metadata?.is_admin !== true) {
    redirect("/");
  }

  const [
    { data: profiles, error: profilesError },
    { data: results, error: resultsError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("screening_results")
      .select(
        "user_id, state_code, insurance_status, program_name, updated_at",
      ),
  ]);

  const resultsByUserId = new Map(
    ((results ?? []) as ScreeningResult[]).map((r) => [r.user_id, r]),
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Everyone who's signed up, and the screening program they were last
          matched to.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
        </CardHeader>
        <CardContent>
          {profilesError || resultsError ? (
            <p className="text-sm text-destructive">
              Failed to load user data.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Email</th>
                    <th className="py-2 pr-4 font-medium">Date joined</th>
                    <th className="py-2 pr-4 font-medium">State</th>
                    <th className="py-2 pr-4 font-medium">Insurance</th>
                    <th className="py-2 pr-4 font-medium">Program received</th>
                  </tr>
                </thead>
                <tbody>
                  {((profiles ?? []) as Profile[]).map((profile) => {
                    const result = resultsByUserId.get(profile.id);
                    return (
                      <tr
                        key={profile.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-2 pr-4">{profile.email ?? "—"}</td>
                        <td className="py-2 pr-4">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-2 pr-4">
                          {result?.state_code ?? "—"}
                        </td>
                        <td className="py-2 pr-4">
                          {result ? (
                            <Badge variant="outline">
                              {result.insurance_status}
                            </Badge>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-2 pr-4">
                          {result
                            ? (result.program_name ?? "No program matched")
                            : "No questionnaire yet"}
                        </td>
                      </tr>
                    );
                  })}
                  {(profiles ?? []).length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-muted-foreground"
                      >
                        No users yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
