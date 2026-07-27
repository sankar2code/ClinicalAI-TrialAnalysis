// ClinicalTrials.gov v2 API client. v1 is fully retired — v2 is the only
// supported version (PRD.md Section 3). Field paths below were verified
// against live API responses, not guessed from docs.

const CTGOV_BASE = "https://clinicaltrials.gov/api/v2";

export class TrialNotFoundError extends Error {
  constructor(nctId: string) {
    super(`No trial found for ${nctId}`);
    this.name = "TrialNotFoundError";
  }
}

export class CtGovUpstreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CtGovUpstreamError";
  }
}

export interface CtGovReference {
  pmid: string;
  type: string; // "DERIVED" | "BACKGROUND" | "RESULT" | ...
  citation: string;
}

export interface Eligibility {
  minimumAge: string | null;
  maximumAge: string | null;
  sex: string | null;
  healthyVolunteers: boolean | null;
}

export interface RawStudyRecord {
  nctId: string;
  title: string;
  overallStatus: string;
  whyStopped: string | null;
  phases: string[];
  studyType: string | null;
  conditions: string[];
  enrollmentCount: number | null;
  enrollmentType: string | null;
  leadSponsorName: string | null;
  leadSponsorClass: string | null;
  startDate: string | null;
  primaryCompletionDate: string | null;
  primaryCompletionDateType: string | null;
  completionDate: string | null;
  briefSummary: string | null;
  eligibility: Eligibility | null;
  locationsCount: number;
  countries: string[];
  hasResults: boolean;
  references: CtGovReference[];
  outcomeMeasuresSummary: string | null;
  primaryOutcomeCount: number;
  secondaryOutcomeCount: number;
  adverseEventsSummary: string | null;
}

async function fetchWithRetry(url: string, attempt = 0): Promise<Response> {
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok && res.status !== 404 && attempt === 0) {
      // one retry on transient upstream failure, per engineering-doc.md Flow 4.5
      await new Promise((r) => setTimeout(r, 500));
      return fetchWithRetry(url, 1);
    }
    return res;
  } catch (err) {
    if (attempt === 0) {
      await new Promise((r) => setTimeout(r, 500));
      return fetchWithRetry(url, 1);
    }
    throw new CtGovUpstreamError(
      err instanceof Error ? err.message : "ClinicalTrials.gov request failed"
    );
  }
}

