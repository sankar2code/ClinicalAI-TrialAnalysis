import Link from "next/link";

// Moved into TopNav (was page-scoped to the analysis results page only)
// so "back to home" is reachable from every page, not just deep results
// — the wordmark itself also links home, but at the far top-left, easy
// to miss once you're mid-scroll on a results page. Matches ThemeToggle's
// visual weight (44px circular, surface-strong) — both sized to the
// ~44px touch-target minimum (WCAG 2.5.5 AAA / Apple HIG), the app's
// only icon-only, no-label nav controls besides NavSearch's submit orb.
export default function HomeButton() {
  return (
    <Link
      href="/"
      aria-label="Back to home"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-strong text-ink no-underline"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" />
      </svg>
    </Link>
  );
}
