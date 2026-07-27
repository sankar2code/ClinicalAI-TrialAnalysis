import Link from "next/link";

// design.md `footer-light`: white surface, no shadow, single row of links —
// not the source system's 3-column layout, since this app has one function.
export default function FooterLight() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-4 py-8">
        <nav className="flex flex-wrap gap-6">
          <Link
            href="/how-it-works"
            className="text-title-sm text-ink no-underline hover:underline"
          >
            How this works
          </Link>
          <a
            href="https://clinicaltrials.gov"
            target="_blank"
            rel="noreferrer"
            className="text-title-sm text-ink no-underline hover:underline"
          >
            ClinicalTrials.gov
          </a>
          <a
            href="https://pubmed.ncbi.nlm.nih.gov"
            target="_blank"
            rel="noreferrer"
            className="text-title-sm text-ink no-underline hover:underline"
          >
            PubMed
          </a>
        </nav>
        <p className="text-caption-sm text-muted">
          © 2026 ClinicalAI-Trial Analysis. Not medical or
          investment advice. Built entirely from public ClinicalTrials.gov
          and PubMed data.
        </p>
      </div>
    </footer>
  );
}
