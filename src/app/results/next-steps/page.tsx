import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BeforeYourAppointment,
  WhatToBring,
} from "~/components/screening-checklist";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { STATE_PROGRAMS } from "~/lib/screening-data";
import { createClient } from "~/lib/supabase/server";

/**
 * A focused, linear action plan for the uninsured/underinsured path — split
 * out from /results so it can be the single destination the "See your full
 * action plan" button points to, instead of duplicating this content on the
 * results page itself. Reads the user's last saved result rather than query
 * params, since it's only ever reached by clicking that button.
 */
export default async function NextStepsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/results/next-steps");
  }

  const { data: savedResult } = await supabase
    .from("screening_results")
    .select("state_code, insurance_status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!savedResult) {
    redirect("/navigator");
  }

  const program = STATE_PROGRAMS[savedResult.state_code];

  // The action-plan content (documents, test prep) only applies to the
  // matched, uninsured/underinsured path — send everyone else back to their
  // results rather than showing an empty or irrelevant plan.
  if (savedResult.insurance_status === "insured" || !program) {
    redirect("/results");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 py-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/results"
          className="w-fit text-sm text-muted-foreground underline hover:text-foreground"
        >
          ← Back to your results
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Your action plan</h1>
        <p className="text-muted-foreground">
          Everything to do, in order, to actually get screened through{" "}
          {program.programName}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Contact {program.programName}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <p className="text-sm font-medium">{program.contact}</p>
          {program.contactNote && (
            <CardDescription>{program.contactNote}</CardDescription>
          )}
          {program.website && (
            <a
              href={`https://${program.website}`}
              target="_blank"
              rel="noreferrer"
              className="w-fit text-sm underline hover:text-foreground"
            >
              {program.website}
            </a>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Ask two questions on that call</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm">
          <p>"Am I eligible?"</p>
          <p>"What do I need to bring?"</p>
        </CardContent>
      </Card>

      <div>
        <p className="mb-2 text-sm font-medium">3. What to bring</p>
        <WhatToBring program={program} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>4. Add your appointment to your calendar</CardTitle>
          <CardDescription>
            Do this as soon as it's scheduled — this is where plans quietly fall
            through.
          </CardDescription>
        </CardHeader>
      </Card>

      <div>
        <p className="mb-2 text-sm font-medium">5. Before your appointment</p>
        <BeforeYourAppointment program={program} />
      </div>

      {(program.providerFinderUrl || program.generalHealthDeptFinderUrl) && (
        <Card>
          <CardHeader>
            <CardTitle>6. Find a clinic</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a
                href={`https://${program.providerFinderUrl ?? program.generalHealthDeptFinderUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                {program.providerFinderUrl
                  ? "Find a clinic near you"
                  : "Find your local health department"}
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {program.ifDiagnosed && (
        <Card>
          <CardHeader>
            <CardTitle>If something is found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{program.ifDiagnosed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
