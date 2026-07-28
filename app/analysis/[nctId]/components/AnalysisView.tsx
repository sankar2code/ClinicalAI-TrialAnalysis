"use client";

import { useEffect, useState } from "react";
import type { AnalyzeApiResponse, UpstreamSource } from "@/lib/schema/analysisResult";
import AnalysisProgress from "./AnalysisProgress";
import TrialStatusTag from "./TrialStatusTag";
import BottomLineCard from "./BottomLineCard";
import HypothesisCard from "./HypothesisCard";
import EvidenceRow from "./EvidenceRow";
import GuardrailBand from "./GuardrailBand";
import DisclaimerBand from "./DisclaimerBand";
import FeedbackFlagControl from "./FeedbackFlagControl";
import NotFoundState from "./NotFoundState";
import UpstreamErrorState from "./UpstreamErrorState";
import TrialSnapshotCard from "./TrialSnapshotCard";

type FetchState =
  | { phase: "loading" }
  | { phase: "error"; kind: "not_found" | "invalid_format" | "server"; source?: UpstreamSource }
  | { phase: "done"; result: Extract<AnalyzeApiResponse, { status: "analyzed" | "snapshot" }> };

// Fetches GET /api/analyze/[nctId] client-side (rather than the server
// component awaiting lib/pipeline/analyzeTrial.ts directly, as earlier)
// specifically so the page can render instantly and show real staged
// progress (AnalysisProgress) while the ~20-40s reasoning call is still
// in flight — a blocking server-side await has no way to surface that.
export default function AnalysisView({ nctId }: { nctId: string }) {
  const [state, setState] = useState<FetchState>({ phase: "loading" });

  useEffect(() => {
    // AbortController, not just a boolean flag: React 18 Strict Mode
    // double-invokes effects in dev (mount → cleanup → mount), and a
    // boolean guard only suppresses the *stale* request's state update —
    // it doesn't stop the request itself. That meant two real Anthropic
    // calls fired per page load, and whichever happened to resolve last
    // won, even if the first one had actually succeeded. Aborting the
    // first request on cleanup means exactly one reasoning call ever
    // completes per mount.
    const controller = new AbortController();

    fetch(`/api/analyze/${nctId}`, { signal: controller.signal })
      .then(async (res) => {
        const body = await res.json();

        if (!res.ok) {
          const kind =
            body.error === "trial_not_found"
              ? "not_found"
              : body.error === "invalid_format"
                ? "invalid_format"
                : "server";
          setState({ phase: "error", kind, source: body.source });
          return;
        }
        setState({ phase: "done", result: body });
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({ phase: "error", kind: "server" });
      });

    return () => {
      controller.abort();
    };
  }, [nctId]);

  if (state.phase === "loading") {
    return <AnalysisProgress />;
  }

  if (state.phase === "error") {
    if (state.kind === "not_found") {
      return (
        <main className="mx-auto max-w-content px-4 py-section">
          <NotFoundState nctId={nctId} />
        </main>
      );
    }
    if (state.kind === "invalid_format") {
      return (
        <main className="mx-auto max-w-content px-4 py-section">
          <NotFoundState
            nctId={nctId}
            message={`"${nctId}" isn't a valid NCT ID — the format is NCT followed by 8 digits (e.g. NCT04368728).`}
          />
        </main>
      );
    }
    return (
      <main className="mx-auto max-w-content px-4 py-section">
        <UpstreamErrorState source={state.source} />
      </main>
    );
  }

  const { result } = state;

  return (
    <main className="mx-auto flex max-w-content flex-col gap-section px-4 py-section">
      <header className="flex flex-col gap-2">
        <TrialStatusTag status={result.trial.overallStatus} />
        <h1 className="text-title-md text-muted">{result.trial.title}</h1>
        <p className="text-body-sm text-muted">{result.trial.nctId}</p>
      </header>

      {result.status === "snapshot" ? (
        <>
          <TrialSnapshotCard trial={result.trial} snapshot={result.snapshot} />
          <footer className="border-t border-hairline pt-6">
            <DisclaimerBand />
          </footer>
        </>
      ) : (
        <>
          <BottomLineCard text={result.bottomLine} />

          <section className="flex flex-col gap-4">
            <h2 className="text-display-md text-ink">Ranked Hypotheses</h2>
            <div className="flex flex-col gap-4">
              {result.hypotheses.map((h, i) => (
                <HypothesisCard key={i} hypothesis={h} />
              ))}
            </div>
          </section>

          {result.evidence.length > 0 && (
            <section className="flex flex-col gap-2">
              <h2 className="text-display-md text-ink">Evidence</h2>
              <ul className="rounded-md border border-hairline px-6">
                {result.evidence.map((item, i) => (
                  <EvidenceRow key={i} item={item} />
                ))}
              </ul>
            </section>
          )}

          <GuardrailBand text={result.guardrail} />

          <footer className="flex flex-col gap-4 border-t border-hairline pt-6">
            <FeedbackFlagControl nctId={result.trial.nctId} />
            <DisclaimerBand />
          </footer>
        </>
      )}
    </main>
  );
}
