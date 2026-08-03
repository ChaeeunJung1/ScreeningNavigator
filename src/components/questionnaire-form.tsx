"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { InsuranceStatus } from "~/lib/screening-data";
import { SUPPORTED_STATES } from "~/lib/screening-data";
import { cn } from "~/lib/utils";

const INSURANCE_OPTIONS: { value: InsuranceStatus; label: string }[] = [
  { value: "uninsured", label: "Uninsured" },
  { value: "underinsured", label: "Underinsured" },
  { value: "insured", label: "Fully insured" },
];

export function QuestionnaireForm() {
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
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!state || !insurance || !age || !householdSize || !income) {
      setError("Please fill in every field to see your results.");
      return;
    }
    if (insurance === "insured" && (!hasRegularDoctor || !costWorry)) {
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
    }

    router.push(`/results?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-5 rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
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
          {SUPPORTED_STATES.map((s) => (
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
        </>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg">
        See my results
      </Button>
    </form>
  );
}
