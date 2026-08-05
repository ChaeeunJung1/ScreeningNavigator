import {
  Ban,
  ChevronRight,
  Heart,
  HeartHandshake,
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
    title: "1. Tell us where you live",
    description: "Your state helps us find the right programs and resources.",
  },
  {
    title: "2. Share coverage details",
    description:
      "We'll ask about insurance, income, household size, and cost concerns.",
  },
  {
    title: "3. Get verified next steps",
    description:
      "See programs, your rights, and practical next steps for your situation.",
  },
];

const QUICK_EDUCATION = [
  { label: "Symptoms and red flags", href: "/education#symptoms" },
  { label: "Common risk factors", href: "/education#risk-factors" },
  { label: "Mammography guidance for age 40+", href: "/education#guidance" },
];

const WHAT_WE_ASK = [
  { label: "State", value: "California" },
  { label: "Insurance status", value: "Underinsured" },
  { label: "Age", value: "46" },
  { label: "Household size", value: "3" },
  { label: "Annual income", value: "$48,000" },
  { label: "Cost worry", value: "Yes" },
  { label: "Regular doctor", value: "No" },
];

const PATHWAYS = [
  {
    icon: HeartHandshake,
    iconBg: "bg-purple-50 dark:bg-purple-950/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    title: "If uninsured or underinsured",
    description:
      "You may be routed to a state screening program, a local clinic, and additional financial assistance sources.",
    href: "/navigator",
  },
  {
    icon: Shield,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    title: "If insured",
    description:
      "You'll see what to say when booking, how to ask for preventive billing, and how to handle billing mistakes.",
    href: "/rights",
  },
  {
    icon: Users,
    iconBg: "bg-orange-50 dark:bg-orange-950/40",
    iconColor: "text-orange-600 dark:text-orange-400",
    title: "If you need help now",
    description:
      "Find community clinics, charity care, and support resources while you complete the screening check.",
    href: "/resources",
  },
];

export function DashboardHome() {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 p-4 py-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">
                Find your path to screening
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                See what screening help fits your situation
              </h1>
              <p className="max-w-2xl text-muted-foreground">
                Answer a few questions about your state, insurance, age,
                household size, and income. ScreeningNavigator routes you to
                verified programs, your billing rights, and real financial help
                — without a diagnosis score or symptom checker.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button asChild>
                  <Link href="/navigator">Start screening check</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/education">Learn how it works</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Card key={step.title}>
              <CardContent className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {i + 1}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">
                    {step.title.replace(/^\d+\.\s*/, "")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex flex-col gap-3">
              <h2 className="font-semibold">
                Quick education before you start
              </h2>
              <ul className="flex flex-col gap-1">
                {QUICK_EDUCATION.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    >
                      {item.label}
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-3">
              <h2 className="font-semibold">What we ask</h2>
              <p className="text-xs text-muted-foreground">
                An example of what the screening check collects:
              </p>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                {WHAT_WE_ASK.map((item) => (
                  <div key={item.label} className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="inline-block w-fit rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {PATHWAYS.map((pathway) => (
            <Link key={pathway.title} href={pathway.href}>
              <Card className="h-full transition-colors hover:bg-accent/50">
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
            </Link>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Results are based on your answers and verified public sources.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:h-fit">
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
              <User className="size-4 text-primary" />
            </div>
            <p className="font-semibold">Who this is for</p>
            <p className="text-sm text-muted-foreground">
              Women who are uninsured, underinsured, or insured but worried
              about being billed incorrectly for preventive screening.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="size-4 text-primary" />
            </div>
            <p className="font-semibold">What we do</p>
            <p className="text-sm text-muted-foreground">
              Match you to official screening programs, explain ACA preventive
              care rights, and route you to real assistance options.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
              <Ban className="size-4 text-primary" />
            </div>
            <p className="font-semibold">What we do not do</p>
            <p className="text-sm text-muted-foreground">
              We do not diagnose, estimate cancer risk, or enroll you directly
              in insurance or a program.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-2">
            <p className="font-semibold">Verified sources</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="flex items-center gap-1 rounded-md border px-2 py-1">
                <MapPin className="size-3" /> State program
              </span>
              <span className="flex items-center gap-1 rounded-md border px-2 py-1">
                <Heart className="size-3" /> Official site
              </span>
              <span className="flex items-center gap-1 rounded-md border px-2 py-1">
                <ListChecks className="size-3" /> Updated 2026
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
