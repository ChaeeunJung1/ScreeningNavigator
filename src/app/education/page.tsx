import { Flag, Info, Users } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

const SECTIONS = [
  {
    id: "symptoms",
    icon: Flag,
    iconBg: "bg-rose-50 dark:bg-rose-950/40",
    iconColor: "text-rose-600 dark:text-rose-400",
    title: "Symptoms and red flags",
    items: [
      "A new lump in the breast or underarm",
      "Nipple discharge or pulling in",
      "Skin changes like dimpling, swelling, or redness",
      "A breast that looks or feels different than usual",
    ],
    footer:
      "Persistent symptoms should always be evaluated by a doctor. This page is educational and does not replace a diagnosis.",
  },
  {
    id: "risk-factors",
    icon: Users,
    iconBg: "bg-purple-50 dark:bg-purple-950/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    title: "Common risk factors",
    items: [
      "Age 40 and older",
      "Family history of breast or ovarian cancer",
      "Prior chest radiation",
      "Dense breast tissue or certain genetic risks",
    ],
    footer:
      "Having a risk factor does not mean you'll develop breast cancer — it means screening matters more, not less.",
  },
  {
    id: "guidance",
    icon: Info,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    title: "Mammography guidance for age 40+",
    items: [
      "Mammography is the main screening test for breast cancer",
      "Most guidelines recommend women start screening at age 40",
      "Screening frequency and starting age can vary with personal risk — ask your doctor what's right for you",
      "Your insurance status changes what help is available to pay for screening",
    ],
    footer:
      "Use the screening check to see the specific programs, rights, and cost help available for your state and situation.",
  },
];

export default function EducationPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Education</h1>
        <p className="text-muted-foreground">
          General information about breast cancer symptoms, risk factors, and
          screening guidance. This is not a diagnostic tool.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <Card key={section.id} id={section.id}>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-full ${section.iconBg}`}
            >
              <section.icon className={`size-6 ${section.iconColor}`} />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="pt-1 text-sm text-muted-foreground italic">
                {section.footer}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
