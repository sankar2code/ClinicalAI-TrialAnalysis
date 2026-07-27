"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const NCT_ID_PATTERN = /^NCT\d{8}$/;
// Any value that could still become a valid NCT ID by typing more
// characters — "N", "NC", "NCT", "NCT0", ... "NCT1234567" (7 digits).
const NCT_PREFIX_PATTERN = /^N(C(T(\d{0,8})?)?)?$/;
const AUTO_NAVIGATE_DELAY_MS = 450;

export type NctIdStatus = "empty" | "typing" | "valid" | "invalid";

function classify(raw: string): NctIdStatus {
  const v = raw.trim().toUpperCase();
  if (v === "") return "empty";
  if (NCT_ID_PATTERN.test(v)) return "valid";
  if (v.length <= 11 && NCT_PREFIX_PATTERN.test(v)) return "typing";
  return "invalid";
}

// Shared friction-less NCT ID input logic for `analyze-bar-pill` and
// `nav-search` (design.md) — no submit button on either: the moment the
// value fully matches NCT + 8 digits, it auto-navigates after a brief
// pause (long enough to register the green check before the page
// changes underneath it). A value that's still a valid *prefix* of the
// pattern ("N", "NCT", "NCT042...") stays neutral rather than flashing
// red partway through typing — only a value that can no longer become
// valid (wrong prefix, too long, a non-digit after "NCT") shows the
// error state immediately.
export function useNctIdAutoSubmit() {
  const [value, setValue] = useState("");
  const router = useRouter();
  const navigatedRef = useRef(false);
  const status = classify(value);

  useEffect(() => {
    if (status !== "valid") return;
    const trimmed = value.trim().toUpperCase();
    navigatedRef.current = false;
    const timer = setTimeout(() => {
      if (navigatedRef.current) return;
      navigatedRef.current = true;
      router.push(`/analysis/${trimmed}`);
      // TopNav (and its nav-search) is in the shared root layout, so it
      // doesn't unmount on navigation — reset so the old value doesn't
      // linger into the destination page.
      setValue("");
    }, AUTO_NAVIGATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [status, value, router]);

  return { value, setValue, status };
}
