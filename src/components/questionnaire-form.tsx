"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type {
  EmployerPlanFunding,
  InsurancePlanType,
  InsuranceStatus,
} from "~/lib/screening-data";
import { US_STATES } from "~/lib/screening-data";
import { cn } from "~/lib/utils";

const INSURANCE_OPTIONS: { value: InsuranceStatus; label: string }[] = [
  { value: "uninsured", label: "Uninsured" },
  { value: "underinsured", label: "Underinsured" },
  { value: "insured", label: "Fully insured" },
];

const PLAN_TYPE_OPTIONS: { value: InsurancePlanType; label: string }[] = [
  { value: "employer", label: "Through my job (employer plan)" },
  {
    value: "marketplace",
    label: "Marketplace or individual plan (healthcare.gov or bought directly)",
  },
  { value: "medicare_advantage", label: "Medicare Advantage" },
  { value: "not_sure", label: "Not sure" },
];

const PLAN_FUNDING_OPTIONS: { value: EmployerPlanFunding; label: string }[] = [
  {
    value: "self_funded",
    label: "Self-funded (my employer pays the claims itself)",
  },
  {
    value: "fully_insured",
    label: "Fully insured (through an insurance company)",
  },
  { value: "not_sure", label: "Not sure" },
];

export function QuestionnaireForm({
  embedded = false,
}: {
  /** When true, skips the outer card chrome so the form can sit inside another card/panel. */
  embedded?: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState("");
  const [insurance, setInsurance] = useState<InsuranceStatus | "">("");
  const [age, setAge] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [income, setIncome] = useState("");
  const [hasRegularDoctor, setHasRegularDoctor] = useState<"yes" | "no" | "">(
    "",
  );
  const [costWorry, setCostWorry] = useState<"yes" | "no" | "">("");
  const [planType, setPlanType] = useState<InsurancePlanType | "">("");
  const [planFunding, setPlanFunding] = useState<EmployerPlanFunding | "">("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!state || !insurance || !age || !householdSize || !income) {
      setError("Please fill in every field to see your results.");
      return;
    }
    if (
      insurance === "insured" &&
      (!hasRegularDoctor || !costWorry || !planType)
    ) {
      setError("Please fill in every field to see your results.");
      return;
    }
    if (insurance === "insured" && planType === "employer" && !planFunding) {
      setError("Please fill in every field to see your results.");
      return;
    }

    const params = new URLSearchParams({
      state,
      insurance,
      age,
      householdSize,
      income,
    });
    if (insurance === "insured") {
      params.set("hasRegularDoctor", hasRegularDoctor);
      params.set("costWorry", costWorry);
      params.set("planType", planType);
      if (planType === "employer") {
        params.set("planFunding", planFunding);
      }
    }

    router.push(`/results?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full flex-col gap-5",
        embedded
          ? "max-w-none"
          : "max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-sm",
      )}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="state">What state do you live in?</Label>
        <select
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
        >
          <option value="">Select your state</option>
          {US_STATES.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-sm leading-none font-medium">
          What's your insurance status?
        </legend>
        <div className="mt-2 flex flex-col gap-2">
          {INSURANCE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm transition-colors",
                insurance === option.value
                  ? "border-primary bg-accent"
                  : "hover:bg-accent/50",
              )}
            >
              <input
                type="radio"
                name="insurance"
                value={option.value}
                checked={insurance === option.value}
                onChange={() => setInsurance(option.value)}
                className="accent-primary"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          min={0}
          max={120}
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="householdSize">Household size</Label>
        <Input
          id="householdSize"
          type="number"
          min={1}
          max={20}
          value={householdSize}
          onChange={(e) => setHouseholdSize(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="income">Annual household income (USD)</Label>
        <Input
          id="income"
          type="number"
          min={0}
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
      </div>

      {insurance === "insured" && (
        <>
          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm leading-none font-medium">
              Do you have a regular doctor?
            </legend>
            <div className="mt-2 flex gap-2">
              {(["yes", "no"] as const).map((value) => (
                <label
                  key={value}
                  className={cn(
                    "flex-1 cursor-pointer rounded-md border border-input px-3 py-2 text-center text-sm capitalize transition-colors",
                    hasRegularDoctor === value
                      ? "border-primary bg-accent"
                      : "hover:bg-accent/50",
                  )}
                >
                  <input
                    type="radio"
                    name="hasRegularDoctor"
                    value={value}
                    checked={hasRegularDoctor === value}
                    onChange={() => setHasRegularDoctor(value)}
                    className="sr-only"
                  />
                  {value}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm leading-none font-medium">
              Are you worried about the cost of screening?
            </legend>
            <div className="mt-2 flex gap-2">
              {(["yes", "no"] as const).map((value) => (
                <label
                  key={value}
                  className={cn(
                    "flex-1 cursor-pointer rounded-md border border-input px-3 py-2 text-center text-sm capitalize transition-colors",
                    costWorry === value
                      ? "border-primary bg-accent"
                      : "hover:bg-accent/50",
                  )}
                >
                  <input
                    type="radio"
                    name="costWorry"
                    value={value}
                    checked={costWorry === value}
                    onChange={() => setCostWorry(value)}
                    className="sr-only"
                  />
                  {value}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm leading-none font-medium">
              What type of health plan do you have?
            </legend>
            <div className="mt-2 flex flex-col gap-2">
              {PLAN_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm transition-colors",
                    planType === option.value
                      ? "border-primary bg-accent"
                      : "hover:bg-accent/50",
                  )}
                >
                  <input
                    type="radio"
                    name="planType"
                    value={option.value}
                    checked={planType === option.value}
                    onChange={() => {
                      setPlanType(option.value);
                      if (option.value !== "employer") {
                        setPlanFunding("");
                      }
                    }}
                    className="accent-primary"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          {planType === "employer" && (
            <fieldset className="flex flex-col gap-1.5">
              <legend className="text-sm leading-none font-medium">
                Is your employer plan self-funded or fully insured?
              </legend>
              <p className="text-xs text-muted-foreground">
                This changes who to contact if there's ever a billing dispute.
                Check your insurance ID card, or ask HR for the Summary Plan
                Description if you're not sure — larger employers commonly
                self-fund.
              </p>
              <div className="mt-1 flex flex-col gap-2">
                {PLAN_FUNDING_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm transition-colors",
                      planFunding === option.value
                        ? "border-primary bg-accent"
                        : "hover:bg-accent/50",
                    )}
                  >
                    <input
                      type="radio"
                      name="planFunding"
                      value={option.value}
                      checked={planFunding === option.value}
                      onChange={() => setPlanFunding(option.value)}
                      className="accent-primary"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg">
        See my results
      </Button>
    </form>
  );
}
