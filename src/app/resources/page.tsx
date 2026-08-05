import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  COST_HELP_LATER,
  FINANCIAL_ASSISTANCE,
  INSURED_COST_HELP,
} from "~/lib/screening-data";

function OrgList({
  orgs,
}: {
  orgs: { name: string; contact: string; eligibility?: string }[];
}) {
  return (
    <ul className="flex flex-col gap-3 text-sm">
      {orgs.map((org) => (
        <li key={org.name} className="flex flex-col">
          <span className="font-medium">{org.name}</span>
          <span className="text-muted-foreground">{org.contact}</span>
          {org.eligibility && (
            <span className="text-xs text-muted-foreground">
              {org.eligibility}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function ResourcesPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground">
          Support and financial assistance organizations, in addition to any
          state screening program you're matched to.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Get screened now</CardTitle>
        </CardHeader>
        <CardContent>
          <OrgList orgs={FINANCIAL_ASSISTANCE} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost help if uninsured or underinsured</CardTitle>
        </CardHeader>
        <CardContent>
          <OrgList orgs={COST_HELP_LATER} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost help if insured</CardTitle>
        </CardHeader>
        <CardContent>
          <OrgList orgs={INSURED_COST_HELP} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Questions about your results or this tool? Email{" "}
            <a
              href="mailto:support@screeningnavigator.com"
              className="text-primary underline hover:no-underline"
            >
              support@screeningnavigator.com
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
