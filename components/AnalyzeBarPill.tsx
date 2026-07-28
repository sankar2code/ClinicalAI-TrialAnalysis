"use client";

import { useNctIdAutoSubmit } from "@/lib/hooks/useNctIdAutoSubmit";
import ValidIdCheck from "./ValidIdCheck";

const BORDER_BY_STATUS = {
  empty: "border-hairline",
  typing: "border-pending",
  valid: "border-success",
  invalid: "border-error",
};

// design.md `analyze-bar-pill`: single-segment pill input. Friction-less
// by design — no submit button. A value that fully matches NCT + 8
// digits auto-navigates itself (useNctIdAutoSubmit); the border and the
// trailing check are just what makes that state visible before the page
// changes underneath it. Text below the bar has two modes: a neutral
// format hint while empty/typing (so the format is known before anyone
// has to get it wrong first), swapping to a specific red error message
// the moment the value can no longer become valid. The Rausch focus ring
// only shows while empty — once there's a value, the border color itself
// (pending/error/success) is already the state signal, and a second ring
// color next to it read as two clashing colors on the same edge rather
// than reinforcing anything.
export default function AnalyzeBarPill() {
  const { value, setValue, status } = useNctIdAutoSubmit();
  const ringClass = status === "empty" ? "focus-within:ring-2 focus-within:ring-primary" : "";

  return (
    <div className="w-full max-w-content">
      <div
        className={`flex h-16 items-center gap-3 rounded-full border bg-canvas px-2 pl-6 shadow-card transition-colors ${ringClass} ${BORDER_BY_STATUS[status]}`}
      >
        <div className="flex flex-1 flex-col justify-center">
          <label htmlFor="nct-id" className="text-caption text-muted">
            NCT ID
          </label>
          <input
            id="nct-id"
            name="nct-id"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="e.g. NCT04368728"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border-none bg-transparent p-0 text-body-md text-ink placeholder:text-muted-soft focus:outline-none focus:ring-0"
          />
        </div>
        {status === "valid" && <ValidIdCheck size={40} />}
      </div>
      {status === "invalid" ? (
        <p role="alert" className="mt-3 px-4 text-body-sm text-error">
          Enter the NCT ID in correct format/length
        </p>
      ) : (
        <p className="mt-3 px-4 text-body-sm text-muted">
          Format: 3 letters followed by 8 digits (e.g. NCT12345678)
        </p>
      )}
    </div>
  );
}
