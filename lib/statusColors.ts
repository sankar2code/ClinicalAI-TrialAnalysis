// Single source of truth for the 4 status colors introduced in
// LiveTrialStats (components/LiveTrialStats.tsx) — reused by
// TrialStatusTag and the homepage's example links so a given status
// (Terminated/Completed/Recruiting/Active) always reads as the same
// color everywhere it appears. See globals.css `--color-stat-*` and
// design.md's "second scoped exception" to the single-accent rule.
// Statuses outside this set (WITHDRAWN, SUSPENDED, etc.) have no entry —
// callers fall back to the plain ink/muted treatment.
export const STATUS_COLOR_META: Record<
  string,
  { text: string; border: string; bg: string }
> = {
  TERMINATED: {
    text: "text-stat-terminated-accent",
    border: "border-stat-terminated-accent",
    bg: "bg-stat-terminated-bg",
  },
  COMPLETED: {
    text: "text-stat-completed-accent",
    border: "border-stat-completed-accent",
    bg: "bg-stat-completed-bg",
  },
  RECRUITING: {
    text: "text-stat-recruiting-accent",
    border: "border-stat-recruiting-accent",
    bg: "bg-stat-recruiting-bg",
  },
  ACTIVE_NOT_RECRUITING: {
    text: "text-stat-active-accent",
    border: "border-stat-active-accent",
    bg: "bg-stat-active-bg",
  },
};
