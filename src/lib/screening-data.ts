export type InsuranceStatus = "uninsured" | "underinsured" | "insured";

/** Which cancer screening tests a state's program actually covers, for selecting test-prep content. */
export type ScreeningType = "mammogram" | "pap" | "colon";

/**
 * How confident we are in a program's document requirements:
 * - "required": documentsRequired is populated, confirmed by an official or secondary source.
 * - "not-required": confirmed the program does NOT require proof (self-declared income, no income test, etc.) — see documentsNote.
 * - "unconfirmed": no public source either way. Never guess a checklist for this case — use DOCUMENTS_FALLBACK_UNCONFIRMED.
 */
export type DocumentsConfidence = "required" | "not-required" | "unconfirmed";

export const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
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
  /**
   * Official state-run clinic/provider locator (a real search tool — zip,
   * address, or county — not just a general info page). Only set for states
   * confirmed to have one; most programs route by phone instead and have no
   * public self-service locator to link to.
   */
  providerFinderUrl?: string;
  /**
   * A real, working locator for the state's general local/county health
   * department system — used only when the program has no locator of its
   * own (providerFinderUrl is unset). This is NOT confirmed to be the same
   * network the program enrolls through; it's the best verifiable proxy
   * (often because the program's own contact info already points at
   * county health departments). Always shown with a caveat in the UI —
   * never conflate with providerFinderUrl.
   */
  generalHealthDeptFinderUrl?: string;
  /** Program's income ceiling as % of FPL. Omitted when unconfirmed or when there's no fixed number — see incomeCeilingNote. */
  incomeCeilingFplPercent?: number;
  /** Free-text caveat for ceiling edge cases: unconfirmed, no income test, no fixed ceiling, a floor that also applies, etc. */
  incomeCeilingNote?: string;
  /** Program's minimum eligible age for breast screening. Omitted where sources conflict — see ageRangeNote. */
  ageRangeMin?: number;
  /** Program's maximum eligible age. Omitted when not specified or sources conflict — see ageRangeNote. */
  ageRangeMax?: number;
  /** Free-text caveat for age edge cases: no max specified, or a confirmed conflict between sources on the minimum age. */
  ageRangeNote?: string;
  /**
   * Documents confirmed needed to enroll — only populated when
   * documentsConfidence is "required". Sourced from the program's own
   * materials where available, otherwise a secondary source (policy manual,
   * enrollment form PDF, county page) since no state's own program page
   * publishes a checklist. See documentsConfidence for how this renders.
   */
  documentsRequired?: string[];
  /**
   * Confidence in what's needed to enroll. Omitted (undefined) is treated the
   * same as "unconfirmed" — the UI must never render a guessed checklist for
   * that case, only DOCUMENTS_FALLBACK_UNCONFIRMED.
   */
  documentsConfidence?: DocumentsConfidence;
  /** Free-text detail for the "not-required" case, e.g. why no proof is needed. */
  documentsNote?: string;
  /**
   * Which tests this program screens for, for selecting test-prep content.
   * Omitted = defaults to breast + cervical (["mammogram", "pap"]) in the UI
   * — true for every state except WA (BCCHP), which also covers colon.
   */
  screeningTypes?: ScreeningType[];
  /**
   * The state's Dept. of Insurance (or equivalent regulator) consumer
   * complaint page — for insured women whose insurer won't fix a
   * wrongly-coded preventive-care bill. This is a regulator lookup, not a
   * screening-program field, so it applies to every state regardless of
   * whether a screening program above is populated.
   *
   * Only set where a live page was confirmed — either fetched directly, or
   * (many state DOI sites block automated fetches) corroborated by matching
   * detail — official domain, correct phone number/address — across
   * multiple independent search results. See per-state comments for which.
   * Falls back to NATIONAL_INSURANCE_COMPLAINT_FALLBACK when unset — never
   * guess a state-specific URL here.
   */
  insuranceComplaintUrl?: string;
}

export interface TestPrepInfo {
  label: string;
  bullets: string[];
}

/**
 * Clinical test-prep content, keyed by test type — not by state. The
 * instructions are the same nationwide regardless of which program pays for
 * the test (ACS/CDC-sourced), so this is written once and reused for every
 * matched program via StateProgram.screeningTypes.
 */
export const TEST_PREP_BY_TYPE: Record<ScreeningType, TestPrepInfo> = {
  mammogram: {
    label: "Mammogram",
    bullets: [
      "No deodorant, antiperspirant, powder, or lotion on your chest or underarms that day — metallic particles (common in deodorant) can show up as false spots on the image.",
      "Wear a two-piece outfit — you'll only need to remove your top and bra.",
      "If you've had a mammogram elsewhere before, ask that facility to send your prior images ahead of the appointment so they can be compared.",
    ],
  },
  pap: {
    label: "Pap / HPV test",
    bullets: [
      "Avoid intercourse, douching, tampons, and vaginal medication for 48 hours before the test.",
      "Being on your period is fine — the test can still be done, though a lighter day makes for an easier sample if you have flexibility on timing.",
      "If you did have sex beforehand anyway, go to the appointment as planned and just let the clinician know.",
    ],
  },
  colon: {
    label: "Colon screening",
    bullets: [
      "Most people start with a FIT kit — a mail-in stool test done at home, with no prep required at all.",
      "A colonoscopy is only needed if the FIT test comes back positive, or if it's ordered directly. That's real prep: a bowel-clearing prep the day before, a clear-liquid diet, and a ride home after (sedation is used) — a bigger ask than the other tests here.",
    ],
  },
};

