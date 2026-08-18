import Link from "next/link";
import { redirect } from "next/navigation";
import { PrintButton } from "~/components/print-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DISPUTE_SCRIPTS,
  DOL_EBSA_CONTACT,
  type EmployerPlanFunding,
  getEscalationPath,
  type InsurancePlanType,
  MEDICARE_COMPLAINT_CONTACT,
  NATIONAL_INSURANCE_COMPLAINT_FALLBACK,
  STATE_PROGRAMS,
  US_STATES,
} from "~/lib/screening-data";
import { createClient } from "~/lib/supabase/server";

/**
 * A printable "bring this to the front desk" summary for the insured path —
 * mirrors /results/next-steps (the uninsured "full action plan" page) as the
 * insured-path equivalent. Reads the user's last saved result rather than
 * query params, since it's only ever reached by clicking the results-page
 * button, same reasoning as next-steps.
 */
export default async function InsuredRightsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/results/insured-rights");
  }

  const { data: savedResult } = await supabase
    .from("screening_results")
    .select("state_code, insurance_status, plan_type, plan_funding")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!savedResult) {
    redirect("/navigator");
  }

  // This page only applies to the insured path — send everyone else back to
  // their results rather than showing irrelevant content.
  if (savedResult.insurance_status !== "insured") {
    redirect("/results");
  }

  const stateName =
    US_STATES.find((s) => s.code === savedResult.state_code)?.name ??
    savedResult.state_code;
  const program = STATE_PROGRAMS[savedResult.state_code];
  const planType =
    (savedResult.plan_type as InsurancePlanType | null) ?? undefined;
  const planFunding =
    (savedResult.plan_funding as EmployerPlanFunding | null) ?? undefined;

  const escalationPath = getEscalationPath(planType, planFunding);
  const disputeScript = DISPUTE_SCRIPTS[escalationPath];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 py-8">
      <div className="flex flex-col gap-2 print:hidden">
        <Link
          href="/results"
          className="w-fit text-sm text-muted-foreground underline hover:text-foreground"
        >
          ← Back to your results
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Your rights summary
        </h1>
        <p className="text-muted-foreground">
          Print this, or show it on your phone, at the front desk if a screening
          visit gets billed wrong.
        </p>
        <div>
          <PrintButton />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your ACA right: $0 cost-sharing</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            In-network preventive screening should cost you $0 — no copay, no
            deductible. This is a legal right under the Affordable Care Act, not
            something that needs to be verified case by case.
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What to say when booking</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Ask for a <span className="font-medium">"routine screening"</span>{" "}
            mammogram, not just the exam name. That's the phrase that gets your
            visit coded as preventive care instead of diagnostic.
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>If you get billed anyway</CardTitle>
          <CardDescription>{disputeScript.whyThisPath}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <ol className="flex flex-col gap-1.5 text-sm">
            {disputeScript.scriptSteps.map((step, i) => (
              <li key={step} className="flex gap-2">
                <span className="shrink-0 font-medium text-muted-foreground">
                  {i + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="text-sm text-muted-foreground">
            {disputeScript.writtenRequestNote}
          </p>
        </CardContent>
      </Card>

      {escalationPath !== "unclear" && (
        <Card>
          <CardHeader>
            <CardTitle>Where to escalate if it's still not fixed</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            {escalationPath === "dol_ebsa" ? (
              <>
                <p className="font-medium">{DOL_EBSA_CONTACT.name}</p>
                <p>{DOL_EBSA_CONTACT.phone}</p>
                <p>{DOL_EBSA_CONTACT.url}</p>
              </>
            ) : escalationPath === "medicare" ? (
              <>
                <p className="font-medium">{MEDICARE_COMPLAINT_CONTACT.name}</p>
                <p>{MEDICARE_COMPLAINT_CONTACT.phone}</p>
                <p>{MEDICARE_COMPLAINT_CONTACT.url}</p>
              </>
            ) : program?.insuranceComplaintUrl ? (
              <>
                <p className="font-medium">{stateName}'s insurance regulator</p>
                <p>{program.insuranceComplaintUrl}</p>
              </>
            ) : (
              <>
                <p className="font-medium">Your state's insurance regulator</p>
                <p>{NATIONAL_INSURANCE_COMPLAINT_FALLBACK} (NAIC locator)</p>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
