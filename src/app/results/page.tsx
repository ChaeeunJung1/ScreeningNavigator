import {
  Banknote,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  COST_HELP_LATER,
  FINANCIAL_ASSISTANCE,
  getFplPercent,
  INSURED_COST_HELP,
  MEDICAID_TREATMENT_PATHWAY_NOTE,
  NATIONAL_INSURANCE_COMPLAINT_FALLBACK,
  STATE_PROGRAMS,
  US_STATES,
} from "~/lib/screening-data";
import { createClient } from "~/lib/supabase/server";

const MEDICAID_EXPANSION_THRESHOLD_FPL = 138;

interface ResultsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/navigator");
  }

  const params = await searchParams;
  let stateCode = typeof params.state === "string" ? params.state : "";
  let insurance = typeof params.insurance === "string" ? params.insurance : "";

  // Only a fresh questionnaire submission carries both of these in the URL.
  // Used below to make sure a plain "view my results" visit (e.g. from the
  // sidebar) never overwrites previously saved answers with blanks.
  const hasFreshAnswers = Boolean(stateCode && insurance);

  if (!hasFreshAnswers) {
    // No questionnaire answers in the URL (e.g. navigating here straight
    // from the sidebar) — fall back to the user's last saved result
    // instead of always bouncing to the questionnaire.
    const { data: savedResult } = await supabase
      .from("screening_results")
      .select("state_code, insurance_status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!savedResult) {
      redirect("/navigator");
    }

    stateCode = savedResult.state_code;
    insurance = savedResult.insurance_status;
  }

  const age = Number(params.age);
  const householdSize = Number(params.householdSize);
  const income = Number(params.income);
  const hasRegularDoctor = params.hasRegularDoctor === "yes";
  const costWorry = params.costWorry === "yes";

  const stateName =
    US_STATES.find((s) => s.code === stateCode)?.name ?? stateCode;
  const program = STATE_PROGRAMS[stateCode];

  const hasValidAge = Number.isFinite(age) && age > 0;
  const validAge = hasValidAge ? age : null;

  const hasValidIncomeInputs =
    Number.isFinite(income) &&
    income >= 0 &&
    Number.isFinite(householdSize) &&
    householdSize > 0;
  const fplPercent = hasValidIncomeInputs
    ? getFplPercent(income, householdSize)
    : null;

  const isInsured = insurance === "insured";

  // Only persist when this visit actually carries fresh questionnaire
  // answers — a plain "view my results" visit (e.g. from the sidebar,
  // with no query params) must never overwrite the previously saved
  // age/household_size/income with blanks.
  if (hasFreshAnswers) {
    const { error: upsertError } = await supabase
      .from("screening_results")
      .upsert(
        {
          user_id: user.id,
          state_code: stateCode,
          insurance_status: insurance,
          program_name: isInsured ? null : (program?.programName ?? null),
          age: validAge,
          household_size: Number.isFinite(householdSize) ? householdSize : null,
          income: Number.isFinite(income) ? income : null,
        },
        { onConflict: "user_id" },
      );

    if (upsertError) {
      console.error("Failed to save screening result", upsertError);
    }
  }

  const insuranceLabel =
    insurance === "uninsured"
      ? "Uninsured"
      : insurance === "underinsured"
        ? "Underinsured"
        : "Fully insured";

  return (
    <div className="mx-auto grid max-w-6xl gap-6 p-4 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-primary uppercase tracking-wide">
            Matched screening pathway
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Your results</h1>
          <p className="text-muted-foreground">
            Based on your answers, here is the most relevant screening and
            coverage information for your situation.
          </p>
        </div>

        {isInsured ? (
          <InsuredOutcome
            hasRegularDoctor={hasRegularDoctor}
            costWorry={costWorry}
            stateName={stateName}
            insuranceComplaintUrl={program?.insuranceComplaintUrl}
          />
        ) : (
          <UninsuredOutcome
            stateName={stateName}
            program={program}
            age={validAge}
            fplPercent={fplPercent}
          />
        )}

        <Link
          href="/navigator"
          className="text-center text-sm text-muted-foreground underline hover:text-foreground"
        >
          Start over
        </Link>
      </div>

      <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:h-fit">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your situation</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <SituationRow icon={MapPin} label="State" value={stateName} />
            <SituationRow
              icon={ShieldCheck}
              label="Insurance"
              value={insuranceLabel}
            />
            {validAge !== null && (
              <SituationRow
                icon={CalendarDays}
                label="Age"
                value={String(validAge)}
              />
            )}
            {Number.isFinite(householdSize) && (
              <SituationRow
                icon={Users}
                label="Household size"
                value={String(householdSize)}
              />
            )}
            {Number.isFinite(income) && (
              <SituationRow
                icon={Banknote}
                label="Annual income"
                value={`$${income.toLocaleString()}`}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What to do next</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ol className="flex flex-col gap-2 text-sm">
              {(isInsured
                ? [
                    "Call to confirm they take your insurance",
                    "Ask for a routine screening mammogram",
                    "Bring your insurance card and ID",
                    "Watch your bill for correct preventive coding",
                  ]
                : [
                    program
                      ? `Contact ${program.programName}`
                      : "Find a local clinic or navigator",
                    program
                      ? 'Ask: "Am I eligible?" and "What do I need to bring?"'
                      : "Ask about screening and follow-up coverage",
                    "Add your appointment to your calendar as soon as it's set",
                    "Use backup assistance if you don't qualify",
                  ]
              ).map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            {!isInsured && program && (
              <Button asChild>
                <Link href="/results/next-steps">
                  See your full action plan
                </Link>
              </Button>
            )}

            {/* Clinic locator buttons live on the "Find nearest clinic" card
                in the main column — not duplicated here. */}
            {!isInsured && program?.website && (
              <Button variant="outline" asChild>
                <a
                  href={`https://${program.website}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open official program
                </a>
              </Button>
            )}
            <Button variant="outline" asChild>
              <a href="#get-screened-now">See backup options</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SituationRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-medium">{value}</span>
    </div>
  );
}

function EligibilityCaveat({
  ageBelowMin,
  ageAboveMax,
  ageRangeMin,
  ageRangeMax,
  ageRangeNote,
  incomeAboveCeiling,
  incomeCeilingFplPercent,
  incomeCeilingNote,
}: {
  ageBelowMin: boolean;
  ageAboveMax: boolean;
  ageRangeMin: number | undefined;
  ageRangeMax: number | undefined;
  ageRangeNote: string | undefined;
  incomeAboveCeiling: boolean;
  incomeCeilingFplPercent: number | undefined;
  incomeCeilingNote: string | undefined;
}) {
  const ageOutsideRange = ageBelowMin || ageAboveMax;

  if (
    !ageOutsideRange &&
    !ageRangeNote &&
    !incomeAboveCeiling &&
    !incomeCeilingNote
  ) {
    return null;
  }

  const ageMessage =
    ageRangeMin !== undefined && ageRangeMax !== undefined
      ? `This program's typical age range is ${ageRangeMin}–${ageRangeMax}, and you're outside it.`
      : ageBelowMin
        ? `This program's minimum age is ${ageRangeMin}, and you're below it.`
        : `This program's maximum age is ${ageRangeMax}, and you're above it.`;

  return (
    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
      {ageOutsideRange && <p className="font-bold">{ageMessage}</p>}
      {ageRangeNote && <p>{ageRangeNote}</p>}
      {incomeAboveCeiling && (
        <p className="font-bold">
          Your income looks like it's above this program's income ceiling (
          {incomeCeilingFplPercent}% FPL).
        </p>
      )}
      {incomeCeilingNote && <p>{incomeCeilingNote}</p>}
      {(ageOutsideRange || incomeAboveCeiling) && (
        <p>
          Call anyway — exceptions exist and eligibility rules vary by program.
        </p>
      )}
    </div>
  );
}

function UninsuredOutcome({
  stateName,
  program,
  age,
  fplPercent,
}: {
  stateName: string;
  program: (typeof STATE_PROGRAMS)[string] | undefined;
  age: number | null;
  fplPercent: number | null;
}) {
  const ageRangeMin = program?.ageRangeMin;
  const ageRangeMax = program?.ageRangeMax;
  const ageBelowMin =
    age !== null && ageRangeMin !== undefined && age < ageRangeMin;
  const ageAboveMax =
    age !== null && ageRangeMax !== undefined && age > ageRangeMax;

  const incomeCeilingFplPercent = program?.incomeCeilingFplPercent;
  const incomeAboveCeiling =
    fplPercent !== null &&
    incomeCeilingFplPercent !== undefined &&
    fplPercent > incomeCeilingFplPercent;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Your matched screening program</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {program ? (
            <>
              <p className="font-medium">{program.programName}</p>
              <p className="text-sm">{program.contact}</p>
              {program.contactNote && (
                <CardDescription>{program.contactNote}</CardDescription>
              )}
              {program.website && (
                <a
                  href={`https://${program.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline hover:text-foreground"
                >
                  {program.website}
                </a>
              )}
              <p className="text-sm text-muted-foreground">
                This program pays for the screening directly — no insurance
                needed.
              </p>
              <EligibilityCaveat
                ageBelowMin={ageBelowMin}
                ageAboveMax={ageAboveMax}
                ageRangeMin={ageRangeMin}
                ageRangeMax={ageRangeMax}
                ageRangeNote={program.ageRangeNote}
                incomeAboveCeiling={incomeAboveCeiling}
                incomeCeilingFplPercent={incomeCeilingFplPercent}
                incomeCeilingNote={program.incomeCeilingNote}
              />
              {program.ifDiagnosed && (
                <p className="text-sm">
                  <span className="font-medium">If diagnosed: </span>
                  {program.ifDiagnosed}
                </p>
              )}
            </>
          ) : (
            <CardDescription>
              We don't yet have a verified screening program contact for{" "}
              {stateName}. The financial assistance options below still apply,
              and{" "}
              <a
                href="https://findlocalhelp.cms.gov"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-foreground"
              >
                findlocalhelp.cms.gov
              </a>{" "}
              can connect you to local, in-person help.
            </CardDescription>
          )}
        </CardContent>
      </Card>

      {program && (
        <Card>
          <CardHeader>
            <CardTitle>Find nearest clinic</CardTitle>
            <CardDescription>
              {program.providerFinderUrl
                ? "Search this program's official locator for a participating location near you."
                : program.generalHealthDeptFinderUrl
                  ? "This program doesn't publish its own locator. Here's your state's general local health department finder — call ahead to confirm they participate before visiting."
                  : "This program doesn't publish an online locator — call to enroll and you'll be told where to go."}
            </CardDescription>
          </CardHeader>
          {program.providerFinderUrl ? (
            <CardContent>
              <Button asChild>
                <a
                  href={`https://${program.providerFinderUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Find a clinic near you
                </a>
              </Button>
            </CardContent>
          ) : program.generalHealthDeptFinderUrl ? (
            <CardContent className="flex flex-col gap-2">
              <Button variant="secondary" asChild>
                <a
                  href={`https://${program.generalHealthDeptFinderUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Find your local health department
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">
                General locator, not confirmed as a {program.programName} site —
                call first.
              </p>
            </CardContent>
          ) : null}
        </Card>
      )}

      <Card id="get-screened-now">
        <CardHeader>
          <CardTitle>Get screened now</CardTitle>
          <CardDescription>
            If you're not matched to a program, or need a backup option.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2 text-sm">
            {FINANCIAL_ASSISTANCE.map((org) => (
              <li key={org.name} className="flex flex-col">
                <span className="font-medium">{org.name}</span>
                <span className="text-muted-foreground">{org.contact}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>If something is found: cost help for treatment</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <ul className="flex flex-col gap-2 text-sm">
            {COST_HELP_LATER.map((org) => (
              <li key={org.name} className="flex flex-col">
                <span className="font-medium">{org.name}</span>
                <span className="text-muted-foreground">{org.contact}</span>
                {org.eligibility && (
                  <span className="text-muted-foreground text-xs">
                    {org.eligibility}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <CardDescription>{MEDICAID_TREATMENT_PATHWAY_NOTE}</CardDescription>
        </CardContent>
      </Card>

      <MedicaidGuidance
        stateName={stateName}
        medicaidExpanded={program?.medicaidExpanded}
        fplPercent={fplPercent}
      />
    </div>
  );
}

function MedicaidGuidance({
  stateName,
  medicaidExpanded,
  fplPercent,
}: {
  stateName: string;
  medicaidExpanded: boolean | undefined;
  fplPercent: number | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ongoing insurance guidance</CardTitle>
        <CardDescription>
          For coverage beyond a single screening visit.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        {medicaidExpanded === undefined && (
          <p className="text-muted-foreground">
            We don't have {stateName}'s Medicaid expansion status yet. Check{" "}
            <a
              href="https://www.healthcare.gov"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              healthcare.gov
            </a>{" "}
            for your state's Medicaid and marketplace status.
          </p>
        )}
        {medicaidExpanded === true && fplPercent !== null && (
          <p>
            {stateName} has expanded Medicaid, covering adults up to{" "}
            {MEDICAID_EXPANSION_THRESHOLD_FPL}% of the federal poverty line. At
            about {fplPercent}% of the poverty line, you're{" "}
            {fplPercent <= MEDICAID_EXPANSION_THRESHOLD_FPL
              ? "likely eligible for Medicaid — apply through your state's Medicaid office."
              : "above the typical Medicaid threshold — the ACA marketplace at healthcare.gov is likely your path to ongoing coverage."}
          </p>
        )}
        {medicaidExpanded === false && (
          <p>
            {stateName} has not expanded Medicaid, which creates a real coverage
            gap for very-low-income adults who don't qualify for traditional
            Medicaid but also can't afford marketplace coverage. There's no
            clean resolution here — the ACA marketplace at{" "}
            <a
              href="https://www.healthcare.gov"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              healthcare.gov
            </a>{" "}
            is worth checking, and{" "}
            <a
              href="https://findlocalhelp.cms.gov"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              findlocalhelp.cms.gov
            </a>{" "}
            can connect you with someone who knows the local options.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function InsuredOutcome({
  hasRegularDoctor,
  costWorry,
  stateName,
  insuranceComplaintUrl,
}: {
  hasRegularDoctor: boolean;
  costWorry: boolean;
  stateName: string;
  insuranceComplaintUrl: string | undefined;
}) {
  const bookingCard = (
    <Card key="booking">
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
  );

  const costSharingCard = (
    <Card key="cost-sharing">
      <CardHeader>
        <CardTitle>Your ACA right: $0 cost-sharing</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          In-network preventive screening should cost you $0 — no copay, no
          deductible. This is a legal right under the Affordable Care Act, not
          something you need to verify by calling.
        </CardDescription>
      </CardContent>
    </Card>
  );

  const billingTrapCard = (
    <Card key="billing-trap">
      <CardHeader>
        <CardTitle>The billing trap to avoid</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CardDescription>
          Coverage on paper doesn't always mean a correctly billed visit. If
          your screening gets coded as "diagnostic" instead of "preventive," you
          may be billed even though you shouldn't be. If that happens, call your
          insurer, reference your ACA preventive care right, and ask for the
          claim to be recoded and reprocessed.
        </CardDescription>
        <p className="text-sm">
          If your insurer won't fix it, escalate to{" "}
          {insuranceComplaintUrl ? (
            <a
              href={`https://${insuranceComplaintUrl}`}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              {stateName}'s insurance regulator
            </a>
          ) : (
            <a
              href={NATIONAL_INSURANCE_COMPLAINT_FALLBACK}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              your state's insurance regulator (NAIC locator)
            </a>
          )}{" "}
          and file a consumer complaint.
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-4">
      {!hasRegularDoctor && (
        <Card>
          <CardHeader>
            <CardTitle>Find a doctor</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Call the member services number on the back of your insurance card
              and ask for your in-network directory, or use a Federally
              Qualified Health Center (findahealthcenter.hrsa.gov) or Planned
              Parenthood (plannedparenthood.org) as a backup.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {costWorry && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>About your cost concern</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              You told us you're worried about the cost of screening. Being
              insured doesn't always mean $0 in practice — two things below
              apply directly to that concern, so we've put them first.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {costWorry
        ? [costSharingCard, billingTrapCard, bookingCard]
        : [bookingCard, costSharingCard, billingTrapCard]}

      <Card id="get-screened-now">
        <CardHeader>
          <CardTitle>Get screened now</CardTitle>
          <CardDescription>
            If you're not matched to a program, or need a backup option.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2 text-sm">
            {FINANCIAL_ASSISTANCE.map((org) => (
              <li key={org.name} className="flex flex-col">
                <span className="font-medium">{org.name}</span>
                <span className="text-muted-foreground">{org.contact}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>If something is found: cost help for treatment</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2 text-sm">
            {INSURED_COST_HELP.map((org) => (
              <li key={org.name} className="flex flex-col">
                <span className="font-medium">{org.name}</span>
                <span className="text-muted-foreground">{org.contact}</span>
                {org.eligibility && (
                  <span className="text-muted-foreground text-xs">
                    {org.eligibility}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
