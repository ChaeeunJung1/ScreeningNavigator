import Link from "next/link";
import { redirect } from "next/navigation";
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
  STATE_PROGRAMS,
  TYPICAL_PROGRAM_AGE_RANGE,
  TYPICAL_PROGRAM_FPL_MAX,
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
  const stateCode = typeof params.state === "string" ? params.state : "";
  const insurance =
    typeof params.insurance === "string" ? params.insurance : "";

  if (!stateCode || !insurance) {
    redirect("/navigator");
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
  const ageOutsideTypicalRange =
    hasValidAge &&
    (age < TYPICAL_PROGRAM_AGE_RANGE.min ||
      age > TYPICAL_PROGRAM_AGE_RANGE.max);

  const hasValidIncomeInputs =
    Number.isFinite(income) &&
    income >= 0 &&
    Number.isFinite(householdSize) &&
    householdSize > 0;
  const fplPercent = hasValidIncomeInputs
    ? getFplPercent(income, householdSize)
    : null;
  const incomeAboveTypicalRange =
    fplPercent !== null && fplPercent > TYPICAL_PROGRAM_FPL_MAX;

  const isInsured = insurance === "insured";

  const { error: upsertError } = await supabase
    .from("screening_results")
    .upsert(
      {
        user_id: user.id,
        state_code: stateCode,
        insurance_status: insurance,
        program_name: isInsured ? null : (program?.programName ?? null),
      },
      { onConflict: "user_id" },
    );

  if (upsertError) {
    console.error("Failed to save screening result", upsertError);
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-2xl flex-col gap-6 p-8 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Your results</h1>
        <p className="text-muted-foreground">
          Based on {stateName} and{" "}
          {insurance === "uninsured"
            ? "being uninsured"
            : insurance === "underinsured"
              ? "being underinsured"
              : "being fully insured"}
          .
        </p>
      </div>

      {isInsured ? (
        <InsuredOutcome
          hasRegularDoctor={hasRegularDoctor}
          costWorry={costWorry}
        />
      ) : (
        <UninsuredOutcome
          stateName={stateName}
          program={program}
          ageOutsideTypicalRange={ageOutsideTypicalRange}
          incomeAboveTypicalRange={incomeAboveTypicalRange}
          fplPercent={fplPercent}
        />
      )}

      <Link
        href="/navigator"
        className="text-center text-sm text-muted-foreground underline hover:text-foreground"
      >
        Start over
      </Link>
    </main>
  );
}

function EligibilityCaveat({
  ageOutsideTypicalRange,
  incomeAboveTypicalRange,
}: {
  ageOutsideTypicalRange: boolean;
  incomeAboveTypicalRange: boolean;
}) {
  if (!ageOutsideTypicalRange && !incomeAboveTypicalRange) return null;

  return (
    <p className="text-sm text-muted-foreground">
      {ageOutsideTypicalRange &&
        `This program's typical age range is ${TYPICAL_PROGRAM_AGE_RANGE.min}–${TYPICAL_PROGRAM_AGE_RANGE.max}, and you're outside it. `}
      {incomeAboveTypicalRange &&
        `Your income looks like it's above the typical eligibility cutoff for this program. `}
      Call anyway — exceptions exist and eligibility rules vary by program.
    </p>
  );
}

function UninsuredOutcome({
  stateName,
  program,
  ageOutsideTypicalRange,
  incomeAboveTypicalRange,
  fplPercent,
}: {
  stateName: string;
  program: (typeof STATE_PROGRAMS)[string] | undefined;
  ageOutsideTypicalRange: boolean;
  incomeAboveTypicalRange: boolean;
  fplPercent: number | null;
}) {
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
              <p className="text-sm text-muted-foreground">
                This program pays for the screening directly — no insurance
                needed.
              </p>
              <EligibilityCaveat
                ageOutsideTypicalRange={ageOutsideTypicalRange}
                incomeAboveTypicalRange={incomeAboveTypicalRange}
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

      <Card>
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
            {COST_HELP_LATER.map((org) => (
              <li key={org.name} className="flex flex-col">
                <span className="font-medium">{org.name}</span>
                <span className="text-muted-foreground">{org.contact}</span>
              </li>
            ))}
          </ul>
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
}: {
  hasRegularDoctor: boolean;
  costWorry: boolean;
}) {
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

      <Card>
        <CardHeader>
          <CardTitle>The billing trap to avoid</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Coverage on paper doesn't always mean a correctly billed visit. If
            your screening gets coded as "diagnostic" instead of "preventive,"
            you may be billed even though you shouldn't be. If that happens,
            call your insurer, reference your ACA preventive care right, and ask
            for the claim to be recoded and reprocessed.
          </CardDescription>
        </CardContent>
      </Card>

      {costWorry && (
        <Card>
          <CardHeader>
            <CardTitle>Cost-assistance options</CardTitle>
            <CardDescription>
              Since you flagged cost as a concern.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-sm">
              {[...FINANCIAL_ASSISTANCE, ...COST_HELP_LATER].map((org) => (
                <li key={org.name} className="flex flex-col">
                  <span className="font-medium">{org.name}</span>
                  <span className="text-muted-foreground">{org.contact}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
