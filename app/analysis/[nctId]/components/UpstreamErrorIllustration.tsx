// The one deliberate illustration in an otherwise photo-free, icon-only
// app (design.md's stated "no photography anywhere" rule) — a scoped
// exception for this single error state, same spirit as HeroPreviewCard's
// exception to single-accent. A lab mouse (this app's own domain — trials
// run on lab studies) puzzling over a thought-bubble of a crossed-out
// signal, rather than a generic broken-robot/sad-cloud cliché.
// Monochrome ink/muted/canvas throughout, one spark of {colors.error} on
// the signal-slash — the only color, and it's the same red already used
// for every other failure state in this app, not a new one introduced here.
export default function UpstreamErrorIllustration() {
  return (
    <svg
      width="132"
      height="120"
      viewBox="0 0 132 120"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* thought bubble trail */}
      <circle cx="86" cy="70" r="3" fill="var(--color-muted-soft)" />
      <circle cx="93" cy="58" r="4.5" fill="var(--color-muted-soft)" />

      {/* thought bubble */}
      <ellipse cx="98" cy="30" rx="30" ry="24" fill="var(--color-canvas)" stroke="var(--color-hairline)" strokeWidth="1.5" />
      {/* lost-signal glyph, inside bubble: two signal arcs + dot, crossed out */}
      <circle cx="98" cy="38" r="2.2" fill="var(--color-muted)" />
      <path d="M91 32a10 10 0 0 1 14 0" stroke="var(--color-muted)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M85 25a19 19 0 0 1 26 0" stroke="var(--color-muted)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M84 20l28 24" stroke="var(--color-error)" strokeWidth="2.5" strokeLinecap="round" />

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

      {/* ears */}
      <circle cx="38" cy="52" r="13" fill="var(--color-surface-soft)" stroke="var(--color-ink)" strokeWidth="2" />
      <circle cx="70" cy="46" r="13" fill="var(--color-surface-soft)" stroke="var(--color-ink)" strokeWidth="2" />

      {/* head */}
      <circle cx="54" cy="62" r="22" fill="var(--color-surface-soft)" stroke="var(--color-ink)" strokeWidth="2" />

      {/* face — one eyebrow raised, for a puzzled look at the thought bubble */}
      <circle cx="47" cy="60" r="2.2" fill="var(--color-ink)" />
      <circle cx="61" cy="60" r="2.2" fill="var(--color-ink)" />
      <path d="M43 53q4-2 8 0" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M40 68q4 3 8 0M60 68q4 3 8 0" stroke="var(--color-muted)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <circle cx="54" cy="70" r="2.5" fill="var(--color-muted)" />
    </svg>
  );
}
