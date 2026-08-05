import {
  Ban,
  BookOpen,
  ClipboardCheck,
  Heart,
  HeartHandshake,
  Landmark,
  ListChecks,
  MapPin,
  Shield,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

const STEPS = [
  {
    title: "Tell us where you live",
    description: "Your state helps us find the right programs and resources.",
  },
  {
    title: "Share coverage details",
    description:
      "We'll ask about insurance, income, household size, and cost concerns.",
  },
  {
    title: "Get verified next steps",
    description:
      "See programs, your rights, and practical next steps for your situation.",
  },
];

const PATHWAYS = [
  {
    icon: HeartHandshake,
    iconBg: "bg-purple-50 dark:bg-purple-950/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    title: "If uninsured or underinsured",
    description:
      "You may be routed to a state screening program, a local clinic, and additional financial assistance sources.",
  },
  {
    icon: Shield,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    title: "If insured",
    description:
      "You'll see what to say when booking, how to ask for preventive billing, and how to handle billing mistakes.",
  },
  {
    icon: Users,
    iconBg: "bg-orange-50 dark:bg-orange-950/40",
    iconColor: "text-orange-600 dark:text-orange-400",
    title: "If you need help now",
    description:
      "Find community clinics, charity care, and support resources while you complete the screening check.",
  },
];

const TRUST_CARDS = [
  {
    icon: User,
    title: "Who this is for",
    description:
      "Women who are uninsured, underinsured, or insured but worried about being billed incorrectly for preventive screening.",
  },
  {
    icon: ShieldCheck,
    title: "What we do",
    description:
      "Match you to official screening programs, explain ACA preventive care rights, and route you to real assistance options — using source-verified public data.",
  },
  {
    icon: Ban,
    title: "What we do not do",
    description:
      "We do not diagnose symptoms, estimate cancer risk, or enroll you directly in insurance or a program. Persistent symptoms should always be evaluated by a doctor.",
  },
];

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="font-bold tracking-tight text-primary">
            ScreeningNavigator.com
          </span>
          <Button variant="outline" size="sm" asChild>
            <Link href="/login?next=/navigator">Sign in</Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="flex flex-col items-center gap-6 px-4 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Breast cancer screening access
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Find your path to breast cancer screening
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Answer a few questions about your state, insurance, age, household
            size, and income. We'll route you to verified screening programs,
            your billing rights, and real financial help — no diagnosis score,
            no symptom checker.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button size="lg" asChild>
              <Link href="/login?mode=sign-up&next=/navigator">
                Create your free account
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login?next=/navigator">
                Already have an account? Sign in
              </Link>
            </Button>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            How it works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Card key={step.title}>
                <CardContent className="flex flex-col items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {i + 1}
                  </div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pathways */}
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Get matched to what fits your situation
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Your results depend on your coverage — every path leads somewhere
              useful.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {PATHWAYS.map((pathway) => (
              <Card key={pathway.title} className="h-full">
                <CardContent className="flex flex-col gap-3">
                  <div
                    className={`flex size-11 items-center justify-center rounded-full ${pathway.iconBg}`}
                  >
                    <pathway.icon className={`size-5 ${pathway.iconColor}`} />
                  </div>
                  <p className="font-semibold">{pathway.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {pathway.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            About this tool
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {TRUST_CARDS.map((card) => (
              <Card key={card.title}>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                    <card.icon className="size-4 text-primary" />
                  </div>
                  <p className="font-semibold">{card.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="flex items-center gap-1 rounded-md border border-border px-2 py-1">
              <MapPin className="size-3" /> State program data
            </span>
            <span className="flex items-center gap-1 rounded-md border border-border px-2 py-1">
              <Heart className="size-3" /> Official sources
            </span>
            <span className="flex items-center gap-1 rounded-md border border-border px-2 py-1">
              <ListChecks className="size-3" /> Updated 2026
            </span>
          </div>
        </section>

        {/* What you get */}
        <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-12">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            What you'll find inside
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <ClipboardCheck className="size-5 shrink-0 text-primary" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">Screening check</p>
                <p className="text-sm text-muted-foreground">
                  A short questionnaire that matches you to a pathway.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <Landmark className="size-5 shrink-0 text-primary" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">Matched programs</p>
                <p className="text-sm text-muted-foreground">
                  Verified state screening programs and their contacts.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <ShieldCheck className="size-5 shrink-0 text-primary" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">Rights & billing</p>
                <p className="text-sm text-muted-foreground">
                  Your ACA preventive-care rights, explained plainly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <BookOpen className="size-5 shrink-0 text-primary" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">Education</p>
                <p className="text-sm text-muted-foreground">
                  Symptoms, risk factors, and mammography guidance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="flex flex-col items-center gap-4 px-4 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Ready to see your options?
          </h2>
          <p className="max-w-md text-muted-foreground">
            Create a free account to save your progress and get your matched
            screening pathway.
          </p>
          <Button size="lg" asChild>
            <Link href="/login?mode=sign-up&next=/navigator">
              Create your free account
            </Link>
          </Button>
        </section>

        <footer className="border-t border-border px-4 py-8 text-center text-sm text-muted-foreground">
          <p>
            Results are based on your answers and verified public sources. This
            is not a diagnostic tool and does not replace a doctor.
          </p>
        </footer>
      </main>
    </div>
  );
}
