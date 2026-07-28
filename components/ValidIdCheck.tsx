// Replaces the magnifying-glass submit button on both `analyze-bar-pill`
// and `nav-search` now that neither bar has a submit button at all — a
// valid NCT ID auto-navigates itself (see lib/hooks/useNctIdAutoSubmit.ts).
// Only ever rendered while status === "valid", so its mere presence is
// itself the "correctly entered" signal. Deliberately slow (600ms, vs.
// most other entrance pops in this app at ~300-500ms) — it needs to
// visibly settle into place *before* the bar's 900ms auto-navigate
// delay elapses, so the sequence reads as "check appears, then jump"
// rather than both happening at once.
export default function ValidIdCheck({ size = 32 }: { size?: number }) {
  return (
    <span
      className="hero-card-in flex shrink-0 items-center justify-center rounded-full bg-success text-on-primary"
      style={{ width: size, height: size, animationDuration: "0.6s" }}
      aria-hidden="true"
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12.5 9.5 18 20 6" />
      </svg>
    </span>
  );
}
