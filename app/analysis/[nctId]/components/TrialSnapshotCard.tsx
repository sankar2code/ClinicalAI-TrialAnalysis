import type { TrialMeta, TrialSnapshot } from "@/lib/schema/analysisResult";
import EvidenceRow from "./EvidenceRow";

const SEX_LABEL: Record<string, string> = { ALL: "All", MALE: "Male", FEMALE: "Female" };

const STATUS_INTRO: Record<string, string> = {
  COMPLETED: "This trial completed as planned — here's what's on the public record.",
  RECRUITING: "This trial is currently recruiting participants.",
  NOT_YET_RECRUITING: "This trial is planned but hasn't started recruiting yet.",
  ENROLLING_BY_INVITATION: "This trial is enrolling by invitation only.",
  ACTIVE_NOT_RECRUITING: "This trial has finished enrolling and is no longer recruiting, but is still active.",
};

function Fact({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="text-body-md text-ink">{value}</dd>
    </div>
  );
}

function formatAgeRange(min: string | null, max: string | null): string | null {
  if (!min && !max) return null;
  if (min && max) return `${min} to ${max}`;
  return min ? `${min}+` : max;
}

function formatDate(date: string | null, type?: string | null): string | null {
  if (!date) return null;
  return type && type !== "ACTUAL" ? `${date} (estimated)` : date;
}

// engineering-doc.md Flow 4.4, rebuilt: every non-failure status gets a
// fact-only snapshot instead of a bare "no failure to analyze" message —
// zero LLM calls, every field pulled straight from ClinicalTrials.gov and
// PubMed (buildTrialSnapshot.ts).
export default function TrialSnapshotCard({
  trial,
  snapshot,
}: {
  trial: TrialMeta;
  snapshot: TrialSnapshot;
}) {
  const eligibilityAge = snapshot.eligibility
    ? formatAgeRange(snapshot.eligibility.minimumAge, snapshot.eligibility.maximumAge)
    : null;
  const eligibilitySex = snapshot.eligibility?.sex
    ? SEX_LABEL[snapshot.eligibility.sex] ?? snapshot.eligibility.sex
    : null;

  return (
    <div className="flex flex-col gap-8">
      <p className="text-body-md text-body">
        {STATUS_INTRO[trial.overallStatus] ?? "Here's what's on the public record for this trial."}
      </p>

      <dl className="grid grid-cols-1 gap-6 rounded-md border border-hairline p-6 sm:grid-cols-2">
        <Fact label="Phase" value={snapshot.phase ?? "Not specified"} />
        <Fact label="Study type" value={snapshot.studyType} />
        <Fact label="Condition(s)" value={snapshot.conditions.length > 0 ? snapshot.conditions.join(", ") : null} />
        <Fact
          label="Sponsor"
          value={
            snapshot.sponsor.name
              ? `${snapshot.sponsor.name}${snapshot.sponsor.classType ? ` (${snapshot.sponsor.classType})` : ""}`
              : null
          }
        />
        <Fact label="Start date" value={formatDate(snapshot.startDate)} />
        <Fact
          label={trial.overallStatus === "COMPLETED" ? "Completion date" : "Estimated completion"}
          value={formatDate(snapshot.completionDate ?? snapshot.primaryCompletionDate.date, snapshot.primaryCompletionDate.type)}
        />
        <Fact
          label={snapshot.enrollment.type === "ESTIMATED" ? "Target enrollment" : "Enrollment"}
          value={snapshot.enrollment.count !== null ? `${snapshot.enrollment.count} participants` : null}
        />
        <Fact
          label="Who can join"
          value={
            eligibilityAge || eligibilitySex
              ? [eligibilityAge, eligibilitySex && `Sex: ${eligibilitySex}`, snapshot.eligibility?.healthyVolunteers ? "Healthy volunteers accepted" : null]
                  .filter(Boolean)
                  .join(" · ")
              : null
          }
        />
        <Fact
          label="Trial sites"
          value={
            snapshot.locations.count > 0
              ? `${snapshot.locations.count} site${snapshot.locations.count === 1 ? "" : "s"}${
                  snapshot.locations.countries.length > 0 ? ` in ${snapshot.locations.countries.join(", ")}` : ""
                }`
              : null
          }
        />
      </dl>

      {snapshot.hasResults && (
        <section className="flex flex-col gap-3 rounded-md bg-surface-soft p-6">
          <h3 className="text-display-sm text-ink">Results</h3>
          <p className="text-body-sm text-muted">
            {snapshot.primaryOutcomeCount} primary and {snapshot.secondaryOutcomeCount} secondary outcome measure
            {snapshot.primaryOutcomeCount + snapshot.secondaryOutcomeCount === 1 ? "" : "s"} reported. Full statistical
            results, including whether primary endpoints were met, are on the ClinicalTrials.gov record linked below —
            we surface what was measured here, not a computed verdict.
          </p>
          {snapshot.outcomeMeasuresSummary && (
            <p className="whitespace-pre-line text-body-sm text-body">{snapshot.outcomeMeasuresSummary}</p>
          )}
          {snapshot.adverseEventsSummary && (
            <p className="text-body-sm text-body">{snapshot.adverseEventsSummary}</p>
          )}
        </section>
      )}

      {snapshot.publications.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-display-sm text-ink">Publications</h3>
          <ul className="rounded-md border border-hairline px-6">
            {snapshot.publications.map((pub) => (
              <EvidenceRow
                key={pub.pmid}
                item={{
                  claim: `${pub.title}${pub.journal ? ` — ${pub.journal}` : ""}${pub.year ? ` (${pub.year})` : ""}`,
                  epistemicStatus: "fact",
                  sourceUrl: pub.url,
                }}
              />
            ))}
          </ul>
        </section>
      )}

      <a href={snapshot.ctgovUrl} target="_blank" rel="noreferrer" className="text-link text-ink underline">
        View full record on ClinicalTrials.gov
      </a>
    </div>
  );
}
