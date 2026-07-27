import type { Confidence } from "@/lib/schema/analysisResult";

const LEVELS: { key: Confidence; label: string }[] = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
  { key: "very_high", label: "Very High" },
];

// design.md `confidence-meter`: compact repeatable 4-segment ink-fill bar —
// the restrained, per-card substitute for the source system's one-time
// 64px rating-display. Never Rausch; this is a trust signal, not a CTA.
export default function ConfidenceMeter({ level }: { level: Confidence }) {
  const activeIndex = LEVELS.findIndex((l) => l.key === level);
  const activeLabel = LEVELS[activeIndex]?.label ?? "Low";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1" role="img" aria-label={`Confidence: ${activeLabel}`}>
        {LEVELS.map((l, i) => (
          <span
            key={l.key}
            className={`h-1.5 w-6 rounded-full ${i <= activeIndex ? "bg-ink" : "bg-hairline"}`}
          />
        ))}
      </div>
      <span className="text-micro-label text-muted">{activeLabel} confidence</span>
    </div>
  );
}
