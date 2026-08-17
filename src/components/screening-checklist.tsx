import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DOCUMENTS_FALLBACK_UNCONFIRMED,
  DOCUMENTS_GENERAL_ID_NOTE,
  DOCUMENTS_GENERAL_READY_FACTS,
  type STATE_PROGRAMS,
  TEST_PREP_BY_TYPE,
} from "~/lib/screening-data";

/**
 * "What to bring" and "Before your appointment" — shared between the results
 * page and the dedicated /results/next-steps action-plan page so the content
 * (and its sourcing/confidence logic) only lives in one place.
 */

export function WhatToBring({
  program,
}: {
  program: (typeof STATE_PROGRAMS)[string];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What to bring</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {program.documentsConfidence === "required" &&
        program.documentsRequired ? (
          <ul className="flex flex-col gap-1 pl-4 text-sm list-disc">
            {program.documentsRequired.map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
          </ul>
        ) : program.documentsConfidence === "not-required" ? (
          <CardDescription>
            {program.documentsNote ??
              "This program doesn't require proof of income or ID."}
          </CardDescription>
        ) : (
          <>
            <CardDescription>{DOCUMENTS_FALLBACK_UNCONFIRMED}</CardDescription>
            <div>
              <p className="text-sm font-medium">
                Have these ready when you call:
              </p>
              <ul className="flex flex-col gap-1 pl-4 text-sm text-muted-foreground list-disc">
                {DOCUMENTS_GENERAL_READY_FACTS.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </div>
            <CardDescription className="text-xs">
              {DOCUMENTS_GENERAL_ID_NOTE}
            </CardDescription>
          </>
        )}
        {program.documentsConfidence === "required" &&
          program.documentsNote && (
            <CardDescription>{program.documentsNote}</CardDescription>
          )}
      </CardContent>
    </Card>
  );
}

export function BeforeYourAppointment({
  program,
}: {
  program: (typeof STATE_PROGRAMS)[string];
}) {
  const screeningTypes = program.screeningTypes ?? ["mammogram", "pap"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Before your appointment</CardTitle>
        <CardDescription>
          Prep depends on which test you're getting — ask which apply to you
          when you schedule.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {screeningTypes.map((type) => {
          const prep = TEST_PREP_BY_TYPE[type];
          return (
            <div key={type} className="flex flex-col gap-1">
              <p className="text-sm font-medium">{prep.label}</p>
              <ul className="flex flex-col gap-1 pl-4 text-sm text-muted-foreground list-disc">
                {prep.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
