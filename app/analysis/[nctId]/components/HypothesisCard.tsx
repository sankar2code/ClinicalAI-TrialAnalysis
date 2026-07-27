import type { Hypothesis } from "@/lib/schema/analysisResult";
import ConfidenceMeter from "./ConfidenceMeter";
import EpistemicTag from "./EpistemicTag";

// design.md `hypothesis-card`: text-first equivalent of the source
// system's photo-first property-card. 1px hairline border + rounded-md
// (replacing the photo-edge the source relied on). Counter-argument is
// always present, never optional, in a distinguished surface-soft block.
export default function HypothesisCard({ hypothesis }: { hypothesis: Hypothesis }) {
  return (
    <article className="rounded-md border border-hairline bg-canvas p-6 transition-shadow hover:shadow-card">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-display-sm text-ink">{hypothesis.label}</h3>
        <ConfidenceMeter level={hypothesis.confidence} />
      </header>

      <h4 className="mb-2 text-caption uppercase tracking-wide text-muted">
        Evidence for
      </h4>
      <ul className="mb-4 flex flex-col gap-2">
        {hypothesis.evidenceFor.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <EpistemicTag status={item.epistemicStatus} />
            <span className="text-body-md text-body">{item.claim}</span>
          </li>
        ))}
      </ul>

      <div className="rounded-sm bg-surface-soft p-4">
        <h4 className="mb-1 text-caption uppercase tracking-wide text-muted">
          Strongest counter-argument
        </h4>
        <p className="text-body-md text-body">{hypothesis.strongestCounterArgument}</p>
      </div>
    </article>
  );
}
