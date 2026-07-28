## Overview

*Adapted from Airbnb's design system for ClinicalAI-Trial Analysis. All color, type, spacing, and elevation tokens are carried over unchanged — this is the same visual DNA. The component library is rebuilt for this app's actual screens (a single NCT ID input, four labeled result blocks, source citations) since there's no marketplace, no listings, and no accounts here. Luxe/Plus sub-brand tokens and the three-product nav are dropped entirely — they have no equivalent in a single-product tool.*

The base canvas is **pure white** (`{colors.canvas}` — #ffffff) with deep near-black ink (`{colors.ink}` — #222222) for headlines and body, and a single voltage of **Rausch** (`{colors.primary}` — #ff385c) carrying the wordmark's logo mark (`components/Logo.tsx`) and the `analyze-bar-pill`/`nav-search` input focus ring. Rausch is reserved for the brand mark and interaction only — it never encodes meaning about the analysis itself. This matters more here than it did for a booking flow: Fact/Inference/Hypothesis certainty and trial status are communicated through the ink→muted grayscale ramp, not colored red/yellow/green, so nothing reads as an automatic "danger" or "good" signal. The system's actual semantic red (`{colors.error}` — #c13515), its green counterpart (`{colors.success}` — #15803d), and a yellow third state (`{colors.pending}` — #eab308) — all three added for `analyze-bar-pill`/`nav-search`'s real-time validation only — stay reserved for that one job — form validity — and are intentionally distinct in hue from Rausch so none of them ever looks like a brand moment. *(The Analyze CTA / `analyze-orb` button described in earlier revisions of this doc no longer exists — see `analyze-bar-pill` below for why.)*

Type runs **Airbnb Cereal VF**, with **Circular** as the historic fallback and a system stack underneath. Cereal sits at modest weights — this suits the product well, since the credibility here comes from careful, plainly-stated language (the Bottom Line, the Guardrail) rather than typographic shouting. The one place the system goes loud in the source material — the 64px/700 rating number — has no natural home here; see Components for how that treatment is deliberately *not* reused per-card.

The shape language stays **soft**: 8px buttons, 14px cards, fully pill-shaped input, circular icon buttons. Because result cards in this app have no photo to imply an edge, they pick up a 1px hairline border they didn't need in the source system — the one structural addition the shape language required.

**Key Characteristics (adapted):**
- Single accent color: `{colors.primary}` (#ff385c) carries only the wordmark logo mark and the search bars' focus ring — nowhere else. Every other page element stays ink/muted/white.
- Custom variable type: `Airbnb Cereal VF`, unchanged from source.
- Simplified top nav: wordmark left, a single "How this works" methodology link right. No product tabs, no account menu — this app is stateless with one function.
- Pill-shaped single-field input: white surface, fully rounded (`{rounded.full}`), one segment ("NCT ID") — the search-bar-pill pattern collapsed from three segments to one, and friction-less besides: no submit button at all, since a value matching NCT + 8 digits auto-navigates itself (see `{component.analyze-bar-pill}`).
- Result cards are text-first, not photo-first: hairline-bordered rectangles with `{rounded.md}` corners, a confidence meter instead of a hero image, and an epistemic tag instead of a floating badge.
- The Bottom Line and Guardrail blocks are new, unique to this product — there's no Airbnb equivalent for "the one paragraph everyone must read" or "the persistent disclosure band."
- Elevation still caps at one shadow tier, applied even more sparingly than in the source system: only the input bar at rest and the hover-floated hypothesis card use it. The Guardrail band is deliberately flat — a shadow would make it look like a decorative surface rather than a mandatory disclosure.
- 8px base spacing system, unchanged. Section spacing stays at 64px between the input, Bottom Line, Hypotheses, Evidence, and Guardrail bands — this app has far fewer cards per scroll than a marketplace grid, so the generous spacing works better here than it did in the source context.

## Colors

*Unchanged from source — full token set carried over. Usage notes below are updated for this app; hex values are identical.*

### Brand & Accent
- **Rausch** (`{colors.primary}` — #ff385c): The single brand color. In this app: the wordmark logo mark's one accent bar, plus the `analyze-bar-pill`/`nav-search` input focus ring. Not used for status, confidence, or epistemic labeling.
- **Rausch Active** (`{colors.primary-active}` — #e00b41) / **Rausch Disabled** (`{colors.primary-disabled}` — #ffd1da): Originally the Analyze button's press/disabled states. That button (`analyze-orb`) was retired when both search bars went friction-less (see `{component.analyze-bar-pill}`) — these two tokens are currently unused, kept defined rather than deleted in case a future primary action needs them.
- **Luxe Purple / Plus Magenta:** *Dropped.* No sub-brand contexts exist in this app.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): Page floor. No dark mode.
- **Surface Soft** (`{colors.surface-soft}` — #f7f7f7): Guardrail band fill, counter-argument sub-block fill inside hypothesis cards, skeleton-loading placeholders, `tag-hypothesis` pill fill.
- **Surface Strong** (`{colors.surface-strong}` — #f2f2f2): Circular icon-button surfaces (source-link icon, copy-link icon).

### Hairlines & Borders
- **Hairline** (`{colors.hairline}` — #dddddd): Card borders (replacing the photo-edge Airbnb relied on), input bar border, evidence-row dividers, footer divider.
- **Hairline Soft** (`{colors.hairline-soft}` — #ebebeb): Divider between stacked hypothesis cards.
- **Border Strong** (`{colors.border-strong}` — #c1c1c1): Disabled input outline, focus-adjacent states.

### Text
- **Ink** (`{colors.ink}` — #222222): Bottom Line text, headlines, `tag-fact` fill/`tag-inference` text, primary nav.
- **Body** (`{colors.body}` — #3f3f3f): Evidence claim text, hypothesis counter-argument copy.
- **Muted** (`{colors.muted}` — #6a6a6a): `tag-hypothesis` text, source metadata (publication date, journal), inactive states.
- **Muted Soft** (`{colors.muted-soft}` — #929292): Disabled states.
- **On Primary** (`{colors.on-primary}` — #ffffff): White check glyph on `{component.valid-id-check}`'s green badge (its only current use — see Semantic below).

### Semantic
- **Error** (`{colors.error}` — #c13515): Malformed/incomplete NCT ID in `analyze-bar-pill`/`nav-search`, "trial not found," failed analysis retry state. Deliberately distinct from Rausch.
- **Error Hover** (`{colors.error-hover}` — #b32505): Error-state link hover (e.g., "try again").
- **Success** (`{colors.success}` — #15803d): Added for real-time NCT ID validation only — `analyze-bar-pill`/`nav-search`'s border and `{component.valid-id-check}`'s badge fill once the typed value fully matches NCT + 8 digits. Same green hue as `live-trial-stats`' `stat-completed-accent`, for consistency across the app's (still very limited) use of green. Not used anywhere certainty, confidence, or trial status is communicated — that stays strictly ink/muted.
- **Pending** (`{colors.pending}` — #eab308): The third border state on the same two bars — value is a valid, in-progress *prefix* of the pattern ("NCT042…"), not yet complete. A clean yellow, not an amber/gold, so it reads unambiguously as "yellow" — and still stays distinct from `stat-active-accent`'s more orange-leaning amber (a trial-status color) so a "still typing" form state and an "Active" trial status never read as the same thing.
- **Legal Link Blue** (`{colors.legal-link}` — #428bff): Reserved for the disclaimer band's link to the methodology page, if one is added.

### Scrim
- **Scrim** (`{colors.scrim}` — #000000 at 50% opacity): Backdrop for any modal (e.g., an "About this analysis" info dialog, if added later). Not used at MVP — this app has no date pickers or login flows.

## Typography

*Font stack and full scale unchanged. `Use` column remapped to this app's actual content.*

### Font Family
`Airbnb Cereal VF`, fallback `Circular, -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif`. If unavailable, substitute **Inter** (closest open-source match; tighten display line-heights ~2%).

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use in this app |
|---|---|---|---|---|---|
| `{typography.rating-display}` | 64px | 700 | 1.1 | -1px | *Reserved, not used per-card.* Only candidate: a single top-level "Primary Hypothesis Confidence" figure if the product later wants one hero number — never repeated per hypothesis. |
| `{typography.display-xl}` | 28px | 700 | 1.43 | 0 | App hero h1 ("Understand why a clinical trial failed") on the landing/input screen |
| `{typography.display-lg}` | 22px | 500 | 1.18 | -0.44px | Bottom Line headline text — this app's single loudest reading moment |
| `{typography.display-md}` | 21px | 700 | 1.43 | 0 | Section heads: "Ranked Hypotheses", "Evidence", "Guardrail" |
| `{typography.display-sm}` | 20px | 600 | 1.20 | -0.18px | Individual hypothesis card title (e.g., "Recruitment Shortfall") |
| `{typography.title-md}` | 16px | 600 | 1.25 | 0 | Evidence claim titles, trial title on the results header |
| `{typography.title-sm}` | 16px | 500 | 1.25 | 0 | Footer link labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Hypothesis counter-argument copy, evidence claim body text |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Source metadata (journal, date), confidence-meter caption |
| `{typography.caption}` | 14px | 500 | 1.29 | 0 | Input field label ("NCT ID") |
| `{typography.caption-sm}` | 13px | 400 | 1.23 | 0 | Disclaimer band text |
| `{typography.badge}` | 11px | 600 | 1.18 | 0 | `tag-fact` / `tag-inference` / `tag-hypothesis` pill text |
| `{typography.micro-label}` | 12px | 700 | 1.33 | 0 | Confidence-meter segment labels (Low / Medium / High) |
| `{typography.uppercase-tag}` | 8px | 700 | 1.25 | 0.32px (uppercase) | `trial-status-tag` ("TERMINATED", "WITHDRAWN", "SUSPENDED") next to the trial title — repurposed from the source system's "NEW" product badge |
| `{typography.button-md}` | 16px | 500 | 1.25 | 0 | "Analyze" CTA label |
| `{typography.button-sm}` | 14px | 500 | 1.29 | 0 | "View Source" / "Copy link" pill buttons |
| `{typography.link}` | 14px | 400 | 1.43 | 0 | Inline source citation links |
| `{typography.nav-link}` | 16px | 600 | 1.25 | 0 | "How this works" nav link |

### Principles
Display weight stays modest everywhere except the Bottom Line, which gets `display-lg` (22px/500) — quiet by financial-dashboard standards, but this app's "loud moment" should read as a careful analyst's conclusion, not a marketing headline. The 64px rating-display treatment is deliberately *not* reused for per-hypothesis confidence — repeating a hero-scale number 3–5 times per page (once per hypothesis) would both violate the source system's "used sparingly" principle and, worse, make every hypothesis look equally authoritative regardless of actual confidence.

## Layout

*Spacing tokens, base unit, and section rhythm unchanged from source.*

### Spacing System
- **Base unit:** 4px (2px micro-step). Same tokens: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.base}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 64px.
- **Section padding (vertical):** `{spacing.section}` (64px) between the input band, Bottom Line, Hypotheses list, Evidence list, and Guardrail — this app has far fewer repeating elements than a marketplace grid, so generous section spacing reads as deliberate rather than sparse.
- **Card internal padding:** `{spacing.lg}` (24px) for `{component.hypothesis-card}` and `{component.bottom-line-card}`; `{spacing.base}` (16px) for `{component.evidence-row}`; `{spacing.sm}` (8px) for the confidence-meter caption gutter.
- **Gutters:** `{spacing.base}` (16px) between stacked hypothesis cards; `{spacing.lg}` (24px) inside the simplified footer.

### Grid & Container
- **Max content width:** ~840px centered — narrower than the source system's 1280px/1080px, because this app is a single reading column (input → Bottom Line → Hypotheses → Evidence → Guardrail), not a multi-column marketplace layout.
- **Results page:** single-column stack. No sticky right-rail (there's no reservation-card equivalent — nothing here needs to stay pinned while the user scrolls).
- **Footer:** single row of links, not the source system's 3-column Support/Hosting/Airbnb layout — this app has one function, not three product lines.

### Whitespace Philosophy
The source system contrasts an open 64px hero against a dense 16px card grid. This app keeps the 64px section rhythm but drops the dense-grid half entirely — hypothesis cards get full-width breathing room (16px between cards, not a packed grid), because the product's credibility depends on each hypothesis being read carefully, not scanned quickly like a row of listings.

## Elevation

*Same single-shadow-tier system, applied even more sparingly.*

- **Flat (no shadow):** Body, Bottom Line block, Guardrail band, footer — the large majority of the page. The Guardrail is deliberately flat: a shadow would make a mandatory disclosure look like an optional decorative card.
- **One shadow tier:** `box-shadow: rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px 0, rgba(0, 0, 0, 0.1) 0 4px 8px 0` — applied to the input bar at rest and to a hypothesis card on hover only.
- **Modal scrim:** `{colors.scrim}` at 50% opacity — reserved for a future "About this analysis" info dialog; unused at MVP.

## Components

### Buttons
**`button-primary`** — Rausch fill, white text, 8px radius, 48px height. Used once per page: the "Analyze" CTA embedded in the input bar (see below).
**`button-primary-active`** — Press state, background flips to `{colors.primary-active}`.
**`button-primary-disabled`** — Pale Rausch tint, shown while the NCT ID field is empty.
**`button-secondary`** — White fill, ink text, 1px ink outline. Used for "Copy link" / "Analyze another trial."
**`button-tertiary-text`** — Plain ink text, underline on hover. Used for "Show more evidence," "How this works."

### Input & Analyze Surface
*Replaces the source system's three-segment search bar with a single-field equivalent.*

**`analyze-bar-pill`** — White fill, `{rounded.full}`, 64px height, 1px hairline border, the system's one shadow tier at rest. A single segment holds the "NCT ID" caption label above a placeholder ("e.g. NCT04368728"). Friction-less: no submit button, no magnifying-glass icon — `lib/hooks/useNctIdAutoSubmit.ts` classifies the value on every keystroke, and the instant it fully matches `NCT` + 8 digits, the bar auto-navigates to the result after a 900ms pause (long enough for `{component.valid-id-check}` to visibly settle into place first, so the sequence reads as "check appears, *then* the page changes" rather than an instant jump). Four border states, always paired with a static format hint beneath the bar ("Format: 3 letters followed by 8 digits (e.g. NCT12345678)") — that hint doesn't wait for an error to appear, it's always there: `{colors.hairline}` while empty, `{colors.pending}` while the value is a valid, in-progress *prefix* of the pattern (so typing "NCT042…" reads as "still going," not wrong), `{colors.error}` the moment the value can no longer become valid (wrong prefix, too long, a non-digit after "NCT"), and `{colors.success}` plus `{component.valid-id-check}` at the trailing edge once it's fully valid. Focus gets a `{colors.primary}` ring (`focus-within`) — Rausch's one remaining job on this bar, now that there's no button for it to color.

**`valid-id-check`** — Replaces the retired `analyze-orb` at the trailing edge of `analyze-bar-pill`/`nav-search`. A small `{colors.success}`-filled circle with a white check glyph, rendered only while the input holds a fully valid NCT ID — its appearance *is* the "correctly entered" signal. Deliberately slow to pop in (`.hero-card-in`, 600ms — slower than this app's other ~300-500ms entrance pops) specifically so it has time to be seen and register before the bar's 900ms auto-navigate fires; a snappier reveal would mean the check and the page change happen too close together to read as two distinct moments. 40px on `analyze-bar-pill`, 26px on the more compact `nav-search`.

**`hero-preview-card`** — Fills the homepage hero's empty right-hand space at large viewports (≥1024px; hidden below that, no room to do it justice). Not a stock photo — this app has no photography anywhere, deliberately — but a stack of three cards: the front one a real `{component.hypothesis-card}` rendered with representative sample content, the two behind it decorative-only category labels (`--color-hero-tint-a` soft blue, `--color-hero-tint-b` soft amber — see design.md dark-mode table for the dark values). This is the one deliberate, scoped exception to the app's single-accent rule: everywhere else stays ink/muted/Rausch-only, but this is one `aria-hidden` landing-page graphic, not the real product UI where the epistemic-labeling restraint actually matters — and it's representationally honest besides, since a real analysis really does return a stack of multiple ranked hypotheses. On mount, all three layers fade/rise in staggered (back-to-front, 100ms apart); on hover, the stack fans out further and the front card lifts and straightens. The genuine thing is one search away.

**`live-trial-stats`** — Fills the leftover vertical space beneath the hero paragraph, beside `{component.hero-preview-card}`'s taller card stack. Superseded an earlier restated-copy version (`trust-points`): this instead shows 4 small cards — Terminated, Completed, Recruiting, Active — each a live count of how many trials currently hold that status on ClinicalTrials.gov right now (`lib/clients/ctgovStats.ts`, `/studies?countTotal=true`, server-fetched with a 1hr revalidate; the whole section is skipped rather than shown stale or partial if the fetch fails). Fixed 2×2 grid at every viewport, not just on mobile — deliberately kept small and dense rather than spread into a 4-across row.

Each card is a second, distinct scoped exception to the single-accent rule (the first is `{component.hero-preview-card}`'s decorative tints) — see globals.css/`tailwind.config.ts` `stat.*` tokens and `lib/statusColors.ts`, the shared source these colors, `{component.trial-status-tag}`, and the homepage's example links all read from. A 4px colored left edge + soft tinted card fill per status (rose/Terminated, green/Completed, blue/Recruiting, amber/Active), a matching colored pill outline, and a 30px literal status icon (stop-square / check-circle / person-plus / pulse-line — same 24-viewBox stroke vocabulary as `how-it-works-steps`, sized up from that context's 20px since here the icon is a primary card element, not a small inline aside) top-right of each card. Judged safe specifically because these are 4 literal, mutually-exclusive status categories, not a certainty or quality signal — it doesn't touch the Fact/Inference/Hypothesis tags, which stay strictly uncolored. The count itself stays `{colors.ink}` regardless of card color, so legibility never depends on the accent hue.

Three independent motions run on this component, each isolated to its own element so their `transform`s don't fight each other (same reasoning as `hero-preview-card`'s split layers — a running animation's held state otherwise cancels any other transform source on that node): the card itself fades/rises in staggered on mount (`.hero-card-in`, 80ms apart) and lifts slightly on hover; the icon continuously bobs and scales at rest (`.stat-icon-motion`, 2.4s ease-in-out loop, staggered 150ms per card) independent of its own hover-pop (on a wrapping span); and the count (`{component.rolling-number}`) rolls once on mount, staggered 100ms per card, from **(total − 1000) up to the real total** — not from zero, and not an indefinite spin. The bounded window keeps the roll fast and legible while still sweeping through several digits changing in the process; it always lands on, and stays at, the true fetched count. The accessible name (`aria-label`) states the real total throughout, since the roll is presentation only — the underlying value is never fabricated, randomized, or left unsettled. All three motions respect `prefers-reduced-motion` (count jumps straight to its final value; the two `@keyframes` animations are disabled outright).

### Top Navigation
**`top-nav`** — White surface, 80px height, 1px bottom hairline. Wordmark flush left; `{component.nav-search}`, `{component.home-button}`, and `{component.theme-toggle}` flush right, in that order. No center tabs, no account menu — nothing to navigate to beyond the one function.

**`home-button`** — Originally page-scoped to the analysis results page only (as `back-home-button`); moved into `top-nav` so it's reachable from every page, not just deep results — the wordmark itself also links home, but at the far top-left, easy to miss once you're mid-scroll on a results page. Always visible at every viewport, unlike `nav-search`.

**`nav-search`** — Superseded an earlier live API-health status dot: that told visitors the *backend* was fine, which isn't something they actually need to know day to day. This tells them something useful instead — a compact 40px-tall version of `{component.analyze-bar-pill}` (canvas fill, hairline border) that lets you start a new analysis from any page without scrolling back to the homepage. Same `useNctIdAutoSubmit` friction-less behavior and same four border states as `analyze-bar-pill`, `{component.valid-id-check}` at 26px once valid — but no format hint text beneath it, unlike `analyze-bar-pill`: this is a compact, secondary entry point sitting inside the fixed 80px `top-nav`, so the border color alone carries the state, and the full "Format: 3 letters followed by 8 digits" explanation lives on the homepage's primary bar. Hidden below `md` (768px) — doesn't fit alongside the full wordmark and two 44px touch targets on a phone-width nav; mobile falls back to `{component.home-button}` (always visible) plus the homepage's own search. Since `top-nav` doesn't unmount on navigation, the field resets itself right as it navigates so the old value doesn't linger into the destination page.

### Status & Epistemic Tags
**`trial-status-tag`** — Repurposed from the source system's "NEW" badge. Uppercase pill (`{rounded.full}`), `{typography.uppercase-tag}`. For the 4 statuses `{component.live-trial-stats}` colors on the homepage (TERMINATED/COMPLETED/RECRUITING/ACTIVE_NOT_RECRUITING), this tag now uses that exact same color via the shared `lib/statusColors.ts` — so a trial's status pill reads as the same color on its own result page as it does in the homepage's live counts and in the homepage's example links (`app/page.tsx` `EXAMPLES`, same shared source). Anything outside that set (WITHDRAWN, SUSPENDED, etc.) falls back to the original binary: ink-outlined for the failure-analysis statuses, muted-outlined otherwise.

**`tag-fact`** — Ink-filled pill, white text, `{typography.badge}`. Highest certainty.
**`tag-inference`** — Ink-outlined pill (1px ink border), ink text, transparent fill. Medium certainty.
**`tag-hypothesis`** — `{colors.surface-soft}` filled pill, muted text. Lowest certainty.
*No hue coding.* Certainty runs ink → outline → muted, deliberately excluding Rausch and any red/yellow/green semantics — a Hypothesis-tagged claim should read as "less certain," never as "wrong" or "flagged."

### Result Cards
**`bottom-line-card`** — White surface, `{rounded.md}`, 24px padding, 1px hairline border, a 4px solid ink accent bar on the left edge (this app's one unique structural motif — there's no source-system equivalent). Holds the lead conclusion sentence in `{typography.display-lg}`.

**`hypothesis-card`** — Text-first equivalent of the source system's photo-first property-card. 1px hairline border + `{rounded.md}` (replacing the photo-edge the source relied on for card definition). Header row: title (`{typography.display-sm}`), `{component.trial-status-tag}`-style confidence chip, and `{component.confidence-meter}`. Body: "Evidence for" list in `{typography.body-md}`, each line prefixed with its epistemic tag. Footer: a visually distinguished counter-argument sub-block in `{colors.surface-soft}` fill, `{rounded.sm}`, 16px padding — always present, never optional, so the strongest case against each hypothesis is as visible as the case for it.

**`confidence-meter`** — A compact horizontal 4-segment ink-fill bar (Low / Medium / High / Very High) with a `{typography.body-sm}` caption beneath. The repeatable, restrained substitute for the source system's one-time 64px rating-display — this app needs a trust signal on every card, not one hero number per page.

**`evidence-row`** — Replaces `amenity-row`. Claim text (`{typography.body-md}`) + inline epistemic tag + a source-link icon-button (`{component.icon-button-circle}`, `{colors.surface-strong}` fill) linking out to ClinicalTrials.gov or the specific PubMed record. 16px row padding, `{colors.hairline}` divider between rows.

### Guardrail Band
**`guardrail-band`** — `{colors.surface-soft}` fill, `{rounded.md}`, no shadow (deliberately flat — see Elevation), 24px padding. Sits between the Bottom Line and the Hypotheses list, non-collapsible. Carries a small ink info icon + `{typography.caption}` label, then plain-language statement of what's fact, what's inferred, and what's speculative for this specific analysis.

### Disclaimer Band
**`disclaimer-band`** — Reuses the source system's `legal-band` treatment: `{typography.caption-sm}`, `{colors.muted}`, pinned at the very bottom of every results page. Fixed text: "Not medical or investment advice." Persistent and non-dismissible, per the product's Responsible AI requirements.

### Forms
**`text-input`** — Same token as source: white surface, 1px hairline outline, `{rounded.sm}`, 56px height. Used for the NCT ID field in its non-pill contexts (e.g., an inline "analyze another trial" field at the bottom of results, if added). On invalid format, border flips to `{colors.error}` (2px) with inline error text beneath; on a fully valid ID, `{colors.success}` — same two-state pattern as `{component.analyze-bar-pill}`. Never Rausch, so validity is never mistaken for a brand moment.

### Loading State
**`analysis-loading-state`** — *New; the source system had no equivalent (listings load instantly from cached data, this app runs a live 20-40 second LLM reasoning pass).* `{component.analysis-stage-icon}` (below) plus a plain-language status line ("Fetching the trial record…", "Resolving linked research on PubMed…", "Reasoning through the evidence…") sit centered above four `{colors.surface-soft}`-filled `{rounded.md}` skeleton blocks previewing the Bottom Line / Hypotheses / Evidence / Guardrail layout. The status line advances on a timer, not real server-pushed progress — the reasoning call is one non-streaming request with no sub-stage signal to report — but it still tells the truth about *what's generally happening and in what order*, and never blocks the actual result from appearing the moment it's ready. The skeleton blocks themselves stay static, no shimmer — the stage icon is the system's one deliberate concession on motion, reserved for the one moment (a 20-40s wait) that actually needs it.

**`analysis-stage-icon`** — A different, literal icon per stage rather than one animated mark held constant throughout: a database/record icon while fetching ClinicalTrials.gov, an open-book/journal icon while resolving PubMed publications, a brain icon while reasoning through the evidence — the record icon is the same glyph as `{component.how-it-works-steps}`'s "We pull the public record" step, for vocabulary consistency. Each icon gently breathes (scale 0.94→1.04, ease-in-out, ~1.6s cycle) while showing, and remounts fresh — animation restarting — the moment the stage advances, which itself reinforces that something changed. Ink stroke throughout, no fill, no color coding by stage. Respects `prefers-reduced-motion` (renders static).

### Error States
**`upstream-error-state`** — Renders when `GET /api/analyze/[nctId]` fails after its one retry (engineering-doc.md Flow 4.5). Names the specific dependency that failed rather than a generic "something went wrong": `lib/errors.ts` tags every thrown error with a `source` (`clinicaltrials_gov` or `reasoning_service`) before it ever reaches the client, and `{component.upstream-error-illustration}` + a source-specific headline/body pair (`UpstreamErrorState.tsx`'s `COPY` map) render accordingly — "ClinicalTrials.gov isn't responding" vs. "The reasoning service is busy." PubMed is never one of the two sources: `lib/clients/pubmed.ts` always degrades gracefully (an empty publication list, not a thrown error) rather than failing the request, so a PubMed hiccup is invisible to the user by design, not an oversight. Falls back to the pre-existing generic copy when no source is known (e.g., `error.tsx`'s render-exception safety net, or a client-side network failure with no response body to read a source from). `{colors.error}` on the headline, matching every other failure state.

**`upstream-error-illustration`** — The one deliberate illustration in an otherwise photo-free, icon-only app (a second, narrowly scoped exception to the "no photography/illustration anywhere" rule stated in `{component.hero-preview-card}`, granted specifically because a friendlier failure moment was worth the exception, and only there). A lab mouse — this app's own subject matter, trials run on lab studies — with one eyebrow raised, puzzling over a thought-bubble of a crossed-out signal glyph, rather than a generic broken-robot or sad-cloud cliché. Monochrome ink/muted/canvas throughout; the only color is a single stroke of `{colors.error}` slashing through the signal icon, reusing the same red already carrying every other failure state in this app rather than introducing a new one.

### Footer
**`footer-light`** — White surface, no shadow, single row (not the source system's 3-column layout): "How this works" · "Data sources" · `{component.disclaimer-band}`. `{typography.title-sm}` / `{typography.body-sm}`, all ink/muted — no social icons, no language/currency picker, none of which apply to a single-function, unauthenticated tool.

## Responsive Behavior

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 744px | Top nav collapses to wordmark only (the single nav link moves into a small menu icon); `analyze-bar-pill` stays full-width but the label shortens; hypothesis cards stay full-width single-column (no column reduction needed — this app was never multi-column); confidence-meter caption drops to icon-only if space is tight. |
| Tablet | 744–1128px | Full top nav with the "How this works" link visible; content column widens toward its 840px cap; hypothesis cards remain single-column (deliberately — this app never adopts a grid). |
| Desktop | 1128–1440px | Content column caps at ~840px, centered with generous side margins; full layout as designed. |
| Wide | > 1440px | Side margins absorb extra width; content column does not grow past 840px — this app's single-reading-column layout has no wide-screen equivalent to the source system's 4-up card grid. |

### Touch Targets
- `theme-toggle` and `home-button`: 44×44px circular — bumped up from the source system's 36px icon-button-circle. These are the app's only icon-only, no-label controls, so they get the full ~44px touch-target minimum (WCAG 2.5.5 AAA / Apple HIG) rather than the source's smaller convention, which was sized for a photo-dense marketplace UI with many icon buttons packed tightly, not a handful of standalone nav controls. `{component.valid-id-check}` doesn't need this consideration — it's `aria-hidden`, decorative-only, never itself an interactive target (the whole bar auto-submits; there's nothing to tap).
- Secondary text buttons (feedback "Submit", error-state "Try again"): `py-3` (12px vertical padding), not the source's `py-2` — same reasoning, these are real touch targets on a single-purpose app, not dense UI chrome.
- Source-link icon buttons (inside `evidence-row`): 32×32px circular, matching the source system's heart-button precedent — kept smaller deliberately, since these sit inside a dense repeating list (multiple per hypothesis/evidence card) where 44px each would be visually heavy; each still gets `{spacing.base}` (16px) of row padding around it.
- Trial-status-tag and epistemic tags are not interactive — no touch-target constraint applies.

### Collapsing Strategy
- The single-field `analyze-bar-pill` needs no collapsing logic — the source system's 3-segment-to-overlay collapse doesn't apply to a one-field input.
- Hypothesis and evidence lists were single-column at every breakpoint by design, not just on mobile — there was never a grid to collapse.
- The Guardrail and Disclaimer bands stay full-width and persistent at every breakpoint; they are never hidden behind a "show more" or moved into a sheet, since they're required disclosures, not supplementary content.

## Dark Mode

*A deliberate departure from the source system, which is light-only by design.* This app added dark mode as a genuine second theme, not a mechanical invert — every token below preserves the same relationships the light palette establishes (Rausch stays the sole action-only accent; epistemic tags stay on the ink/muted grayscale ramp, never colored). Toggled manually via `{component.theme-toggle}` in the top nav, backed by a `.dark` class on `<html>` and persisted to `localStorage`; a blocking script sets the class before first paint (reading `localStorage`, falling back to the OS `prefers-color-scheme`) so there's no flash of the wrong theme. All color tokens resolve through CSS custom properties (`app/globals.css`) rather than literal hex in `tailwind.config.ts`, so this list is the only place values need to change.

| Token | Light | Dark |
|---|---|---|
| `{colors.canvas}` | #ffffff | #16151a |
| `{colors.ink}` | #222222 | #f2f0ed |
| `{colors.body}` | #3f3f3f | #c9c6c0 |
| `{colors.muted}` | #6a6a6a | #9c988f |
| `{colors.muted-soft}` | #929292 | #6f6b64 |
| `{colors.primary}` (Rausch) | #ff385c | #ff4d70 |
| `{colors.primary-active}` | #e00b41 | #ff2d54 |
| `{colors.primary-disabled}` | #ffd1da | #4d2530 |
| `{colors.surface-soft}` | #f7f7f7 | #201f24 |
| `{colors.surface-strong}` | #f2f2f2 | #28272c |
| `{colors.hairline}` | #dddddd | #333138 |
| `{colors.hairline-soft}` | #ebebeb | #2a292e |
| `{colors.border-strong}` | #c1c1c1 | #4a484f |
| `{colors.error}` | #c13515 | #ff6b52 |
| `{colors.success}` | #15803d | #4ade80 |
| `{colors.pending}` | #eab308 | #facc15 |
| `{colors.legal-link}` | #428bff | #6ba3ff |

Rausch brightens slightly in dark mode (#ff385c → #ff4d70) to hold sufficient contrast against the darker canvas — same hue relationship, adjusted for the new background. The system's one shadow tier (`{elevation.card}`) also switches from a black drop-shadow (invisible on a dark canvas) to a faint light ring plus a heavier black drop, so cards still read as lifted.

**`theme-toggle`** — 36px circular icon button, `{colors.surface-strong}` fill, matching `{component.icon-button-circle}`. Sun icon when dark (click to go light), moon icon when light (click to go dark) — the icon shows the destination, not the current state. Lives in `{component.top-nav}`'s right slot.

## Known Gaps

- **Hover state colors:** not documented, consistent with the source system's policy — the hypothesis-card hover float uses the one shadow tier only.
- **Info dialog / modal styling:** the scrim token is reserved for a possible future "About this analysis" dialog but no dialog component has been designed yet.
- **Confidence-meter exact thresholds:** the 4-segment Low/Medium/High/Very High bands are specified visually but not yet mapped to the product's underlying confidence scoring logic (see the PRD's AI Quality Bar section).
