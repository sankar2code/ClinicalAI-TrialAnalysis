import AnalyzeBarPill from "@/components/AnalyzeBarPill";
import HowItWorksSteps from "@/components/HowItWorksSteps";
import HeroPreviewCard from "@/components/HeroPreviewCard";
import LiveTrialStats from "@/components/LiveTrialStats";
import { fetchStatusCounts } from "@/lib/clients/ctgovStats";
import { STATUS_COLOR_META } from "@/lib/statusColors";

// One example per major status bucket, so the homepage itself
// demonstrates both branches (failure reasoning vs. fact-only snapshot)
// without anyone having to read the copy above to understand it. Verified
// live against the ClinicalTrials.gov API before wiring in — labels here
// must match each trial's actual overallStatus. `status` is the real
// overallStatus key, used to look up the matching color in
// lib/statusColors.ts (the same one LiveTrialStats and TrialStatusTag
// use) — `label` is just the display casing.
const EXAMPLES = [
  { label: "Terminated", status: "TERMINATED", nctId: "NCT02827513" },
  { label: "Completed", status: "COMPLETED", nctId: "NCT02547428" },
  { label: "Recruiting", status: "RECRUITING", nctId: "NCT06740526" },
  { label: "Active", status: "ACTIVE_NOT_RECRUITING", nctId: "NCT07525960" },
];

export default async function Home() {
  const statusCounts = await fetchStatusCounts();

  return (
    // Wider than this app's usual 840px content cap — a deliberate,
    // scoped exception just for the hero row so HeroPreviewCard has room
    // to sit beside the text at large viewports. Everything below reverts
    // to the standard max-w-content column.
    <main className="mx-auto flex max-w-[980px] flex-col items-start gap-section px-4 py-section">
      <div className="flex w-full items-start justify-between gap-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-display-xl text-ink">
            See what happened in any clinical trial
          </h1>
          <p className="max-w-[560px] text-body-md text-body">
            Paste an NCT ID for any registered trial. If it was terminated,
            withdrawn, or suspended, we rank the likely reasons why — every
            claim labeled Fact, Inference, or Hypothesis so it never overstates
            what's known. If it completed or is still running, there's no
            failure to explain, so you get the facts instead: results,
            enrollment, sites, and linked publications. Built entirely from
            public ClinicalTrials.gov and PubMed data.
          </p>
          {statusCounts && (
            <div className="pt-4">
              <LiveTrialStats counts={statusCounts} />
            </div>
          )}
        </div>
        <HeroPreviewCard />
      </div>

      <div className="flex w-full max-w-content flex-col items-start gap-section">
        <AnalyzeBarPill />

        <div className="flex flex-col gap-2">
          <p className="text-body-sm text-muted">Try an example:</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {EXAMPLES.map((example) => (
              <a
                key={example.nctId}
                href={`/analysis/${example.nctId}`}
                className="text-body-sm text-ink no-underline"
              >
                <span className={STATUS_COLOR_META[example.status].text}>{example.label}: </span>
                <span className="underline">{example.nctId}</span>
              </a>
            ))}
          </div>
        </div>

        <HowItWorksSteps />
      </div>
    </main>
  );
}
