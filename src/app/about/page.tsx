import { Ban, ShieldCheck, User } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">About this tool</h1>
        <p className="text-muted-foreground">
          ScreeningNavigator helps you find real screening programs, your
          preventive-care billing rights, and financial assistance — based on
          your state, insurance, age, household size, and income.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
            <User className="size-4 text-primary" />
          </div>
          <p className="font-semibold">Who this is for</p>
          <p className="text-sm text-muted-foreground">
            Women who are uninsured, underinsured, or insured but worried about
            being billed incorrectly for preventive screening.
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
            care rights, and route you to real assistance options — using
            source-verified public data.
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
            We do not diagnose symptoms, estimate cancer risk, or enroll you
            directly in insurance or a program. Persistent symptoms should
            always be evaluated by a doctor.
          </p>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Results are based on your answers and verified public sources.
      </p>
    </div>
  );
}
