import type { StatusCount } from "@/lib/clients/ctgovStats";
import { STATUS_COLOR_META } from "@/lib/statusColors";
import RollingNumber from "./RollingNumber";

// Card fill/pill/icon colors come from the shared lib/statusColors.ts —
// the same source TrialStatusTag and the homepage's example links use,
// so a given status reads as the same color everywhere. The one thing
// that can't be shared is this left-edge accent: Tailwind's JIT scanner
// needs the full `border-l-stat-*-accent` class literally present in
// source, so it can't be built by string-concatenating the shared
// all-sides `border-stat-*-accent` class from lib/statusColors.ts.
const EDGE_BY_STATUS: Record<string, string> = {
  TERMINATED: "border-l-stat-terminated-accent",
  COMPLETED: "border-l-stat-completed-accent",
  RECRUITING: "border-l-stat-recruiting-accent",
  ACTIVE_NOT_RECRUITING: "border-l-stat-active-accent",
};

// Same 24-viewBox, stroke-only vocabulary as HowItWorksSteps /
// AnalysisStageIcon — one literal icon per status rather than a generic
// dot, so the card reads at a glance even before the label does.
const STAT_ICONS: Record<string, JSX.Element> = {
  TERMINATED: <rect x="6" y="6" width="12" height="12" rx="2.5" />,
  COMPLETED: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.3 12.3l2.6 2.6 4.8-5.8" />
    </>
  ),
  RECRUITING: (
    <>
      <circle cx="9.5" cy="9" r="3" />
      <path d="M4 19c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5" />
      <path d="M17 8v5 M14.5 10.5h5" />
    </>
  ),
  ACTIVE_NOT_RECRUITING: <path d="M3 12h3.5l1.8-5 3 10 2-7.5 1.5 2.5H21" />,
};

function StatCard({ status, label, count, index }: StatusCount & { index: number }) {
  const meta = STATUS_COLOR_META[status];
  const edge = EDGE_BY_STATUS[status];

  return (
    <div className="hero-card-in" style={{ animationDelay: `${index * 80}ms` }}>
      {/* Entrance animation (outer) and interactive hover transform
          (inner) are split across two elements — a CSS @keyframes
          animation's `to` state with fill-mode both permanently pins
          `transform` on whatever element it's applied to, which would
          silently cancel a hover:scale utility on that same element
          (see HeroPreviewCard.tsx for the original diagnosis). */}
      <div
        className={`group flex cursor-default flex-col gap-2 rounded-md border border-hairline border-l-4 p-4 transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-card ${meta.bg} ${edge}`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`w-fit rounded-full border px-2.5 py-1 text-uppercase-tag uppercase ${meta.border} ${meta.text}`}
          >
            {label}
          </span>
          {/* Same split-transform reasoning as the card itself: the
              hover pop lives on this wrapping span so it doesn't fight
              the icon's own continuous stat-icon-motion animation. */}
          <span className="inline-block transition-transform duration-300 group-hover:scale-110">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`stat-icon-motion shrink-0 ${meta.text}`}
              style={{ animationDelay: `${index * 150}ms` }}
              aria-hidden="true"
            >
              {STAT_ICONS[status]}
            </svg>
          </span>
        </div>
        <RollingNumber
          value={count}
          startDelayMs={index * 100}
          className="text-display-md text-ink"
        />
      </div>
    </div>
  );
}

// Replaces trust-points (see design.md) — real counts pulled live from
// ClinicalTrials.gov's /studies?countTotal=true (lib/clients/ctgovStats.ts,
// server-fetched with a 1hr revalidate and passed in as props here).
// Fixed 2x2 grid at every viewport, per design.md.
export default function LiveTrialStats({ counts }: { counts: StatusCount[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-body-sm text-muted">Registered on ClinicalTrials.gov right now:</p>
      <div className="grid grid-cols-2 gap-3">
        {counts.map((c, i) => (
          <StatCard key={c.status} index={i} {...c} />
        ))}
      </div>
    </div>
  );
}
