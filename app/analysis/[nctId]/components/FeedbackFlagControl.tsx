"use client";

import { useState } from "react";

// engineering-doc.md Flow 4.7 — lightweight feedback flag.
export default function FeedbackFlagControl({ nctId }: { nctId: string }) {
  const [state, setState] = useState<"idle" | "open" | "submitted" | "error">("idle");
  const [note, setNote] = useState("");

  if (state === "submitted") {
    return (
      <p className="text-body-sm text-muted">
        Thanks — this trial has been flagged for review.
      </p>
    );
  }

  if (state === "open") {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const res = await fetch("/api/feedback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nctId, note: note || undefined }),
            });
            setState(res.ok ? "submitted" : "error");
          } catch {
            setState("error");
          }
        }}
        className="flex flex-col gap-2"
      >
        <label htmlFor="feedback-note" className="text-caption text-muted">
          What looks wrong? (optional)
        </label>
        <textarea
          id="feedback-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={1000}
          rows={2}
          className="rounded-sm border border-hairline p-3 text-body-sm text-ink focus:border-2 focus:border-ink focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-sm border border-ink px-4 py-3 text-button-sm text-ink"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => setState("idle")}
            className="text-button-sm text-muted underline"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  if (state === "error") {
    return (
      <p className="text-body-sm text-error">
        Couldn&apos;t submit that flag — try again?{" "}
        <button
          type="button"
          onClick={() => setState("open")}
          className="text-body-sm text-error underline"
        >
          Retry
        </button>
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setState("open")}
      className="text-button-sm text-muted underline"
    >
      This doesn&apos;t look right
    </button>
  );
}
