"use client";

import { useEffect, useState } from "react";
import AnalysisStageIcon from "./AnalysisStageIcon";

const STAGES = [
  "Fetching the trial record from ClinicalTrials.gov…",
  "Resolving linked research on PubMed…",
  "Reasoning through the evidence — this can take up to 30 seconds for terminated trials…",
];

// Timed guesses, not real server-pushed progress — the underlying pipeline
// (lib/pipeline/analyzeTrial.ts) doesn't stream intermediate state, and
// the Anthropic call that dominates wall-clock time is a single
// non-streaming request with no sub-stage signal to report. Advancing on
// a timer still tells the truth about what's *generally* happening and
// in what order; if the real fetch resolves early (e.g. a
// completed/recruiting trial, which skips the reasoning pass entirely),
// AnalysisView swaps in the result immediately regardless of which
// message is currently showing — this never blocks on the timer.
function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`rounded-md bg-surface-soft ${className}`} />;
}

export default function AnalysisProgress() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStageIndex(1), 1800),
      setTimeout(() => setStageIndex(2), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <main className="mx-auto flex max-w-content flex-col gap-8 px-4 py-section">
      <div
        className="flex flex-col items-center gap-5 py-6 text-center"
        role="status"
        aria-live="polite"
      >
        <AnalysisStageIcon stageIndex={stageIndex} size={44} />
        <p className="max-w-[420px] text-body-md text-body">{STAGES[stageIndex]}</p>
      </div>

      <div className="flex flex-col gap-6">
        <SkeletonBlock className="h-8 w-2/3" />
        <SkeletonBlock className="h-32 w-full" />
        <div className="flex flex-col gap-4">
          <SkeletonBlock className="h-40 w-full" />
          <SkeletonBlock className="h-40 w-full" />
        </div>
        <SkeletonBlock className="h-24 w-full" />
        <SkeletonBlock className="h-20 w-full" />
      </div>
    </main>
  );
}
