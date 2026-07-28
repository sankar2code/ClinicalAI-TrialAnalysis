import Link from "next/link";
import NotFoundIllustration from "./NotFoundIllustration";

// engineering-doc.md Flow 4.3 — well-formed but nonexistent NCT ID. Also
// reused for the invalid-format case (Flow 4.2) with an overridden
// message — that path shouldn't normally be reachable through the UI
// (AnalyzeBarPill already blocks malformed input before navigating here),
// but the API can still return it for a hand-typed URL.
export default function NotFoundState({
  nctId,
  message,
}: {
  nctId: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-5 rounded-md border border-hairline p-8 sm:flex-row sm:items-center sm:gap-6">
      <NotFoundIllustration />
      <div className="flex flex-col gap-3">
        <h1 className="text-display-md text-ink">We couldn&apos;t find that trial</h1>
        <p className="text-body-md text-body">
          {message ?? (
            <>
              <span className="font-medium">{nctId}</span> is correctly formatted, but
              no matching study exists on ClinicalTrials.gov — even our lab mouse came
              up empty-pawed.
            </>
          )}
        </p>
        <Link href="/" className="text-link text-ink underline">
          Try another NCT ID
        </Link>
      </div>
    </div>
  );
}
