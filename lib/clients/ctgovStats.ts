// ClinicalTrials.gov v2 API client for homepage status counts — separate
// from ctgov.ts's single-study fetchStudy, since this hits /studies with
// filter.overallStatus + countTotal=true rather than /studies/{nctId}.
// fields=NCTId keeps the response to just the total, not full records.
const CTGOV_BASE = "https://clinicaltrials.gov/api/v2";

export interface StatusCount {
  status: string;
  label: string;
  count: number;
}

const STATUS_LABELS: { status: string; label: string }[] = [
  { status: "TERMINATED", label: "Terminated" },
  { status: "COMPLETED", label: "Completed" },
  { status: "RECRUITING", label: "Recruiting" },
  { status: "ACTIVE_NOT_RECRUITING", label: "Active" },
];

async function fetchCount(status: string): Promise<number> {
  const url = `${CTGOV_BASE}/studies?filter.overallStatus=${status}&pageSize=1&countTotal=true&fields=NCTId`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`ClinicalTrials.gov returned ${res.status} for ${status}`);
  const data = await res.json();
  if (typeof data.totalCount !== "number") throw new Error(`No totalCount for ${status}`);
  return data.totalCount;
}

// Fails closed: if any status count can't be fetched, returns null so the
// homepage can skip the whole section rather than show 3 real numbers
// next to a missing or stale fourth one.
export async function fetchStatusCounts(): Promise<StatusCount[] | null> {
  try {
    const counts = await Promise.all(STATUS_LABELS.map((s) => fetchCount(s.status)));
    return STATUS_LABELS.map((s, i) => ({ ...s, count: counts[i] }));
  } catch {
    return null;
  }
}
