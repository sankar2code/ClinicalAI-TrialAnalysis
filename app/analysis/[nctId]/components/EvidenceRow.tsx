import type { EvidenceItem } from "@/lib/schema/analysisResult";
import EpistemicTag from "./EpistemicTag";

// design.md `evidence-row`: replaces amenity-row. Claim + inline epistemic
// tag + a source-link icon button, hairline divider between rows.
export default function EvidenceRow({ item }: { item: EvidenceItem }) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-hairline py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <EpistemicTag status={item.epistemicStatus} />
        <span className="text-body-md text-body">{item.claim}</span>
      </div>
      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="View source"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-strong text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    </li>
  );
}
