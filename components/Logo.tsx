// The "Signal" mark — chosen from the logo exploration. Reuses the exact
// four-bar language of app/analysis/[nctId]/components/ConfidenceMeter.tsx:
// three ink bars ascending into one taller Rausch bar, the one hypothesis
// the tool actually leads with. Single source of truth for the mark —
// used in TopNav and app/icon.svg should stay in sync with this.
// Fills use the theme CSS vars (not raw hex) so the mark flips with dark
// mode instead of staying pinned to light-mode ink.
export default function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 44) / 48}
      viewBox="0 0 48 44"
      aria-hidden="true"
    >
      <rect x="3" y="27" width="8" height="14" rx="3" fill="var(--color-ink)" />
      <rect x="15" y="18" width="8" height="23" rx="3" fill="var(--color-ink)" />
      <rect x="27" y="9" width="8" height="32" rx="3" fill="var(--color-ink)" />
      <rect x="39" y="1" width="8" height="40" rx="3" fill="var(--color-primary)" />
    </svg>
  );
}
