"use client";

import { useNctIdAutoSubmit } from "@/lib/hooks/useNctIdAutoSubmit";
import ValidIdCheck from "./ValidIdCheck";

const BORDER_BY_STATUS = {
  empty: "border-hairline",
  typing: "border-pending",
  valid: "border-success",
  invalid: "border-error",
};

// Replaces the top-right status dot — that told you the *backend* was
// fine, which isn't something a visitor actually needs to know. This
// tells you something useful instead: lets you start a new analysis from
// any page (how-it-works, a result page) without scrolling back to the
// homepage's full analyze-bar-pill. Hidden below `md` — the compact
// input plus two 44px touch targets doesn't fit on a phone-width nav;
// mobile falls back to HomeButton (always visible, unlike this) plus
// the homepage's own search. Friction-less like analyze-bar-pill — no
// submit button, a valid NCT ID auto-navigates itself
// (useNctIdAutoSubmit). No format hint here (unlike analyze-bar-pill) —
// this is a compact, secondary entry point; the border color alone
// carries the state, and the full explanation lives on the homepage's
// primary bar. Same as analyze-bar-pill, the Rausch focus ring only
// shows while empty — once there's a value, the border color is already
// the state signal, and a second ring color next to it just clashes.
export default function NavSearch() {
  const { value, setValue, status } = useNctIdAutoSubmit();
  const ringClass = status === "empty" ? "focus-within:ring-2 focus-within:ring-primary" : "";

  return (
    <div
      className={`hidden h-10 items-center gap-1 rounded-full border bg-canvas pl-4 pr-1 transition-colors md:flex ${ringClass} ${BORDER_BY_STATUS[status]}`}
    >
      <label htmlFor="nav-nct-id" className="sr-only">
        NCT ID
      </label>
      <input
        id="nav-nct-id"
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="NCT ID"
        className="w-28 border-none bg-transparent p-0 text-body-sm text-ink placeholder:text-muted-soft focus:outline-none focus:ring-0"
      />
      {status === "valid" && <ValidIdCheck size={26} />}
    </div>
  );
}
