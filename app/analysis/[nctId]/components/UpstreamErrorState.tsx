"use client";

// engineering-doc.md Flow 4.5 — upstream API/LLM failure after one retry.
// Uses {colors.error}, deliberately distinct from Rausch, so a failure
// never reads as a brand moment.
export default function UpstreamErrorState() {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-hairline p-8">
      <h1 className="text-display-md text-error">Something went wrong</h1>
      <p className="text-body-md text-body">
        We couldn&apos;t complete this analysis. This is usually temporary —
        try again in a moment.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="w-fit rounded-sm border border-ink px-4 py-3 text-button-sm text-ink"
      >
        Try again
      </button>
    </div>
  );
}
