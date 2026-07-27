// design.md `disclaimer-band`: caption-sm, muted, persistent and
// non-dismissible on every results page, per the Responsible AI
// requirements in PRD.md and engineering-doc.md Section 8.
export default function DisclaimerBand() {
  return (
    <p className="text-caption-sm text-muted">
      Not medical or investment advice. This analysis is generated from
      public ClinicalTrials.gov and PubMed data and may be incomplete or
      wrong — verify anything decision-relevant against primary sources.
    </p>
  );
}
