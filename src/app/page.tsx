import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const features = [
  {
    title: "Matched to your state",
    description:
      "Get routed to your state's breast cancer screening program, with a verified contact number to confirm eligibility and book — no insurance required for uninsured and underinsured women.",
  },
  {
    title: "Know your ACA rights",
    description:
      "Insured women get the exact language to use when booking so in-network preventive screening is billed correctly, plus how to spot and dispute the diagnostic-vs-preventive billing trap.",
  },
  {
    title: "Financial assistance, either way",
    description:
      "Not matched to a program, or need help with treatment costs later? Get routed to real financial assistance options like Planned Parenthood, FQHCs, and the PAN Foundation.",
  },
  {
    title: "Ongoing coverage guidance",
    description:
      "State-specific Medicaid expansion status and ACA marketplace enrollment windows, for women who want coverage beyond a single screening visit.",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center gap-16 p-8 py-16">
      <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Find your path to breast cancer screening
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          ScreeningNavigator helps you understand your eligibility for breast
          cancer screening based on your insurance status, and routes you to
          the program, rights, or financial assistance that fits your
          situation — with real, source-verified information.
        </p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="max-w-md text-center text-sm text-muted-foreground">
        This is not a diagnostic tool and does not replace a doctor. Persistent
        symptoms should always be evaluated by a medical professional.
      </p>
    </main>
  );
}
