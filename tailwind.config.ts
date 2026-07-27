import type { Config } from "tailwindcss";

// Token values sourced directly from design.md — do not hand-tune a hex
// or size here without updating design.md first; that file is the
// single source of truth for this app's visual system. Colors resolve
// through CSS custom properties (app/globals.css) so the same token
// names (bg-canvas, text-ink, etc.) work in both light and dark mode —
// see globals.css for the actual light/dark hex values.
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // lib/statusColors.ts holds literal Tailwind class strings
    // (STATUS_COLOR_META) shared across components — must be scanned too,
    // or those classes get purged from the production build.
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        ink: "var(--color-ink)",
        body: "var(--color-body)",
        muted: "var(--color-muted)",
        "muted-soft": "var(--color-muted-soft)",
        primary: {
          DEFAULT: "var(--color-primary)", // Rausch — action-only, never used for status/labeling
          active: "var(--color-primary-active)",
          disabled: "var(--color-primary-disabled)",
        },
        "on-primary": "var(--color-on-primary)",
        surface: {
          soft: "var(--color-surface-soft)",
          strong: "var(--color-surface-strong)",
        },
        hairline: {
          DEFAULT: "var(--color-hairline)",
          soft: "var(--color-hairline-soft)",
        },
        "border-strong": "var(--color-border-strong)",
        error: {
          DEFAULT: "var(--color-error)",
          hover: "var(--color-error-hover)",
        },
        // Real-time valid-NCT-ID feedback on analyze-bar-pill/nav-search
        // only — the green/amber mirrors of `error`. See globals.css.
        success: "var(--color-success)",
        pending: "var(--color-pending)",
        "legal-link": "var(--color-legal-link)",
        // Decorative-only — HeroPreviewCard's stacked back-cards. Not
        // part of the core single-accent system; see globals.css.
        "hero-tint-a": "var(--color-hero-tint-a)",
        "hero-tint-b": "var(--color-hero-tint-b)",
        // LiveTrialStats' 4 status cards only — second scoped exception
        // to single-accent; see globals.css.
        stat: {
          terminated: {
            bg: "var(--color-stat-terminated-bg)",
            accent: "var(--color-stat-terminated-accent)",
          },
          completed: {
            bg: "var(--color-stat-completed-bg)",
            accent: "var(--color-stat-completed-accent)",
          },
          recruiting: {
            bg: "var(--color-stat-recruiting-bg)",
            accent: "var(--color-stat-recruiting-accent)",
          },
          active: {
            bg: "var(--color-stat-active-bg)",
            accent: "var(--color-stat-active-accent)",
          },
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-xl": ["1.75rem", { lineHeight: "1.43", fontWeight: "700" }], // 28px/700
        "display-lg": [
          "1.375rem",
          { lineHeight: "1.18", letterSpacing: "-0.02em", fontWeight: "500" },
        ], // 22px/500
        "display-md": ["1.3125rem", { lineHeight: "1.43", fontWeight: "700" }], // 21px/700
        "display-sm": [
          "1.25rem",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" },
        ], // 20px/600
        "title-md": ["1rem", { lineHeight: "1.25", fontWeight: "600" }],
        "title-sm": ["1rem", { lineHeight: "1.25", fontWeight: "500" }],
        "body-md": ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.43", fontWeight: "400" }],
        caption: ["0.875rem", { lineHeight: "1.29", fontWeight: "500" }],
        "caption-sm": ["0.8125rem", { lineHeight: "1.23", fontWeight: "400" }],
        badge: ["0.6875rem", { lineHeight: "1.18", fontWeight: "600" }],
        "micro-label": ["0.75rem", { lineHeight: "1.33", fontWeight: "700" }],
        "uppercase-tag": [
          "0.5rem",
          { lineHeight: "1.25", letterSpacing: "0.02em", fontWeight: "700" },
        ],
        "button-md": ["1rem", { lineHeight: "1.25", fontWeight: "500" }],
        "button-sm": ["0.875rem", { lineHeight: "1.29", fontWeight: "500" }],
        link: ["0.875rem", { lineHeight: "1.43", fontWeight: "400" }],
        "nav-link": ["1rem", { lineHeight: "1.25", fontWeight: "600" }],
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        xl: "32px",
      },
      spacing: {
        section: "4rem", // 64px
      },
      boxShadow: {
        // The system's single elevation tier — see design.md "Elevation".
        // Value itself is a CSS var since the light-mode rgba(0,0,0,...)
        // stack reads as invisible on a dark canvas.
        card: "var(--shadow-card)",
      },
      maxWidth: {
        content: "840px", // this app's single-column content cap, per design.md Layout
      },
    },
  },
  plugins: [],
};

export default config;