/**
 * Shown for a matched program when documentsConfidence is "unconfirmed" (or
 * omitted). No state's own program page publishes a document checklist, so
 * this states what's common without asserting it as fact for a program where
 * it isn't confirmed — never substitute a guessed list here.
 */
export const DOCUMENTS_FALLBACK_UNCONFIRMED =
  "This program didn't publish a document list. ID and proof of income are common for these programs, but not guaranteed — ask what to bring when you call.";

/**
 * Shown for the insured path when the selected state doesn't yet have a
 * confirmed insuranceComplaintUrl. NAIC's own locator (confirmed live,
 * covers all 50 states + DC via a dropdown) is a safe universal fallback —
 * never substitute a guessed state DOI URL here.
 */
export const NATIONAL_INSURANCE_COMPLAINT_FALLBACK =
  "https://content.naic.org/state-insurance-departments";

/** What kind of health plan an insured user has — determines who actually has jurisdiction over a billing dispute. */
export type InsurancePlanType =
  | "employer"
  | "marketplace"
  | "medicare_advantage"
  | "not_sure";

/**
 * Only meaningful when planType is "employer". Self-funded (a.k.a.
 * "self-insured") employer plans are federal ERISA plans regulated by the
 * U.S. Department of Labor — a state Dept. of Insurance has no jurisdiction
 * over them, even though the plan may be administered by a familiar
 * insurance-company brand. Fully-insured employer plans are state-regulated,
 * same as a marketplace plan. Most employees don't know which theirs is —
 * "not_sure" is a real, expected answer, not a data-entry gap.
 */
export type EmployerPlanFunding = "self_funded" | "fully_insured" | "not_sure";

/**
 * Who actually has jurisdiction over a billing dispute, resolved from
 * planType/planFunding. "unclear" covers every case where we can't tell
 * (planType "not_sure", or "employer" with funding "not_sure"/unset, or no
 * plan-type answer at all — e.g. a result saved before this question
 * existed) — DISPUTE_SCRIPTS["unclear"] must never guess a specific
 * regulator for that case.
 */
export type EscalationPath = "state_doi" | "dol_ebsa" | "medicare" | "unclear";

/**
 * Resolves which regulator/complaint body actually has jurisdiction.
 * Sourced this session:
 * - Self-funded employer (ERISA) plans → DOL-EBSA, not the state DOI, confirmed via
 *   dol.gov/agencies/ebsa/about-ebsa/our-activities/enforcement/erisa and
 *   insurance.ca.gov's own complaint-process guide, which states plainly that
 *   state DOI does not regulate self-insured plans even when a familiar
 *   insurer administers them.
 * - Medicare Advantage → the plan's own grievance process first, then
 *   1-800-MEDICARE — not the state DOI at all (cms.gov/medicare/appeals-grievances/managed-care).
 * - Marketplace and fully-insured employer plans → the state DOI is the
 *   right regulator (cms.gov/marketplace/about/affordable-care-act/external-appeals).
 */
export function getEscalationPath(
  planType: InsurancePlanType | null | undefined,
  planFunding: EmployerPlanFunding | null | undefined,
): EscalationPath {
  if (planType === "medicare_advantage") return "medicare";
  if (planType === "employer") {
    if (planFunding === "self_funded") return "dol_ebsa";
    if (planFunding === "fully_insured") return "state_doi";
    return "unclear";
  }
  if (planType === "marketplace") return "state_doi";
  return "unclear"; // planType "not_sure", or unset (pre-dates this question)
}

/** Fixed federal contact for ERISA self-funded plan disputes — same for every state and user. */
export const DOL_EBSA_CONTACT = {
  name: "U.S. Department of Labor – Employee Benefits Security Administration (EBSA)",
  phone: "1-866-275-7922",
  url: "www.dol.gov/agencies/ebsa",
};

/** Fixed federal contact for Medicare Advantage complaints, used only after the plan's own grievance process. */
export const MEDICARE_COMPLAINT_CONTACT = {
  name: "Medicare",
  phone: "1-800-633-4227 (1-800-MEDICARE)",
  url: "www.medicare.gov/basics/get-started-with-medicare/coverage/how-to-file-a-complaint",
};

export interface DisputeScript {
  /** One line explaining why this path applies — shown so the escalation target doesn't look arbitrary. */
  whyThisPath: string;
  /** Numbered steps for the first call, before any escalation. */
  scriptSteps: string[];
  /** What to get in writing before hanging up — needed as evidence if escalation becomes necessary. */
  writtenRequestNote: string;
}

/**
 * The full dispute script, keyed by the resolved EscalationPath. The first
 * three steps (call, cite the ACA right, get a reference number) are the
 * same regardless of path — only the "why" framing and the final escalation
 * target differ, which is exactly the distinction the plan-type question
 * exists to capture.
 */
