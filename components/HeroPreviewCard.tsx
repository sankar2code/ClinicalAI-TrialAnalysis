import HypothesisCard from "@/app/analysis/[nctId]/components/HypothesisCard";
import type { Hypothesis } from "@/lib/schema/analysisResult";

// Fills the hero's empty space with the actual product instead of a stock
// photo — this app has no photography anywhere by design (a
// reasoning tool, not a marketplace), so a literal picture would clash.
// The front card reuses the real HypothesisCard component with
// representative sample content, guaranteeing pixel-perfect consistency
// with what a real result looks like. The two cards behind it are
// decorative-only (see globals.css --color-hero-tint-a/b) — a genuine,
// scoped exception to this app's single-accent rule, made specifically
// because this is one aria-hidden landing-page graphic, not the real
// product UI where the epistemic-labeling restraint actually matters.
// It's also representationally honest: a real analysis really does
// return a stack of multiple ranked hypotheses, not just one.
//
// Each layer is two nested elements, not one: an outer div carries the
// entrance animation (globals.css .hero-card-in, opacity + translateY),
// an inner div carries the resting rotation + hover fan-out. Both are
// `transform`, and a CSS @keyframes animation's `to` state permanently
// overrides any other transform on the *same* element once
// animation-fill-mode holds it there — splitting them across two
// elements is what lets the entrance play once while the rotation still
// applies afterward, instead of the keyframe silently winning forever.
const SAMPLE_HYPOTHESIS: Hypothesis = {
  category: "recruitment",
  label: "Recruitment Shortfall",
  confidence: "very_high",
  evidenceFor: [
    {
      claim: "Actual enrollment was 34 of 280 planned participants.",
      epistemicStatus: "fact",
      sourceUrl: "#",
    },
    {
      claim: "A shortfall this severe was very likely the direct cause of termination.",
      epistemicStatus: "inference",
      sourceUrl: "#",
    },
  ],
  strongestCounterArgument:
    "The record doesn't disclose the original target, so the exact size of the shortfall can't be confirmed.",
};

const BACK_CARDS = [
  {
    label: "Safety / Toxicity",
    confidence: "Low confidence",
    bg: "bg-hero-tint-b",
    rest: "-rotate-[8deg]",
    hover: "group-hover:-rotate-[13deg] group-hover:-translate-x-3 group-hover:translate-y-1",
    delay: "0ms",
  },
  {
    label: "Efficacy Miss",
    confidence: "Low confidence",
    bg: "bg-hero-tint-a",
    rest: "rotate-[5deg]",
    hover: "group-hover:rotate-[9deg] group-hover:translate-x-3",
    delay: "100ms",
  },
];

export default function HeroPreviewCard() {
  return (
    <div
      aria-hidden="true"
      className="group hidden w-[320px] shrink-0 lg:block"
    >
      <div className="relative">
        {BACK_CARDS.map((card) => (
          <div
            key={card.label}
            className="hero-card-in absolute inset-0"
            style={{ animationDelay: card.delay }}
          >
            <div
              className={`flex h-full flex-col gap-2 rounded-md p-6 shadow-card transition-transform duration-300 ease-out ${card.bg} ${card.rest} ${card.hover}`}
            >
              <span className="text-display-sm text-ink">{card.label}</span>
              <span className="text-micro-label text-muted">{card.confidence}</span>
            </div>
          </div>
        ))}

        <div className="hero-card-in relative" style={{ animationDelay: "200ms" }}>
          <div className="rotate-2 shadow-card transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:-translate-y-2">
            <HypothesisCard hypothesis={SAMPLE_HYPOTHESIS} />
          </div>
        </div>
      </div>
    </div>
  );
}
