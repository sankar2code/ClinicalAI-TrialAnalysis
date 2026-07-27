import type { EpistemicStatus } from "@/lib/schema/analysisResult";

const LABEL: Record<EpistemicStatus, string> = {
  fact: "Fact",
  inference: "Inference",
  hypothesis: "Hypothesis",
};

// design.md epistemic tags: certainty runs ink (filled) -> ink (outlined)
// -> muted (surface-soft), deliberately excluding Rausch and any
// red/yellow/green semantics. A Hypothesis tag should read as "less
// certain," never as "wrong."
//
// "fact" uses text-canvas, not text-on-primary: `ink` inverts between
// themes (near-black fill in light mode, near-white fill in dark mode)
// since it's the foreground/text token, so text sitting on a bg-ink fill
// needs to invert right along with it — `canvas` is the correct pairing
// in both directions. `on-primary` is fixed white for the Rausch button,
// which stays a vivid red in both themes; pairing it with bg-ink instead
// produced white-on-near-white in dark mode.
const VARIANT_CLASS: Record<EpistemicStatus, string> = {
  fact: "bg-ink text-canvas",
  inference: "border border-ink text-ink bg-transparent",
  hypothesis: "bg-surface-soft text-muted",
};

export default function EpistemicTag({ status }: { status: EpistemicStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-badge ${VARIANT_CLASS[status]}`}
    >
      {LABEL[status]}
    </span>
  );
}
