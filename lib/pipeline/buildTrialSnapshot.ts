import type { RawStudyRecord } from "../clients/ctgov";
import type { PubMedAbstract } from "../clients/pubmed";
import type { TrialSnapshot } from "../schema/analysisResult";

// Fact-only, zero-LLM view for non-failure trials (COMPLETED, RECRUITING,
// ACTIVE_NOT_RECRUITING, etc.) — a pure data transform, no reasoning.
// Deliberately doesn't claim whether a trial "succeeded": for a completed
// trial we surface what was measured (outcome titles, counts) rather than
// computing a met/not-met verdict ourselves from raw statistical
// comparisons — same epistemic honesty the failure-analysis side enforces
// with its labeling contract, just without needing an LLM to enforce it.
export function buildTrialSnapshot(
  study: RawStudyRecord,
  publications: PubMedAbstract[]
): TrialSnapshot {
  return {
    phase: study.phases.length > 0 ? study.phases.join(" / ") : null,
    studyType: study.studyType,
    conditions: study.conditions,
    sponsor: { name: study.leadSponsorName, classType: study.leadSponsorClass },
    startDate: study.startDate,
    primaryCompletionDate: {
      date: study.primaryCompletionDate,
      type: study.primaryCompletionDateType,
    },
    completionDate: study.completionDate,
    enrollment: { count: study.enrollmentCount, type: study.enrollmentType },
    eligibility: study.eligibility,
    locations: { count: study.locationsCount, countries: study.countries },
    hasResults: study.hasResults,
    outcomeMeasuresSummary: study.outcomeMeasuresSummary,
    primaryOutcomeCount: study.primaryOutcomeCount,
    secondaryOutcomeCount: study.secondaryOutcomeCount,
    adverseEventsSummary: study.adverseEventsSummary,
    publications: publications.map((p) => ({
      pmid: p.pmid,
      title: p.title,
      journal: p.journal,
      year: p.year,
      url: `https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`,
    })),
    ctgovUrl: `https://clinicaltrials.gov/study/${study.nctId}`,
  };
}
