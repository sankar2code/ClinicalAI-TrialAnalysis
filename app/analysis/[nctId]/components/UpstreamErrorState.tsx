"use client";

import type { UpstreamSource } from "@/lib/schema/analysisResult";
import UpstreamErrorIllustration from "./UpstreamErrorIllustration";

// engineering-doc.md Flow 4.5 — upstream API/LLM failure after one retry.
// Names the specific dependency that failed rather than a generic
// "something went wrong" — lib/errors.ts now tags which one it was.
// PubMed has no entry here on purpose: it degrades gracefully (empty
// publication list) rather than ever failing the request, so it can
// never be the reason this state is showing.
const COPY: Record<UpstreamSource, { title: string; body: string }> = {
  clinicaltrials_gov: {
    title: "ClinicalTrials.gov isn't responding",
    body: "This tool reads live from ClinicalTrials.gov's public registry, and it didn't answer in time. That's outside anything we can route around from here — try again in a moment.",
  },
  reasoning_service: {
    title: "The reasoning service is busy",
    body: "The trial record loaded fine, but the AI service that builds the ranked hypotheses isn't responding right now. Try again in a moment.",
  },
};

const FALLBACK = {
  title: "Something went wrong",
  body: "We couldn't complete this analysis. This is usually temporary — try again in a moment.",
};

export default function UpstreamErrorState({ source }: { source?: UpstreamSource }) {
  const { title, body } = source ? COPY[source] : FALLBACK;

  return (
    <div className="flex flex-col items-start gap-5 rounded-md border border-hairline p-8 sm:flex-row sm:items-center sm:gap-6">
      <UpstreamErrorIllustration />
      <div className="flex flex-col gap-3">
        <h1 className="text-display-md text-error">{title}</h1>
        <p className="text-body-md text-body">{body}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-fit rounded-sm border border-ink px-4 py-3 text-button-sm text-ink"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