export const DISPUTE_SCRIPTS: Record<EscalationPath, DisputeScript> = {
  state_doi: {
    whyThisPath:
      "Your plan is regulated by your state's Department of Insurance, which can investigate and order your insurer to fix a wrongly-billed claim.",
    scriptSteps: [
      'Call the member services number on your insurance card and say: "I\'m disputing a claim — my visit was billed as diagnostic, but it should be covered as a preventive screening at $0 cost-sharing under the ACA."',
      "Give the claim number and date of service so they can pull it up.",
      "Ask them to recode the claim as preventive and reprocess it.",
      "Ask for a case or reference number for this call before you hang up.",
    ],
    writtenRequestNote:
      "Ask for the outcome in writing — a denial letter or an email confirming the recode — you'll need it if you have to escalate.",
  },
  dol_ebsa: {
    whyThisPath:
      "Self-funded employer plans are federal ERISA plans — your state's Dept. of Insurance has no authority here, even if a familiar insurance company administers the plan day to day.",
    scriptSteps: [
      'Call the member services number on your insurance card and say: "I\'m disputing a claim — my visit was billed as diagnostic, but it should be covered as a preventive screening at $0 cost-sharing under the ACA."',
      "Give the claim number and date of service so they can pull it up.",
      "Ask them to recode the claim as preventive and reprocess it.",
      "Ask for a case or reference number for this call before you hang up.",
    ],
    writtenRequestNote:
      "Ask for the outcome in writing — a denial letter or an email confirming the recode — you'll need it if you have to escalate to EBSA.",
  },
  medicare: {
    whyThisPath:
      "Medicare Advantage complaints go through the plan's own grievance process first, then Medicare directly — your state's Dept. of Insurance doesn't have jurisdiction over Medicare Advantage plans.",
    scriptSteps: [
      'Call the member services number on your Medicare Advantage card and say: "I\'m filing a grievance — my visit was billed as diagnostic, but it should be covered as a preventive screening at $0 cost-sharing."',
      "Give the claim number and date of service so they can pull it up.",
      "Ask for the grievance to be logged and for a written response — plans must respond within 30 days (24 hours if urgent).",
      "Note the date you filed — you have 60 days from the billing issue to file the grievance at all.",
    ],
    writtenRequestNote:
      "If the plan doesn't resolve it or misses its deadline, call 1-800-MEDICARE to file a complaint directly with Medicare — have your case/reference number ready.",
  },
  unclear: {
    whyThisPath:
      "Who has jurisdiction depends on whether your plan is state-regulated (marketplace, or a fully-insured employer plan) or a federal ERISA plan (a self-funded employer plan) or Medicare Advantage — each escalates differently, so it's worth finding out which applies to you.",
    scriptSteps: [
      'Call the member services number on your insurance card and say: "I\'m disputing a claim — my visit was billed as diagnostic, but it should be covered as a preventive screening at $0 cost-sharing under the ACA."',
      "Give the claim number and date of service so they can pull it up.",
      "Ask them to recode the claim as preventive and reprocess it.",
      'While you\'re on the call, also ask: "Is my plan self-funded by my employer, or fully insured?" — member services can usually tell you, or check your Summary Plan Description (ask HR).',
    ],
    writtenRequestNote:
      "Ask for the outcome in writing — a denial letter or an email confirming the recode — and once you know your plan type, use it to find the right escalation contact.",
  },
};

/**
 * Facts every program needs to determine eligibility, whether or not it
 * formally requires proof — true regardless of documentsConfidence, since
 * even the self-declared programs still ask for these on the enrollment
 * call. Shown alongside DOCUMENTS_FALLBACK_UNCONFIRMED for the states where
 * we don't know the specific requirements, so there's still something
 * concrete to prepare instead of just "ask."
 */
export const DOCUMENTS_GENERAL_READY_FACTS = [
  "Your age",
  "Household size and approximate annual income",
  "Whether you currently have any insurance, and what kind",
  "Your county or city of residence",
  "Roughly when you last had a mammogram or Pap test, if ever",
];

/**
 * Generic clinic-registration advice, true independent of what this specific
 * program requires — deliberately phrased so it's never confused with a
 * claim that the program itself requires ID.
 */
export const DOCUMENTS_GENERAL_ID_NOTE =
  "Bringing a photo ID is standard practice for any clinic visit, regardless of what this specific program asks for.";

