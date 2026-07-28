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
// changes underneath it. The format hint below is always shown, not
// just on error — so the format is known before anyone has to get it
// wrong first.
export default function AnalyzeBarPill() {
  const { value, setValue, status } = useNctIdAutoSubmit();

  return (
    <div className="w-full max-w-content">
      <div
        className={`flex h-16 items-center gap-3 rounded-full border bg-canvas px-2 pl-6 shadow-card transition-colors focus-within:ring-2 focus-within:ring-primary ${BORDER_BY_STATUS[status]}`}
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
      <p className="mt-3 px-4 text-body-sm text-muted">
        Format: 3 letters followed by 8 digits (e.g. NCT12345678)
      </p>
    </div>
  );
}
