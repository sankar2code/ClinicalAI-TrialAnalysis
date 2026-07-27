import type { TaxonomyCategory } from "./schema/analysisResult";

// The fixed 7-category failure taxonomy from PRD.md Section 4. Categories
// are non-exclusive — a trial can plausibly fall under more than one.
export const TAXONOMY: Record<TaxonomyCategory, { label: string; description: string }> = {
  recruitment: {
    label: "Recruitment Shortfall",
    description:
      "Enrollment fell short of the planned target, or accrual was too slow to sustain the trial.",
  },
  efficacy: {
    label: "Efficacy Miss",
    description: "The primary or key secondary endpoint was not met.",
  },
  safety_toxicity: {
    label: "Safety / Toxicity",
    description:
      "Adverse events, a DSMB stop, or another safety signal drove the decision.",
  },
  funding_business: {
    label: "Funding / Business Decision",
    description:
      "Sponsor funding was withdrawn, or a business/strategic decision unrelated to trial performance ended the study.",
  },
  operational_protocol: {
    label: "Operational / Protocol Issues",
    description:
      "Site-level problems, supply issues, or protocol deviations disrupted the trial.",
  },
  strategic_competitive: {
    label: "Strategic / Competitive Deprioritization",
    description:
      "A competing therapy, a portfolio reprioritization, or a shifting standard of care likely displaced this program.",
  },
  futility: {
    label: "Futility",
    description:
      "An interim analysis indicated the trial was unlikely to reach a meaningful result if continued.",
  },
};

export const TAXONOMY_CATEGORIES = Object.keys(TAXONOMY) as TaxonomyCategory[];
