const STEPS = [
  {
    title: "Paste a trial ID",
    body: "Every clinical trial has a public ID, like NCT04368728. Paste it in and hit go — nothing else to fill in.",
    icon: (
      <path d="M9 3h6l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M9 9h6 M9 13h6 M9 17h3" />
    ),
  },
  {
    title: "We pull the public record",
    body: "We fetch everything ClinicalTrials.gov and PubMed have published about that trial. No login, no paywall — it's all public data.",
    icon: (
      <path d="M4 6a8 3 0 0 0 16 0 M4 6a8 3 0 0 1 16 0v12a8 3 0 0 1-16 0z M4 12a8 3 0 0 0 16 0" />
    ),
  },
  {
    title: "We check whether there's a failure to explain",
    body: "If the trial was terminated, withdrawn, or suspended, an AI reasons through the evidence for why. If it completed or is still running, there's nothing to explain — so it skips straight to the facts.",
    icon: <path d="M12 3v5 M12 8 7 14 M12 8 17 14 M7 14v4 M17 14v4" />,
  },
  {
    title: "You get the right kind of answer",
    body: "Terminated trials get ranked hypotheses, with every claim tagged Fact, Inference, or Hypothesis. Every other trial gets a clean snapshot instead — results, enrollment, sites, and publications, no guessing where none is needed.",
    icon: <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z M8.5 12l2.5 2.5 4.5-5" />,
  },
];

// Plain-language walkthrough of the actual pipeline, covering both
// branches of lib/pipeline/analyzeTrial.ts: the AI failure-reasoning pass
// for TERMINATED/WITHDRAWN/SUSPENDED trials, and the fact-only
// TrialSnapshot for everything else. Replaces the top-nav "how this
// works" link — the explanation now lives right where someone would want
// it, below the input. Single-column, consistent with this app's stated
// layout principle of never adopting a grid.
export default function HowItWorksSteps() {
  return (
    <section aria-labelledby="how-it-works-heading" className="flex w-full max-w-content flex-col gap-8">
      <h2 id="how-it-works-heading" className="text-display-md text-ink">
        How it works
      </h2>
      <ol className="flex flex-col gap-8">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex items-start gap-5">
            <div className="flex flex-col items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline text-title-sm text-ink">
                {i + 1}
              </span>
              {i < STEPS.length - 1 && (
                <span className="h-full w-px flex-1 bg-hairline" aria-hidden="true" />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 pb-2">
              <div className="flex items-center gap-2.5">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-muted"
                  aria-hidden="true"
                >
                  {step.icon}
                </svg>
                <h3 className="text-title-md text-ink">{step.title}</h3>
              </div>
              <p className="text-body-sm text-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
