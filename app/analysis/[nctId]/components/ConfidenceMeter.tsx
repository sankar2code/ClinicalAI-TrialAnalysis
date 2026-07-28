import type { Confidence } from "@/lib/schema/analysisResult";

const LEVELS: { key: Confidence; label: string }[] = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
  { key: "very_high", label: "Very High" },
];

// A red→green ramp per level (bg-confidence-*/text-confidence-* —
// tailwind.config.ts). Deliberate, explicit reversal of this
// component's original design: design.md's Overview stated certainty
// stays on the ink/muted grayscale ramp specifically so a hypothesis's
// confidence never reads as an automatic "danger" or "good" signal.
// Colored on direct request — see design.md `confidence-meter` for the
// full note. Full literal class strings, not built from the level key —
// Tailwind's JIT scanner can't detect a dynamically-concatenated class.
const COLOR_CLASSES: Record<Confidence, { bar: string; text: string }> = {
  low: { bar: "bg-confidence-low", text: "text-confidence-low" },
  medium: { bar: "bg-confidence-medium", text: "text-confidence-medium" },
  high: { bar: "bg-confidence-high", text: "text-confidence-high" },
  very_high: { bar: "bg-confidence-very-high", text: "text-confidence-very-high" },
};

// design.md `confidence-meter`: compact repeatable 4-segment fill bar —
// the restrained, per-card substitute for the source system's one-time
// 64px rating-display.
export default function ConfidenceMeter({ level }: { level: Confidence }) {
  const activeIndex = LEVELS.findIndex((l) => l.key === level);
  const activeLabel = LEVELS[activeIndex]?.label ?? "Low";
  const colors = COLOR_CLASSES[level];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1" role="img" aria-label={`Confidence: ${activeLabel}`}>
        {LEVELS.map((l, i) => (
          <span
            key={l.key}
            className={`h-1.5 w-6 rounded-full ${i <= activeIndex ? colors.bar : "bg-hairline"}`}
          />
        ))}
      </div>
      <span className={`text-micro-label ${colors.text}`}>{activeLabel} confidence</span>
    </div>
  );
}