// Summarizes only what's needed downstream — full outcome tables and
// participant-flow detail are intentionally left out. For the failure
// reasoning prompt this keeps token budget in check (PRD.md's stated
// cost/accuracy tradeoff); for the trial snapshot (non-failure statuses)
// it keeps the display honest — we surface what was measured, not a
// synthesized "did it work" verdict we'd have to compute from raw
// statistical comparisons ourselves.
// ClinicalTrials.gov descriptions come backslash-escaped for markdown
// (e.g. "\[\>\]"), since their source supports markdown rendering. We
// display plain text, so those escapes are just visual noise — strip them.
function unescapeMarkdown(text: string): string {
  return text.replace(/\\([[\]()>*_`\\])/g, "$1");
}

function summarizeOutcomeMeasures(resultsSection: any): string | null {
  const outcomes = resultsSection?.outcomeMeasuresModule?.outcomeMeasures;
  if (!Array.isArray(outcomes) || outcomes.length === 0) return null;
  return outcomes
    .slice(0, 5)
    .map((o: any) => {
      const description = o.description ? unescapeMarkdown(o.description) : "";
      return `${o.type ?? "OUTCOME"}: ${o.title ?? "untitled"}${description ? ` — ${description}` : ""}`;
    })
    .join("\n");
}

function countOutcomes(resultsSection: any, type: "PRIMARY" | "SECONDARY"): number {
  const outcomes = resultsSection?.outcomeMeasuresModule?.outcomeMeasures;
  if (!Array.isArray(outcomes)) return 0;
  return outcomes.filter((o: any) => o.type === type).length;
}

function summarizeAdverseEvents(resultsSection: any): string | null {
  const ae = resultsSection?.adverseEventsModule;
  if (!ae) return null;
  const serious = ae.seriousEvents?.length ?? 0;
  const other = ae.otherEvents?.length ?? 0;
  if (serious === 0 && other === 0) return null;
  return `${serious} serious adverse event type(s) and ${other} other adverse event type(s) reported across arms.`;
}

function parseEligibility(eligibilityModule: any): Eligibility | null {
  if (!eligibilityModule) return null;
  return {
    minimumAge: eligibilityModule.minimumAge ?? null,
    maximumAge: eligibilityModule.maximumAge ?? null,
    sex: eligibilityModule.sex ?? null,
    healthyVolunteers:
      typeof eligibilityModule.healthyVolunteers === "boolean"
        ? eligibilityModule.healthyVolunteers
        : null,
  };
}

function parseLocations(locationsModule: any): { count: number; countries: string[] } {
  const locations = locationsModule?.locations;
  if (!Array.isArray(locations) || locations.length === 0) {
    return { count: 0, countries: [] };
  }
  const countries = Array.from(
    new Set(locations.map((l: any) => l.country).filter((c: unknown): c is string => Boolean(c)))
  ).sort();
  return { count: locations.length, countries };
}

export async function fetchStudy(nctId: string): Promise<RawStudyRecord> {
  const res = await fetchWithRetry(`${CTGOV_BASE}/studies/${nctId}`);

  if (res.status === 404) {
    throw new TrialNotFoundError(nctId);
  }
  if (!res.ok) {
    throw new CtGovUpstreamError(`ClinicalTrials.gov returned ${res.status}`);
  }

  const data = await res.json();
  const ps = data.protocolSection ?? {};
  const idm = ps.identificationModule ?? {};
  const sm = ps.statusModule ?? {};
  const dm = ps.designModule ?? {};
  const sponsor = ps.sponsorCollaboratorsModule?.leadSponsor ?? {};
  const desc = ps.descriptionModule ?? {};
  const refs: CtGovReference[] = (ps.referencesModule?.references ?? [])
    .filter((r: any) => r.pmid)
    .map((r: any) => ({ pmid: r.pmid, type: r.type ?? "UNKNOWN", citation: r.citation ?? "" }));
  const { count: locationsCount, countries } = parseLocations(ps.contactsLocationsModule);

  return {
    nctId: idm.nctId ?? nctId,
    title: idm.briefTitle ?? idm.officialTitle ?? "Untitled study",
    overallStatus: sm.overallStatus ?? "UNKNOWN",
    whyStopped: sm.whyStopped ?? null,
    phases: dm.phases ?? [],
    studyType: dm.studyType ?? null,
    conditions: ps.conditionsModule?.conditions ?? [],
    enrollmentCount: dm.enrollmentInfo?.count ?? null,
    enrollmentType: dm.enrollmentInfo?.type ?? null,
    leadSponsorName: sponsor.name ?? null,
    leadSponsorClass: sponsor.class ?? null,
    startDate: sm.startDateStruct?.date ?? null,
    primaryCompletionDate: sm.primaryCompletionDateStruct?.date ?? null,
    primaryCompletionDateType: sm.primaryCompletionDateStruct?.type ?? null,
    completionDate: sm.completionDateStruct?.date ?? null,
    briefSummary: desc.briefSummary ?? null,
    eligibility: parseEligibility(ps.eligibilityModule),
    locationsCount,
    countries,
    hasResults: Boolean(data.hasResults),
    references: refs,
    outcomeMeasuresSummary: summarizeOutcomeMeasures(data.resultsSection),
    primaryOutcomeCount: countOutcomes(data.resultsSection, "PRIMARY"),
    secondaryOutcomeCount: countOutcomes(data.resultsSection, "SECONDARY"),
    adverseEventsSummary: summarizeAdverseEvents(data.resultsSection),
  };
}