/** Source-verified screening program data for the states currently covered. */
export const STATE_PROGRAMS: Record<string, StateProgram> = {
  CA: {
    state: "California",
    programName: "Every Woman Counts",
    contact: "1-800-511-2300",
    contactNote: "Available 24/7, multiple languages",
    ifDiagnosed: "BCCTP, 1-800-824-0088",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 200,
    ageRangeMin: 40,
    ageRangeNote: "No maximum age specified in state materials.",
    website: "dhcs.ca.gov/services/every-woman-counts",
    // apps.dhcs.ca.gov/PCPSearch was found via search but sits behind a bot
    // wall that blocked verification — not confirmed working, left out.
    // CDI's own "File a Complaint" hub — confirmed live via direct fetch.
    insuranceComplaintUrl: "www.insurance.ca.gov/01-consumers/101-help/",
  },
  TX: {
    state: "Texas",
    programName: "Breast and Cervical Cancer Services (BCCS)",
    contact: "Find a BCCS Provider tool at healthytexaswomen.org",
    contactNote:
      "No single statewide number — find and call your local provider directly. Lost your Medicaid card? Call 2-1-1 (press 2 after choosing a language), or 1-877-541-7905 if 2-1-1 doesn't connect.",
    medicaidExpanded: false,
    incomeCeilingFplPercent: 200,
    ageRangeMin: 40,
    ageRangeNote: "No maximum age specified in state materials.",
    website:
      "healthytexaswomen.org/healthcare-programs/breast-cervical-cancer-services",
    // The "BCCS Provider Search" and "/find-doctor" pages were both
    // confirmed empty (title only, no actual widget) as of this check —
    // not a working locator despite the page name.
    documentsRequired: [
      "Proof of income (self-declaration accepted if you can't provide it — verification is only mandatory on the Medicaid-treatment track, not screening)",
    ],
    documentsConfidence: "required",
  },
  FL: {
    state: "Florida",
    programName:
      "Mary Brogan Breast and Cervical Cancer Early Detection Program",
    contact: "Your local county health department (floridahealth.gov)",
    contactNote:
      "Run per-county, no single statewide number. General program line: 850-245-4144. Example: Pasco County, 727-619-0369.",
    medicaidExpanded: false,
    incomeCeilingFplPercent: 200,
    ageRangeMin: 50,
    ageRangeMax: 64,
    website:
      "floridahealth.gov/individual-family-health/womens-health/breast-and-cervical-cancer-early-detection-program",
    // Program's own contact IS "your local county health department" — this
    // is FL's real "Find a County Health Department" locator, all 67
    // counties, confirmed live.
    generalHealthDeptFinderUrl:
      "www.floridahealth.gov/community-environmental-public-health/community-health/county-health-departments/county-health-department-location-finder",
    // Florida DFS's consumer complaint intake — confirmed live via direct fetch.
    insuranceComplaintUrl: "myfloridacfo.com/division/consumers/needourhelp",
  },
  PA: {
    state: "Pennsylvania",
    programName: "PA-BCCEDP",
    contact: "1-800-848-3367 or 1-800-215-7494",
    contactNote:
      "AccessMatters, 1-800-848-3367 (Bucks, Chester, Delaware, Montgomery, Philadelphia counties). Adagio Health, 1-800-215-7494 (everywhere else in Pennsylvania).",
    medicaidExpanded: true,
    incomeCeilingNote:
      "Income ceiling not confirmed — call to check eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "pa.gov/agencies/health/diseases-conditions/cancer/pa-bccedp",
  },
  NY: {
    state: "New York",
    programName: "Cancer Services Program (CSP)",
    contact: "1-866-442-2262 (1-866-442-CANCER)",
    medicaidExpanded: true,
    incomeCeilingNote:
      "No fixed income ceiling — eligibility is based on insurance-gap status, not income.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "health.ny.gov/diseases/cancer/services",
    // Filterable-by-county table of actual CSP contractor org names + direct
    // phone numbers, confirmed live (county dropdown tested).
    providerFinderUrl:
      "www.health.ny.gov/diseases/cancer/services/community_resources",
  },
  IL: {
    state: "Illinois",
    programName: "Illinois Breast and Cervical Cancer Program (IBCCP)",
    contact: "1-888-522-1282",
    contactNote: "TTY 1-800-547-0466",
    medicaidExpanded: true,
    incomeCeilingNote:
      "No income test — your income doesn't affect eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website:
      "dph.illinois.gov/topics-services/life-stages-populations/womens-health-services/ibccp.html",
    documentsConfidence: "not-required",
    documentsNote:
      "No income test — income doesn't affect eligibility for this program.",
  },
  OH: {
    state: "Ohio",
    programName: "Breast & Cervical Cancer Project (BCCP)",
    contact: "1-844-430-2227 (1-844-430-BCCP)",
    contactNote: "Routes by region via phone menu.",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "odh.ohio.gov/know-our-programs/breast-cervical-cancer-project",
    // BCCP itself routes through 4 Regional Enrollment Agencies, not local
    // health departments directly — this is Ohio's real, confirmed-live
    // "Find Local Health Departments" map, a proxy rather than a direct
    // match.
    generalHealthDeptFinderUrl: "odh.ohio.gov/find-local-health-departments",
  },
  GA: {
    state: "Georgia",
    programName: "Breast and Cervical Cancer Program (BCCP)",
    contact: "404-657-6370",
    contactNote:
      "State office line, not a direct patient line — contact your county health department, or call 1-866-PUB-HLTH (24/7) as a fallback.",
    medicaidExpanded: false,
    incomeCeilingFplPercent: 200,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "dph.georgia.gov/BCCP",
    // Program's own contact note says "contact your local county health
    // department" — this is GA's real interactive "Map of all our
    // locations" tool, confirmed live with real pins.
    generalHealthDeptFinderUrl: "dph.georgia.gov/find-location",
  },
  NC: {
    state: "North Carolina",
    programName: "NC Breast and Cervical Cancer Control Program (NC BCCCP)",
    contact: "1-800-662-7030",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "bcccp.ncdhhs.gov",
    providerFinderUrl:
      "www.dph.ncdhhs.gov/programs/chronic-disease-and-injury/cancer-prevention-and-control-branch/nc-cancer-screening-and-support-programs/find-a-provider",
    documentsRequired: [
      "Proof of income",
      "A completed demographic form (bring it to your appointment)",
    ],
    documentsConfidence: "required",
    documentsNote: "Exact process varies by county.",
    // NC DOI's "Assistance or File a Complaint" page — confirmed live via
    // direct fetch.
    insuranceComplaintUrl:
      "www.ncdoi.gov/contactscomplaints/assistance-or-file-complaint",
  },
  MI: {
    state: "Michigan",
    programName:
      "Breast and Cervical Cancer Control Navigation Program (BC3NP)",
    contact: "1-844-446-8727",
    contactNote: "TTY 711",
    medicaidExpanded: true,
    incomeCeilingNote:
      "Income ceiling not confirmed — call to check eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "michigan.gov/mdhhs/keep-mi-healthy/chronicdiseases/cancer/bc3np",
    // BC3NP's own county map/dropdown — "Click on your county in the map
    // --OR-- use the dropdown," confirmed live and program-specific.
    providerFinderUrl:
      "www.michigan.gov/mdhhs/keep-mi-healthy/chronicdiseases/cancer/bc3np/bc3np-locations",
    documentsRequired: [
      "Income and household information (enrollment form)",
      "All insurance cards",
    ],
    documentsConfidence: "required",
    // Michigan DIFS's "Filing a Complaint" page — michigan.gov blocks
    // automated fetches (direct fetch returned 403, matching this dataset's
    // existing MO precedent), but the URL and 877-999-6442 phone number are
    // corroborated across multiple independent search results.
    insuranceComplaintUrl: "www.michigan.gov/difs/consumers/complaint",
  },
  WA: {
    state: "Washington",
    programName: "Breast, Cervical and Colon Health Program (BCCHP)",
    contact: "1-888-438-2247",
    contactNote: 'Routes to one of 6 regional "Prime Contractors."',
    medicaidExpanded: true,
    incomeCeilingNote:
      "Income ceiling not confirmed — call to check eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website:
      "doh.wa.gov/you-and-your-family/illness-and-disease-z/cancer/breast-cervical-and-colon-health-program",
    // Only state program in this dataset that also covers colon screening —
    // drives the extra "colon" test-prep block on the results page.
    screeningTypes: ["mammogram", "pap", "colon"],
    // General county-by-county Local Health Jurisdiction directory —
    // confirmed real and complete, but WA's own BCCHP model runs through 6
    // regional Prime Contractors, not directly these county LHJs. Weaker
    // match than most Tier-2 states — flag if this needs re-review.
    generalHealthDeptFinderUrl:
      "doh.wa.gov/about-us/washingtons-public-health-system/washington-state-local-health-jurisdictions",
    // WA OIC's general complaints page — confirmed live via direct fetch.
    insuranceComplaintUrl:
      "www.insurance.wa.gov/complaints-appeals-fraud/complaints",
  },
  AZ: {
    state: "Arizona",
    programName: "Well Woman HealthCheck Program (WWHP)",
    contact: "1-888-257-8502 or 2-1-1",
    contactNote: "ACS-partnered hotline, M–F 8am–6pm AZ time.",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "azdhs.gov/prevention/chronic-disease/cancer-prevention-control",
    // The ArcGIS Hub "dataset" page has no map actually visible without
    // signing in and clicking through to an Explore view — confirmed empty
    // on load, not a working public locator.
  },
  MA: {
    state: "Massachusetts",
    programName:
      "Massachusetts Breast and Cervical Cancer Program (MBCCP) — formerly Women's Health Network",
    contact: "1-877-414-4447",
    medicaidExpanded: true,
    incomeCeilingNote:
      "Income ceiling not confirmed — call to check eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "mass.gov/womens-health-network-whn",
    providerFinderUrl:
      "mass.gov/info-details/massachusetts-breast-and-cervical-cancer-program-mbccp-screening-sites",
  },
  TN: {
    state: "Tennessee",
    programName: "Tennessee Breast and Cervical Screening Program (TBCSP)",
    contact: "1-877-969-6636",
    contactNote:
      "Central office; also available at every county health department.",
    medicaidExpanded: false,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "tn.gov/health/tnbcsp.html",
    documentsRequired: [
      "Self-attestation of income is accepted at your first visit — documentation may be requested later for ongoing coverage",
      "Proof of citizenship or qualified-alien status (confirmed for Nashville/Davidson County's Metro Public Health Department specifically)",
    ],
    documentsConfidence: "required",
  },
  IN: {
    state: "Indiana",
    programName: "Indiana Breast and Cervical Cancer Program (IN-BCCP)",
    contact: "317-233-7901",
    contactNote:
      "State admin office, not a patient line — 3 regional coordinators actually enroll patients.",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 200,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "in.gov/health/cdpc/cancer/early-detection",
    // IN-BCCP actually enrolls through 3 regional coordinators, not the
    // county-level local health departments this map covers — a looser
    // proxy, though confirmed live (county map/dropdown).
    generalHealthDeptFinderUrl: "www.in.gov/localhealth",
  },
  MO: {
    state: "Missouri",
    programName: "Show Me Healthy Women (SMHW)",
    contact: "1-866-726-9926",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 35,
    ageRangeMax: 64,
    website:
      "health.mo.gov/conditions-and-diseases/chronic-diseases/show-me-healthy-women",
    // health.mo.gov sits behind a bot wall that blocked verification of the
    // provider map page — not confirmed working, left out.
    documentsRequired: ["Photo ID", "Proof of income"],
    documentsConfidence: "required",
    // Missouri DOI's "What to Do if You Have a Complaint" page —
    // insurance.mo.gov also sits behind a bot wall (direct fetch returned
    // 403), but the URL, process, and 800-726-7390 hotline are corroborated
    // across multiple independent search results.
    insuranceComplaintUrl: "insurance.mo.gov/what-do-if-you-have-complaint",
  },
  MD: {
    state: "Maryland",
    programName: "Maryland Breast and Cervical Cancer Program (BCCP)",
    contact: "1-800-477-9774",
    contactNote:
      "State diagnosis/treatment line, not a screening enrollment line — screening is per-county (e.g. Howard County, 410-313-4255).",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "health.maryland.gov/phpa/cancer/pages/bccp_home.aspx",
    // Maryland Insurance Administration's "File A Complaint" page —
    // insurance.maryland.gov blocks automated fetches (direct fetch
    // returned 403), but the URL and process (1-800-492-6116) are
    // corroborated across multiple independent search results.
    insuranceComplaintUrl:
      "insurance.maryland.gov/Consumer/pages/fileacomplaint.aspx",
  },
  WI: {
    state: "Wisconsin",
    programName: "Wisconsin Well Woman Program (WWWP)",
    contact: "1-800-722-2295",
    contactNote:
      "Fallback only — most counties have their own faster direct coordinator line.",
    medicaidExpanded: false,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "dhs.wisconsin.gov/wwwp/index.htm",
    // WWWP is explicitly county-coordinated (per its own contactNote) —
    // this is WI's real "Local Public Health" county selector, confirmed
    // live, a close match.
    generalHealthDeptFinderUrl: "www.dhs.wisconsin.gov/lh-depts/index.htm",
    documentsRequired: [
      "Proof of age",
      "Proof of income (pay stub, tax statement, or Social Security/unemployment check stub)",
      "Proof of insurance status",
    ],
    documentsConfidence: "required",
    // Wisconsin OCI's "Filing an Insurance Complaint" page, from a search
    // result title exactly matching this page — a plausible near-neighbor
    // URL 404'd on direct fetch, and this exact URL wasn't independently
    // re-fetched, so treat as lower-confidence than the fetch-confirmed
    // entries above.
    insuranceComplaintUrl: "oci.wi.gov/Pages/Consumers/Filing-a-Complaint.aspx",
  },
  CO: {
    state: "Colorado",
    programName: "Women's Wellness Connection (WWC)",
    contact: "Clinic finder at cdphe.colorado.gov/find-womens-wellness-center",
    contactNote:
      "No statewide number exists — find and call your local clinic directly.",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "cdphe.colorado.gov/wwc",
    // The entire cdphe.colorado.gov domain returned a hard error on every
    // URL tried (including the newer /wwc-wisewoman/cliniclocation/map) —
    // not confirmed working, left out.
    // Colorado DOI's "File a Complaint" page (a different domain,
    // doi.colorado.gov, than the broken cdphe.colorado.gov above) — direct
    // fetch was blocked (403), but the URL and title match the top search
    // result exactly ("File a Complaint | DORA - Division of Insurance").
    insuranceComplaintUrl: "doi.colorado.gov/for-consumers/file-a-complaint",
  },
  MN: {
    state: "Minnesota",
    programName: "Sage Screening Program",
    contact: "1-888-643-2584 (1-888-6HEALTH)",
    medicaidExpanded: true,
    incomeCeilingNote:
      "Income ceiling not confirmed — call to check eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "health.state.mn.us/diseases/cancer/sage",
    // health.state.mn.us's own current page still links to
    // sage.web.health.state.mn.us for the clinic map, but that subdomain
    // returned a hard 403 Forbidden on repeated checks — not confirmed
    // working, left out.
    documentsConfidence: "not-required",
    documentsNote:
      "No documentation required — income (net income after business expenses for self-employed/farmers) is self-reported.",
  },
  VA: {
    state: "Virginia",
    programName: "Every Woman's Life (EWL)",
    contact: "1-866-395-4968",
    medicaidExpanded: true,
    incomeCeilingNote:
      "Income ceiling not confirmed — call to check eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "vdh.virginia.gov/every-womans-life",
    // EWL's only stale provider-network PDF (2018–2019) was excluded as
    // too old to trust — this is VDH's current "Health Department Locator"
    // (zip/address search + radius), confirmed live, last updated 2024.
    generalHealthDeptFinderUrl:
      "www.vdh.virginia.gov/health-department-locator",
    documentsRequired: ["Proof of income", "Proof of residency"],
    documentsConfidence: "required",
  },
  NJ: {
    state: "New Jersey",
    programName: "NJ Cancer Education and Early Detection (NJCEED)",
    contact: "1-800-328-3838",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "nj.gov/health/cancer/njceed",
    providerFinderUrl: "healthapps.nj.gov/cancer/njceed.aspx",
  },
  SC: {
    state: "South Carolina",
    programName: "Best Chance Network (BCN)",
    contact: "1-800-450-4611",
    medicaidExpanded: false,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 30,
    ageRangeMax: 64,
    website: "dph.sc.gov/bcn",
    documentsRequired: [
      "Photo ID",
      "Proof of residency",
      "Proof of income",
      "Proof of insurance",
    ],
    documentsConfidence: "required",
    documentsNote:
      "The program's own guidance is to confirm exactly what's needed when you call to schedule — it can vary by provider.",
  },
  KY: {
    state: "Kentucky",
    programName: "Kentucky Women's Cancer Screening Program (KWCSP)",
    contact: "1-844-249-0708",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 21,
    ageRangeMax: 64,
    website: "chfs.ky.gov/agencies/dph/dwh/Pages/cancerscreening.aspx",
    documentsRequired: [
      "Social Security number",
      "Insurance information, if any",
      "Proof of citizenship or immigration status (non-citizens)",
    ],
    documentsConfidence: "required",
    // Kentucky DOI's complaint form, linked from the department homepage
    // ("File a Complaint" under "How Do I?") — confirmed via a successful
    // fetch of the homepage itself.
    insuranceComplaintUrl: "insurance.ky.gov/ppc/forms/complaints_home.aspx",
  },
  LA: {
    state: "Louisiana",
    programName: "Louisiana Breast & Cervical Health Program (LBCHP)",
    contact: "1-888-599-1073",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "lbchp.org",
    providerFinderUrl: "lbchp.org/locations",
    // Louisiana DOI's "Consumer Complaint Form" — direct fetch was blocked
    // (403), but the URL and title match the top search result exactly
    // ("Louisiana Department of Insurance - Consumer Complaint Form").
    insuranceComplaintUrl:
      "www.ldi.la.gov/onlineservices/ConsumerComplaintForm",
  },
  AL: {
    state: "Alabama",
    programName:
      "Alabama Breast and Cervical Cancer Early Detection Program (ABCCEDP)",
    contact: "1-877-252-3324",
    medicaidExpanded: false,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "alabamapublichealth.gov/bandc",
    // All ADPH county health department clinics participate in ABCCEDP —
    // this is AL's real "Locations" map with search, confirmed live.
    generalHealthDeptFinderUrl:
      "www.alabamapublichealth.gov/about/locations.html",
    documentsConfidence: "not-required",
    documentsNote:
      "Proof of income is not required — a signed income declaration/self-attestation is sufficient (per the program's provider manual).",
  },
  OR: {
    state: "Oregon",
    programName: "ScreenWise (formerly Oregon BCCP)",
    contact: "1-877-255-7070",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "oregon.gov/oha/ph/healthypeoplefamilies/women/healthscreening",
    // The ScreenWise landing page has no locator; the real one is the
    // "Become a ScreenWise Patient" sub-page, confirmed to have a live,
    // sortable provider table with full addresses.
    providerFinderUrl:
      "www.oregon.gov/oha/ph/healthypeoplefamilies/women/healthscreening/pages/screenwise-patient.aspx",
    documentsConfidence: "not-required",
    documentsNote:
      "Income, insurance status, and location are all self-declared — no proof is required.",
  },
  OK: {
    state: "Oklahoma",
    programName: "Take Charge!",
    contact: "1-888-669-5934",
    medicaidExpanded: true,
    incomeCeilingNote:
      "Income ceiling not confirmed — sources conflict (185% vs. 250% FPL). Call to check eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "oklahoma.gov",
    // Take Charge! screens at county health departments among other sites —
    // this is OK's real county health department map/dropdown, confirmed
    // live (all 77 counties).
    generalHealthDeptFinderUrl: "oklahoma.gov/health/locations/countymap.html",
  },
  CT: {
    state: "Connecticut",
    programName:
      "Connecticut Breast and Cervical Cancer Early Detection Program (CBCCEDP)",
    contact: "860-509-7804",
    contactNote:
      "State office line — most patients actually contact a local provider directly.",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 200,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "portal.ct.gov/dph/cedpp",
    // CBCCEDP contracts with hospitals/health-service sites, not town
    // health agencies directly — a looser proxy, though this is CT's real
    // hover-map + lookup table, confirmed live and updated weekly.
    generalHealthDeptFinderUrl: "portal.ct.gov/dph/about/ohla/find-your-lhd",
  },
  NV: {
    state: "Nevada",
    programName: "Women's Health Connection (WHC)",
    contact: "1-877-385-2345",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "dpbh.nv.gov/programs/chronic-diseases/womens-health-connection",
  },
  MS: {
    state: "Mississippi",
    programName:
      "Mississippi Breast and Cervical Cancer Early Detection Program (MS-BCCP)",
    contact: "1-800-721-7222",
    medicaidExpanded: false,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 50,
    ageRangeMax: 64,
    website: "msdh.ms.gov",
    // MS-BCCP's ~300 sites include health department clinics — this is
    // MSDH's real county health department directory with regional office
    // addresses, confirmed live.
    generalHealthDeptFinderUrl: "msdh.ms.gov/page/19,938,166.html",
    documentsRequired: ["Proof of income"],
    documentsConfidence: "required",
    // Mississippi Insurance Dept's "File a Complaint" page — confirmed live
    // via direct fetch.
    insuranceComplaintUrl:
      "www.mid.ms.gov/mississippi-insurance-department/consumers/file-a-complaint/",
  },
  AR: {
    state: "Arkansas",
    programName: "BreastCare",
    contact: "1-833-693-2942",
    medicaidExpanded: true,
    incomeCeilingNote:
      "Income ceiling not confirmed — call to check eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "arbreastcare.com",
    providerFinderUrl:
      "healthy.arkansas.gov/programs-services/prevention-healthy-living/breastcare-program/breastcare-providers/breastcare-providers-near-you",
    documentsConfidence: "not-required",
    documentsNote: "Income is self-declared — no proof of income is required.",
    // Arkansas Insurance Dept's "File A Complaint" page — confirmed live via
    // direct fetch.
    insuranceComplaintUrl:
      "insurance.arkansas.gov/consumer-assistance/consumer-services/file-a-complaint/",
  },
  IA: {
    state: "Iowa",
    programName: "Care for Yourself",
    contact: "1-866-339-7909",
    medicaidExpanded: true,
    incomeCeilingNote:
      "Income ceiling not confirmed — call to check eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "hhs.iowa.gov/health-prevention/cancer/cfy",
    documentsConfidence: "not-required",
    documentsNote: "Proof of income is not required to enroll.",
  },
  KS: {
    state: "Kansas",
    programName: "Early Detection Works (EDW)",
    contact: "1-877-277-1368",
    medicaidExpanded: false,
    incomeCeilingFplPercent: 225,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "kdhe.ks.gov/826/Early-Detection-Works",
  },
  WV: {
    state: "West Virginia",
    programName: "WV Breast and Cervical Cancer Screening Program (WVBCCSP)",
    contact: "1-800-422-6237",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "dhhr.wv.gov/bccsp",
  },
  DE: {
    state: "Delaware",
    programName: "Screening for Life",
    contact: "302-744-1040",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    incomeCeilingNote: "A floor of 139% FPL also applies for this program.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "dhss.delaware.gov/dph/dpc/sfl",
    documentsRequired: ["Proof of income", "Proof of Delaware residency"],
    documentsConfidence: "required",
    // Delaware DOI's "File a Complaint/Appeal" page — confirmed live via
    // direct fetch.
    insuranceComplaintUrl: "insurance.delaware.gov/services/filecomplaint/",
  },
  RI: {
    state: "Rhode Island",
    programName: "Women's Cancer Screening Program",
    contact: "401-222-4324",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "health.ri.gov/breast-and-cervical-cancer-screening",
    documentsConfidence: "not-required",
    documentsNote:
      "This program doesn't require proof of income or financial status. (If you're referred for a service the program doesn't cover, or move onto the Medicaid pathway, that step may ask for documentation separately.)",
    // RI's Office of the Health Insurance Commissioner — health-insurance-
    // specific (not the general Insurance Division), a better fit than most
    // other states' general DOI page. Direct fetch was blocked (403), but
    // the URL and title match the top search result exactly ("Health
    // Insurance Complaints | Office of The Health Insurance Commissioner").
    insuranceComplaintUrl: "ohic.ri.gov/consumer-protection/file-complaint",
  },
  NH: {
    state: "New Hampshire",
    programName: "Breast & Cervical Cancer Program (BCCP)",
    contact: "603-271-4931",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "dhhs.nh.gov",
  },
  ID: {
    state: "Idaho",
    programName: "Women's Health Check",
    contact: "Contact your local public health district",
    contactNote: "No single statewide number exists.",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 200,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "healthandwelfare.idaho.gov",
  },
  NM: {
    state: "New Mexico",
    programName: "Breast and Cervical Cancer Early Detection (BCC) Program",
    contact: "1-833-525-1811",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "nmhealth.org/about/phd/pchb/bcc",
    // NM's own BCC program is run through the Dept. of Health's public
    // health offices — this is NMDOH's real "Public Health Offices" list
    // by county with full addresses/hours, confirmed live.
    generalHealthDeptFinderUrl: "www.nmhealth.org/location/public",
  },
  NE: {
    state: "Nebraska",
    programName: "Every Woman Matters (EWM)",
    contact: "1-800-532-2227",
    medicaidExpanded: true,
    incomeCeilingNote:
      "Income ceiling not confirmed — call to check eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "dhhs.ne.gov",
    // The NebraskaMap "dataset" page embeds an ArcGIS Experience app
    // (iframe present) but it rendered blank in repeated checks — not
    // confirmed working, left out.
    documentsRequired: ["Proof of income (may be requested by program staff)"],
    documentsConfidence: "required",
    documentsNote:
      "If you're later found to be over the income limit, you may be billed retroactively for services already received.",
  },
  UT: {
    state: "Utah",
    programName: "Utah Breast & Cervical Cancer Program",
    contact: "1-800-717-1811",
    medicaidExpanded: true,
    incomeCeilingNote:
      "Income ceiling not confirmed — call to check eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 74,
    website: "cancer.utah.gov",
    providerFinderUrl: "cancer.utah.gov/get-screened",
  },
  MT: {
    state: "Montana",
    programName: "Montana Cancer Screening Program",
    contact: "1-888-803-9343",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 50,
    ageRangeMax: 64,
    website: "dphhs.mt.gov",
  },
  WY: {
    state: "Wyoming",
    programName: "Wyoming Breast and Cervical Cancer Early Detection Program",
    contact: "1-800-264-1296",
    medicaidExpanded: false,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "health.wyo.gov",
  },
  ND: {
    state: "North Dakota",
    programName: "Women's Way",
    contact: "1-800-280-5512",
    medicaidExpanded: true,
    incomeCeilingNote:
      "Income ceiling not confirmed — call to check eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "hhs.nd.gov",
  },
  SD: {
    state: "South Dakota",
    programName: "All Women Count!",
    contact: "1-800-738-2301",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "doh.sd.gov",
    // getscreenedsd.org/all-women-count is only the general program page —
    // the actual locator is a separate embedded Google My Maps link on
    // that page, confirmed to load real provider pins.
    providerFinderUrl:
      "www.google.com/maps/d/u/2/viewer?mid=1oW_AzMrNUCkTPcwyz0_HJjjvsZgh1WY&femb=1&ll=44.71985644486366%2C-100.61335036997528&z=7",
    documentsConfidence: "not-required",
    documentsNote: "Income is self-reported — no documentation is required.",
  },
  VT: {
    state: "Vermont",
    programName: "You First (formerly Ladies First)",
    contact: "1-800-508-2222",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "healthvermont.gov",
  },
  ME: {
    state: "Maine",
    programName: "Maine Breast and Cervical Health Program",
    contact: "1-800-350-5180",
    medicaidExpanded: true,
    incomeCeilingFplPercent: 250,
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "maine.gov",
  },
  HI: {
    state: "Hawaii",
    programName: "Breast and Cervical Cancer Control Program",
    contact: "808-692-7480",
    contactNote:
      "State office line — contact the nearest island clinic directly.",
    medicaidExpanded: true,
    incomeCeilingNote:
      "Income ceiling not confirmed — call to check eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "health.hawaii.gov",
    providerFinderUrl: "health.hawaii.gov/cancer/program-priorities/bcccp",
  },
  AK: {
    state: "Alaska",
    programName: "Ladies First",
    contact: "1-800-410-6266",
    medicaidExpanded: true,
    incomeCeilingNote:
      "Income ceiling not confirmed — call to check eligibility.",
    ageRangeMin: 40,
    ageRangeMax: 64,
    website: "health.alaska.gov",
    // Ladies First routes by phone to contracted providers — this is
    // Alaska's real "Find Your Community Public Health Center" embedded
    // map, confirmed live, a proxy rather than a Ladies First-specific list.
    generalHealthDeptFinderUrl:
      "health.alaska.gov/en/services/find-public-health-center",
    documentsConfidence: "not-required",
    documentsNote:
      "The federally-funded (NBCCEDP) track of this program doesn't require proof of income — a separate funding stream on the same program does, so ask which applies to you.",
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
