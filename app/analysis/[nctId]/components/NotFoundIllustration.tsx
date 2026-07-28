// Companion to {component.upstream-error-illustration} — same lab-mouse
// mascot (design.md's scoped illustration exception), different pose:
// this is "searched and came up empty," not "couldn't reach the server,"
// so the mouse shrugs at a blank record card instead of puzzling over a
// dead signal. Monochrome ink/muted/canvas, no new colors.
export default function NotFoundIllustration() {
  return (
    <svg
      width="132"
      height="120"
      viewBox="0 0 132 120"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* blank record card, empty search result */}
      <rect
        x="82"
        y="14"
        width="38"
        height="48"
        rx="4"
        fill="var(--color-canvas)"
        stroke="var(--color-hairline)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <path d="M90 27h22M90 35h22M90 43h14" stroke="var(--color-hairline)" strokeWidth="1.5" strokeLinecap="round" />

      {/* tail */}
      <path d="M40 96c-10 4-14 -4 -10 -10" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* body */}
      <ellipse cx="60" cy="88" rx="30" ry="26" fill="var(--color-surface-soft)" stroke="var(--color-ink)" strokeWidth="2" />

      {/* lab coat */}
      <path
        d="M35 92c0-9 11-15 25-15s25 6 25 15v14a4 4 0 0 1-4 4H39a4 4 0 0 1-4-4z"
        fill="var(--color-canvas)"
        stroke="var(--color-ink)"
        strokeWidth="2"
      />
      <path d="M60 77v33M52 82l8 6 8-6" stroke="var(--color-hairline)" strokeWidth="1.5" fill="none" />
      <circle cx="60" cy="98" r="1.6" fill="var(--color-muted)" />

      {/* shrugging arms — both raised out to the sides, palms up */}
      <path d="M35 88Q20 82 22 68" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="22" cy="66" r="5.5" fill="var(--color-surface-soft)" stroke="var(--color-ink)" strokeWidth="2" />
      <path d="M85 88Q100 82 98 68" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="98" cy="66" r="5.5" fill="var(--color-surface-soft)" stroke="var(--color-ink)" strokeWidth="2" />

      {/* ears */}
      <circle cx="38" cy="52" r="13" fill="var(--color-surface-soft)" stroke="var(--color-ink)" strokeWidth="2" />
      <circle cx="70" cy="46" r="13" fill="var(--color-surface-soft)" stroke="var(--color-ink)" strokeWidth="2" />

      {/* head */}
      <circle cx="54" cy="62" r="22" fill="var(--color-surface-soft)" stroke="var(--color-ink)" strokeWidth="2" />

      {/* face — flat, apologetic mouth (shrug expression) */}
      <circle cx="47" cy="60" r="2.2" fill="var(--color-ink)" />
      <circle cx="61" cy="60" r="2.2" fill="var(--color-ink)" />
      <path d="M43 53q4-2 8 0M63 53q-4-2-8 0" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M45 69h18" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="54" cy="72" r="2.5" fill="var(--color-muted)" />
    </svg>
  );
}
