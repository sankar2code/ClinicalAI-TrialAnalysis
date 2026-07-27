import type { TrialMeta } from "@/lib/schema/analysisResult";
import { STATUS_COLOR_META } from "@/lib/statusColors";

const FAILURE_STATUSES = new Set(["TERMINATED", "WITHDRAWN", "SUSPENDED"]);

// design.md `trial-status-tag`: repurposed from the source system's "NEW"
// badge. For the 4 statuses LiveTrialStats colors on the homepage
// (Terminated/Completed/Recruiting/Active), this tag now matches that
// same color, via the shared lib/statusColors.ts — so a status reads as
// the same color whether you're looking at the homepage's live counts
// or this specific trial's result page. Anything outside that set
// (WITHDRAWN, SUSPENDED, etc.) falls back to the original ink/muted
// binary: ink-outlined for the failure-analysis statuses, muted-outlined
// for everything else.
export default function TrialStatusTag({
  status,
}: {
  status: TrialMeta["overallStatus"];
}) {
  const colorMeta = STATUS_COLOR_META[status];
  const isFailureStatus = FAILURE_STATUSES.has(status);
  const classes = colorMeta
    ? `${colorMeta.border} ${colorMeta.text}`
    : isFailureStatus
      ? "border-ink text-ink"
      : "border-muted-soft text-muted";

  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center self-start rounded-full border px-2.5 py-1 text-uppercase-tag uppercase ${classes}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
