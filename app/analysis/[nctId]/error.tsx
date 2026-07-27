"use client";

import UpstreamErrorState from "./components/UpstreamErrorState";

// Next.js error boundary for this route segment. Upstream/reasoning
// failures (Flow 4.5) are now caught and handled inside AnalysisView's
// own fetch state machine, not thrown — this boundary is a safety net
// for anything genuinely unexpected (a render exception, a bug), not the
// primary error path anymore.
export default function Error() {
  return (
    <main className="mx-auto max-w-content px-4 py-section">
      <UpstreamErrorState />
    </main>
  );
}
