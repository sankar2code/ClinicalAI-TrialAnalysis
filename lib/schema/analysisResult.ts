import { z } from "zod";

// Mirrors docs/engineering/engineering-doc.md Section 8 — this is the
// strict schema every Anthropic response is validated against. A response
// that fails this schema is never rendered, even partially (see
// lib/pipeline/analyzeTrial.ts and PRD.md's "zero unlabeled claims" gate).

export const EpistemicStatusSchema = z.enum(["fact", "inference", "hypothesis"]);
export type EpistemicStatus = z.infer<typeof EpistemicStatusSchema>;

export const TaxonomyCategorySchema = z.enum([
  "recruitment",
  "efficacy",
  "safety_toxicity",
  "funding_business",
  "operational_protocol",
  "strategic_competitive",
  "futility",
]);
export type TaxonomyCategory = z.infer<typeof TaxonomyCategorySchema>;

export const ConfidenceSchema = z.enum(["low", "medium", "high", "very_high"]);
export type Confidence = z.infer<typeof ConfidenceSchema>;

export const EvidenceItemSchema = z.object({
  claim: z.string().min(1),
  epistemicStatus: EpistemicStatusSchema,
  sourceUrl: z.string().url(),
});
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;

export const HypothesisSchema = z.object({
  category: TaxonomyCategorySchema,
  label: z.string().min(1),
  confidence: ConfidenceSchema,
  evidenceFor: z.array(EvidenceItemSchema).min(1),
  strongestCounterArgument: z.string().min(1), // required — never optional
});
export type Hypothesis = z.infer<typeof HypothesisSchema>;

export const AnalysisResultSchema = z.object({
  bottomLine: z.string().min(1),
  hypotheses: z.array(HypothesisSchema).min(1),
  // Optional: the model sometimes omits this when every piece of evidence
  // is already inside hypotheses[].evidenceFor (which remains strictly
  // required, per-item, per hypothesis) — this field is a supplementary
  // at-a-glance list, not the core evidentiary backbone, so treating a
  // missing key as an empty list doesn't weaken the "zero unlabeled
  // claims" guarantee.
  evidence: z.array(EvidenceItemSchema).default([]),
  guardrail: z.string().min(1),
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

const OVERALL_STATUSES = [
  "TERMINATED",
  "WITHDRAWN",
  "SUSPENDED",
  "COMPLETED",
  "RECRUITING",
  "ACTIVE_NOT_RECRUITING",
  "NOT_YET_RECRUITING",
  "ENROLLING_BY_INVITATION",
  "UNKNOWN",
] as const;
export type OverallStatus = (typeof OVERALL_STATUSES)[number];

export const TrialMetaSchema = z.object({
  nctId: z.string(),
  title: z.string(),
  overallStatus: z.enum(OVERALL_STATUSES),
});
export type TrialMeta = z.infer<typeof TrialMetaSchema>;

export const FAILURE_STATUSES: ReadonlySet<OverallStatus> = new Set([
  "TERMINATED",
  "WITHDRAWN",
  "SUSPENDED",
]);

// Fact-only view for every non-failure status (COMPLETED, RECRUITING,
// ACTIVE_NOT_RECRUITING, etc.) — built by lib/pipeline/buildTrialSnapshot.ts
// straight from ClinicalTrials.gov/PubMed data with zero LLM calls. There's
// no ambiguous "why" to reason about here the way there is for a failed
// trial, so this deliberately doesn't reuse the Hypothesis/Evidence shape
// above — it's a structured digest, not a reasoning output.
export interface TrialSnapshot {
  phase: string | null;
  studyType: string | null;
  conditions: string[];
  sponsor: { name: string | null; classType: string | null };
  startDate: string | null;
  primaryCompletionDate: { date: string | null; type: string | null };
  completionDate: string | null;
  enrollment: { count: number | null; type: string | null };
  eligibility: {
    minimumAge: string | null;
    maximumAge: string | null;
    sex: string | null;
    healthyVolunteers: boolean | null;
  } | null;
  locations: { count: number; countries: string[] };
  hasResults: boolean;
  outcomeMeasuresSummary: string | null;
  primaryOutcomeCount: number;
  secondaryOutcomeCount: number;
  adverseEventsSummary: string | null;
  publications: { pmid: string; title: string; journal: string | null; year: string | null; url: string }[];
  ctgovUrl: string;
}

// The four shapes GET /api/analyze/[nctId] can return, per
// engineering-doc.md Section 9.
export type AnalyzeApiResponse =
  | { status: "analyzed"; trial: TrialMeta; bottomLine: string; hypotheses: Hypothesis[]; evidence: EvidenceItem[]; guardrail: string }
  | { status: "snapshot"; trial: TrialMeta; snapshot: TrialSnapshot }
  | { error: "invalid_format" }
  | { error: "trial_not_found" }
  | { error: "upstream_failure"; retryable: true }
  | { error: "internal_error" };
