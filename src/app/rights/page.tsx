import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const RIGHTS = [
  {
    title: "Your ACA right: $0 cost-sharing",
    description:
      "In-network preventive screening should cost you $0 — no copay, no deductible. This is a legal right under the Affordable Care Act, not something you need to verify by calling.",
  },
  {
    title: "What to say when booking",
    description:
      'Ask for a "routine screening" mammogram, not just the exam name. That\'s the phrase that gets your visit coded as preventive care instead of diagnostic.',
  },
  {
    title: "The billing trap to avoid",
    description:
      'Coverage on paper doesn\'t always mean a correctly billed visit. If your screening gets coded as "diagnostic" instead of "preventive," you may be billed even though you shouldn\'t be. If that happens, call your insurer, reference your ACA preventive care right, and ask for the claim to be recoded and reprocessed.',
  },
];

export default function RightsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Rights & Billing</h1>
        <p className="text-muted-foreground">
          If you're insured, here's what you're entitled to and how to protect
          yourself from an incorrect bill for preventive screening.
        </p>
      </div>

      {RIGHTS.map((right) => (
        <Card key={right.title}>
          <CardHeader>
            <CardTitle>{right.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{right.description}</p>
          </CardContent>
        </Card>
      ))}

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">
            Want guidance specific to your state and insurance status?
          </p>
          <Button asChild>
            <Link href="/navigator">Start screening check</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
