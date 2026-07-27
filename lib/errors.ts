import { NextResponse } from "next/server";
import { TrialNotFoundError, CtGovUpstreamError } from "./clients/ctgov";
import { AnthropicUpstreamError, AnalysisSchemaError } from "./clients/anthropic";

// Normalizes every thrown error from the pipeline into the response shape
// documented in docs/engineering/engineering-doc.md Section 9.
export function toErrorResponse(err: unknown): NextResponse {
  if (err instanceof TrialNotFoundError) {
    return NextResponse.json({ error: "trial_not_found" }, { status: 404 });
  }

  if (err instanceof CtGovUpstreamError || err instanceof AnthropicUpstreamError) {
    return NextResponse.json({ error: "upstream_failure", retryable: true }, { status: 502 });
  }

  if (err instanceof AnalysisSchemaError) {
    // A response that fails schema validation is never partially
    // forwarded — treated as a 500, per the engineering doc.
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  console.error("Unhandled error in /api/analyze:", err);
  return NextResponse.json({ error: "internal_error" }, { status: 500 });
}
