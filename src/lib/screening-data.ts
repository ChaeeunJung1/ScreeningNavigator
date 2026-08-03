export type InsuranceStatus = "uninsured" | "underinsured" | "insured";

export const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
] as const;

export interface StateProgram {
  state: string;
  programName: string;
  contact: string;
  contactNote?: string;
  ifDiagnosed?: string;
  medicaidExpanded: boolean;
}

/** States with a verified, matched screening program — the only ones selectable in the questionnaire. */
export const SUPPORTED_STATE_CODES = ["CA", "TX", "FL", "PA"] as const;

/** Source-verified screening program data for the states currently covered. */
export const STATE_PROGRAMS: Record<string, StateProgram> = {
  CA: {
    state: "California",
    programName: "Every Woman Counts",
    contact: "1-800-511-2300",
    contactNote: "Available 24/7, multiple languages",
    ifDiagnosed: "BCCTP, 1-800-824-0088",
    medicaidExpanded: true,
  },
  TX: {
    state: "Texas",
    programName: "Breast and Cervical Cancer Services (BCCS)",
    contact: "Find a BCCS Provider tool at healthytexaswomen.org",
    contactNote:
      "No single statewide number — find and call your local provider directly. Lost your Medicaid card? Call 2-1-1 (press 2 after choosing a language), or 1-877-541-7905 if 2-1-1 doesn't connect.",
    medicaidExpanded: false,
  },
  FL: {
    state: "Florida",
    programName:
      "Mary Brogan Breast and Cervical Cancer Early Detection Program",
    contact: "Your local county health department (floridahealth.gov)",
    contactNote:
      "Run per-county, no single statewide number. General program line: 850-245-4444. Example: Pasco County, 727-619-0369.",
    medicaidExpanded: false,
  },
  PA: {
    state: "Pennsylvania",
    programName: "PA-BCCEDP",
    contact: "1-800-848-3367 or 1-800-215-7494",
    contactNote:
      "AccessMatters, 1-800-848-3367 (Bucks, Chester, Delaware, Montgomery, Philadelphia counties). Adagio Health, 1-800-215-7494 (everywhere else in Pennsylvania).",
    medicaidExpanded: true,
  },
};

/** The 4 supported states, in dropdown order, for the questionnaire. */
export const SUPPORTED_STATES = SUPPORTED_STATE_CODES.map((code) => {
  const match = US_STATES.find((s) => s.code === code);
  if (!match) throw new Error(`Missing US_STATES entry for ${code}`);
  return match;
});

export interface AssistanceOrg {
  name: string;
  contact: string;
}

/** Shown immediately for "get screened now," same list for every state. */
export const FINANCIAL_ASSISTANCE: AssistanceOrg[] = [
  { name: "American Cancer Society", contact: "1-800-227-2345" },
  { name: "Planned Parenthood", contact: "plannedparenthood.org" },
  {
    name: "Find a Federally Qualified Health Center (FQHC)",
    contact: "findahealthcenter.hrsa.gov",
  },
  {
    name: "Hospital charity care",
    contact: "Contact the hospital's billing office directly",
  },
];

/** Shown separately, for treatment-phase costs if something is found. */
export const COST_HELP_LATER: AssistanceOrg[] = [
  { name: "Patient Advocate Foundation", contact: "1-866-512-3861" },
  { name: "PAN Foundation", contact: "panfoundation.org" },
];

/** 2024 HHS federal poverty guidelines, contiguous US, by household size. */
const FPL_BASE: Record<number, number> = {
  1: 15060,
  2: 20440,
  3: 25820,
  4: 31200,
  5: 36580,
  6: 41960,
  7: 47340,
  8: 52720,
};
const FPL_PER_ADDITIONAL_PERSON = 5380;

export function getFederalPovertyLine(householdSize: number): number {
  const size = Math.max(1, Math.round(householdSize));
  if (size <= 8) return FPL_BASE[size] ?? FPL_BASE[1];
  return FPL_BASE[8] + (size - 8) * FPL_PER_ADDITIONAL_PERSON;
}

export function getFplPercent(
  annualIncome: number,
  householdSize: number,
): number {
  const povertyLine = getFederalPovertyLine(householdSize);
  return Math.round((annualIncome / povertyLine) * 100);
}

/** Most state screening programs target this age and income range; outside of it, eligibility should be confirmed by phone. */
export const TYPICAL_PROGRAM_AGE_RANGE = { min: 40, max: 64 };
export const TYPICAL_PROGRAM_FPL_MAX = 250;
