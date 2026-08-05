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
  website?: string;
}

/** Source-verified screening program data for the states currently covered. */
export const STATE_PROGRAMS: Record<string, StateProgram> = {
  CA: {
    state: "California",
    programName: "Every Woman Counts",
    contact: "1-800-511-2300",
    contactNote: "Available 24/7, multiple languages",
    ifDiagnosed: "BCCTP, 1-800-824-0088",
    medicaidExpanded: true,
    website: "dhcs.ca.gov/services/every-woman-counts",
  },
  TX: {
    state: "Texas",
    programName: "Breast and Cervical Cancer Services (BCCS)",
    contact: "Find a BCCS Provider tool at healthytexaswomen.org",
    contactNote:
      "No single statewide number — find and call your local provider directly. Lost your Medicaid card? Call 2-1-1 (press 2 after choosing a language), or 1-877-541-7905 if 2-1-1 doesn't connect.",
    medicaidExpanded: false,
    website:
      "healthytexaswomen.org/healthcare-programs/breast-cervical-cancer-services",
  },
  FL: {
    state: "Florida",
    programName:
      "Mary Brogan Breast and Cervical Cancer Early Detection Program",
    contact: "Your local county health department (floridahealth.gov)",
    contactNote:
      "Run per-county, no single statewide number. General program line: 850-245-4144. Example: Pasco County, 727-619-0369.",
    medicaidExpanded: false,
    website:
      "floridahealth.gov/individual-family-health/womens-health/breast-and-cervical-cancer-early-detection-program",
  },
  PA: {
    state: "Pennsylvania",
    programName: "PA-BCCEDP",
    contact: "1-800-848-3367 or 1-800-215-7494",
    contactNote:
      "AccessMatters, 1-800-848-3367 (Bucks, Chester, Delaware, Montgomery, Philadelphia counties). Adagio Health, 1-800-215-7494 (everywhere else in Pennsylvania).",
    medicaidExpanded: true,
    website: "pa.gov/agencies/health/diseases-conditions/cancer/pa-bccedp",
  },
  NY: {
    state: "New York",
    programName: "Cancer Services Program (CSP)",
    contact: "1-866-442-2262 (1-866-442-CANCER)",
    medicaidExpanded: true,
    website: "health.ny.gov/diseases/cancer/services",
  },
  IL: {
    state: "Illinois",
    programName: "Illinois Breast and Cervical Cancer Program (IBCCP)",
    contact: "1-888-522-1282",
    contactNote: "TTY 1-800-547-0466",
    medicaidExpanded: true,
    website:
      "dph.illinois.gov/topics-services/life-stages-populations/womens-health-services/ibccp.html",
  },
  OH: {
    state: "Ohio",
    programName: "Breast & Cervical Cancer Project (BCCP)",
    contact: "1-844-430-2227 (1-844-430-BCCP)",
    contactNote: "Routes by region via phone menu.",
    medicaidExpanded: true,
    website: "odh.ohio.gov/know-our-programs/breast-cervical-cancer-project",
  },
  GA: {
    state: "Georgia",
    programName: "Breast and Cervical Cancer Program (BCCP)",
    contact: "404-657-6370",
    contactNote:
      "State office line, not a direct patient line — contact your county health department, or call 1-866-PUB-HLTH (24/7) as a fallback.",
    medicaidExpanded: false,
    website: "dph.georgia.gov/BCCP",
  },
  NC: {
    state: "North Carolina",
    programName: "NC Breast and Cervical Cancer Control Program (NC BCCCP)",
    contact: "1-800-662-7030",
    medicaidExpanded: true,
    website: "bcccp.ncdhhs.gov",
  },
  MI: {
    state: "Michigan",
    programName:
      "Breast and Cervical Cancer Control Navigation Program (BC3NP)",
    contact: "1-844-446-8727",
    contactNote: "TTY 711",
    medicaidExpanded: true,
    website: "michigan.gov/mdhhs/keep-mi-healthy/chronicdiseases/cancer/bc3np",
  },
  WA: {
    state: "Washington",
    programName: "Breast, Cervical and Colon Health Program (BCCHP)",
    contact: "1-888-438-2247",
    contactNote: 'Routes to one of 6 regional "Prime Contractors."',
    medicaidExpanded: true,
    website:
      "doh.wa.gov/you-and-your-family/illness-and-disease-z/cancer/breast-cervical-and-colon-health-program",
  },
  AZ: {
    state: "Arizona",
    programName: "Well Woman HealthCheck Program (WWHP)",
    contact: "1-888-257-8502 or 2-1-1",
    contactNote: "ACS-partnered hotline, M–F 8am–6pm AZ time.",
    medicaidExpanded: true,
    website: "azdhs.gov/prevention/chronic-disease/cancer-prevention-control",
  },
  MA: {
    state: "Massachusetts",
    programName:
      "Massachusetts Breast and Cervical Cancer Program (MBCCP) — formerly Women's Health Network",
    contact: "1-877-414-4447",
    medicaidExpanded: true,
    website: "mass.gov/womens-health-network-whn",
  },
  TN: {
    state: "Tennessee",
    programName: "Tennessee Breast and Cervical Screening Program (TBCSP)",
    contact: "1-877-969-6636",
    contactNote:
      "Central office; also available at every county health department.",
    medicaidExpanded: false,
    website: "tn.gov/health/tnbcsp.html",
  },
  IN: {
    state: "Indiana",
    programName: "Indiana Breast and Cervical Cancer Program (IN-BCCP)",
    contact: "317-233-7901",
    contactNote:
      "State admin office, not a patient line — 3 regional coordinators actually enroll patients.",
    medicaidExpanded: true,
    website: "in.gov/health/cdpc/cancer/early-detection",
  },
  MO: {
    state: "Missouri",
    programName: "Show Me Healthy Women (SMHW)",
    contact: "1-866-726-9926",
    medicaidExpanded: true,
    website:
      "health.mo.gov/conditions-and-diseases/chronic-diseases/show-me-healthy-women",
  },
  MD: {
    state: "Maryland",
    programName: "Maryland Breast and Cervical Cancer Program (BCCP)",
    contact: "1-800-477-9774",
    contactNote:
      "State diagnosis/treatment line, not a screening enrollment line — screening is per-county (e.g. Howard County, 410-313-4255).",
    medicaidExpanded: true,
    website: "health.maryland.gov/phpa/cancer/pages/bccp_home.aspx",
  },
  WI: {
    state: "Wisconsin",
    programName: "Wisconsin Well Woman Program (WWWP)",
    contact: "1-800-722-2295",
    contactNote:
      "Fallback only — most counties have their own faster direct coordinator line.",
    medicaidExpanded: false,
    website: "dhs.wisconsin.gov/wwwp/index.htm",
  },
  CO: {
    state: "Colorado",
    programName: "Women's Wellness Connection (WWC)",
    contact: "Clinic finder at cdphe.colorado.gov/find-womens-wellness-center",
    contactNote:
      "No statewide number exists — find and call your local clinic directly.",
    medicaidExpanded: true,
    website: "cdphe.colorado.gov/wwc",
  },
  MN: {
    state: "Minnesota",
    programName: "Sage Screening Program",
    contact: "1-888-643-2584 (1-888-6HEALTH)",
    medicaidExpanded: true,
    website: "health.state.mn.us/diseases/cancer/sage",
  },
  VA: {
    state: "Virginia",
    programName: "Every Woman's Life (EWL)",
    contact: "1-866-395-4968",
    medicaidExpanded: true,
    website: "vdh.virginia.gov/every-womans-life",
  },
  NJ: {
    state: "New Jersey",
    programName: "NJ Cancer Education and Early Detection (NJCEED)",
    contact: "1-800-328-3838",
    medicaidExpanded: true,
    website: "nj.gov/health/cancer/njceed",
  },
  SC: {
    state: "South Carolina",
    programName: "Best Chance Network (BCN)",
    contact: "1-800-450-4611",
    medicaidExpanded: false,
    website: "dph.sc.gov/bcn",
  },
  KY: {
    state: "Kentucky",
    programName: "Kentucky Women's Cancer Screening Program (KWCSP)",
    contact: "1-844-249-0708",
    medicaidExpanded: true,
    website: "chfs.ky.gov/agencies/dph/dwh/Pages/cancerscreening.aspx",
  },
  LA: {
    state: "Louisiana",
    programName: "Louisiana Breast & Cervical Health Program (LBCHP)",
    contact: "1-888-599-1073",
    medicaidExpanded: true,
    website: "lbchp.org",
  },
  AL: {
    state: "Alabama",
    programName:
      "Alabama Breast and Cervical Cancer Early Detection Program (ABCCEDP)",
    contact: "1-877-252-3324",
    medicaidExpanded: false,
    website: "alabamapublichealth.gov/bandc",
  },
  OR: {
    state: "Oregon",
    programName: "ScreenWise (formerly Oregon BCCP)",
    contact: "1-877-255-7070",
    medicaidExpanded: true,
    website: "oregon.gov/oha/ph/healthypeoplefamilies/women/healthscreening",
  },
  OK: {
    state: "Oklahoma",
    programName: "Take Charge!",
    contact: "1-888-669-5934",
    medicaidExpanded: true,
    website: "oklahoma.gov",
  },
  CT: {
    state: "Connecticut",
    programName:
      "Connecticut Breast and Cervical Cancer Early Detection Program (CBCCEDP)",
    contact: "860-509-7804",
    contactNote:
      "State office line — most patients actually contact a local provider directly.",
    medicaidExpanded: true,
    website: "portal.ct.gov/dph/cedpp",
  },
  NV: {
    state: "Nevada",
    programName: "Women's Health Connection (WHC)",
    contact: "1-877-385-2345",
    medicaidExpanded: true,
    website: "dpbh.nv.gov/programs/chronic-diseases/womens-health-connection",
  },
  MS: {
    state: "Mississippi",
    programName:
      "Mississippi Breast and Cervical Cancer Early Detection Program (MS-BCCP)",
    contact: "1-800-721-7222",
    medicaidExpanded: false,
    website: "msdh.ms.gov",
  },
  AR: {
    state: "Arkansas",
    programName: "BreastCare",
    contact: "1-833-693-2942",
    medicaidExpanded: true,
    website: "arbreastcare.com",
  },
  IA: {
    state: "Iowa",
    programName: "Care for Yourself",
    contact: "1-866-339-7909",
    medicaidExpanded: true,
    website: "hhs.iowa.gov/health-prevention/cancer/cfy",
  },
  KS: {
    state: "Kansas",
    programName: "Early Detection Works (EDW)",
    contact: "1-877-277-1368",
    medicaidExpanded: false,
    website: "kdhe.ks.gov/826/Early-Detection-Works",
  },
  WV: {
    state: "West Virginia",
    programName: "WV Breast and Cervical Cancer Screening Program (WVBCCSP)",
    contact: "1-800-422-6237",
    medicaidExpanded: true,
    website: "dhhr.wv.gov/bccsp",
  },
  DE: {
    state: "Delaware",
    programName: "Screening for Life",
    contact: "302-744-1040",
    medicaidExpanded: true,
    website: "dhss.delaware.gov/dph/dpc/sfl",
  },
  RI: {
    state: "Rhode Island",
    programName: "Women's Cancer Screening Program",
    contact: "401-222-4324",
    medicaidExpanded: true,
    website: "health.ri.gov/breast-and-cervical-cancer-screening",
  },
  NH: {
    state: "New Hampshire",
    programName: "Breast & Cervical Cancer Program (BCCP)",
    contact: "603-271-4931",
    medicaidExpanded: true,
    website: "dhhs.nh.gov",
  },
  ID: {
    state: "Idaho",
    programName: "Women's Health Check",
    contact: "Contact your local public health district",
    contactNote: "No single statewide number exists.",
    medicaidExpanded: true,
    website: "healthandwelfare.idaho.gov",
  },
  NM: {
    state: "New Mexico",
    programName: "Breast and Cervical Cancer Early Detection (BCC) Program",
    contact: "1-833-525-1811",
    medicaidExpanded: true,
    website: "nmhealth.org/about/phd/pchb/bcc",
  },
  NE: {
    state: "Nebraska",
    programName: "Every Woman Matters (EWM)",
    contact: "1-800-532-2227",
    medicaidExpanded: true,
    website: "dhhs.ne.gov",
  },
  UT: {
    state: "Utah",
    programName: "Utah Breast & Cervical Cancer Program",
    contact: "1-800-717-1811",
    medicaidExpanded: true,
    website: "cancer.utah.gov",
  },
  MT: {
    state: "Montana",
    programName: "Montana Cancer Screening Program",
    contact: "1-888-803-9343",
    medicaidExpanded: true,
    website: "dphhs.mt.gov",
  },
  WY: {
    state: "Wyoming",
    programName: "Wyoming Breast and Cervical Cancer Early Detection Program",
    contact: "1-800-264-1296",
    medicaidExpanded: false,
    website: "health.wyo.gov",
  },
  ND: {
    state: "North Dakota",
    programName: "Women's Way",
    contact: "1-800-280-5512",
    medicaidExpanded: true,
    website: "hhs.nd.gov",
  },
  SD: {
    state: "South Dakota",
    programName: "All Women Count!",
    contact: "1-800-738-2301",
    medicaidExpanded: true,
    website: "doh.sd.gov",
  },
  VT: {
    state: "Vermont",
    programName: "You First (formerly Ladies First)",
    contact: "1-800-508-2222",
    medicaidExpanded: true,
    website: "healthvermont.gov",
  },
  ME: {
    state: "Maine",
    programName: "Maine Breast and Cervical Health Program",
    contact: "1-800-350-5180",
    medicaidExpanded: true,
    website: "maine.gov",
  },
  HI: {
    state: "Hawaii",
    programName: "Breast and Cervical Cancer Control Program",
    contact: "808-692-7480",
    contactNote:
      "State office line — contact the nearest island clinic directly.",
    medicaidExpanded: true,
    website: "health.hawaii.gov",
  },
  AK: {
    state: "Alaska",
    programName: "Ladies First",
    contact: "1-800-410-6266",
    medicaidExpanded: true,
    website: "health.alaska.gov",
  },
};

export interface AssistanceOrg {
  name: string;
  contact: string;
  /** Optional eligibility criteria, shown alongside the org when present. */
  eligibility?: string;
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

/**
 * Shown for the uninsured/underinsured path, for treatment-phase costs if
 * something is found. CancerCare and The Pink Fund have no insurance
 * requirement (income/treatment-status based instead), so they're safe to
 * show to women who don't have coverage.
 */
export const COST_HELP_LATER: AssistanceOrg[] = [
  { name: "CancerCare", contact: "1-800-813-4673" },
  { name: "The Pink Fund", contact: "pinkfund.org" },
  {
    name: "Family Reach",
    contact: "973-394-1411 · familyreach.org",
    eligibility:
      "Income ≤300% FPL for some funds, plus age/family structure: patient under 31, or 31+ with children 18 or under at home.",
  },
  {
    name: "American Cancer Society Hope Lodge",
    contact:
      "1-800-227-2345 · cancer.org/support-programs-and-services/patient-lodging/hope-lodge.html",
    eligibility:
      "Must be in active treatment and living 40+ miles from the treatment center. No income limit.",
  },
];

/**
 * Shown for the insured path only. Patient Advocate Foundation and PAN
 * Foundation both require the applicant to already have insurance — wrong
 * for the uninsured/underinsured path (see COST_HELP_LATER above), but a
 * fit here since these users do have coverage.
 * PAN Foundation merged into Patient Advocate Foundation in March 2026 —
 * one entry, not two separate orgs.
 */
export const INSURED_COST_HELP: AssistanceOrg[] = [
  {
    name: "Patient Advocate Foundation (formerly PAN Foundation, merged March 2026)",
    contact: "1-866-512-3861 · copays.org",
  },
  {
    name: "HealthWell Foundation",
    contact: "1-800-675-8416 · healthwellfoundation.org",
    eligibility:
      "Must have insurance covering part of the treatment cost — applies even to their travel fund.",
  },
];

/**
 * Most states extend Medicaid coverage for treatment to women diagnosed
 * through their state screening program — via the federal Breast and
 * Cervical Cancer Treatment Act — regardless of the state's regular
 * Medicaid income cutoff or expansion status. Often overlooked, so it's
 * surfaced as a pointer alongside the cost-assistance orgs above.
 */
export const MEDICAID_TREATMENT_PATHWAY_NOTE =
  "If you're diagnosed, ask about Medicaid for treatment: most states extend Medicaid coverage for breast or cervical cancer treatment to women diagnosed through a state screening program, regardless of your state's regular Medicaid income cutoff. Your screening program (above) can tell you how to apply.";

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
