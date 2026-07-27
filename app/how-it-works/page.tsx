const TAXONOMY = [
  "Recruitment / enrollment shortfall",
  "Efficacy (missed primary endpoint)",
  "Safety / toxicity",
  "Funding / business decision",
  "Operational / protocol issues",
  "Strategic / competitive deprioritization",
  "Futility (interim analysis)",
];

const SNAPSHOT_FIELDS = [
  "Phase, study type, and condition(s)",
  "Sponsor",
  "Timeline — start date and (estimated or actual) completion date",
  "Enrollment — target or actual, labeled accordingly",
  "Who can join — age range, sex, healthy volunteers",
  "Trial sites — how many, and in which countries",
  "Results, if posted — outcome measures and adverse event counts",
  "Linked publications, if any",
];

export default function HowItWorks() {
  return (
    <main className="mx-auto flex max-w-content flex-col gap-8 px-4 py-section">
      <h1 className="text-display-xl text-ink">How this works</h1>

      <section className="flex flex-col gap-2">
        <h2 className="text-display-sm text-ink">One NCT ID, two kinds of answer</h2>
        <p className="text-body-md text-body">
          Paste a trial&apos;s NCT ID and we fetch its full record from
          ClinicalTrials.gov and resolve any linked publications on PubMed —
          nothing more than these two public sources is ever used. What you
          get back depends on the trial&apos;s current status. A trial that
          was <strong>terminated, withdrawn, or suspended</strong> gets a
          reasoning pass: ranked hypotheses for why it likely stopped. Every
          other trial — <strong>completed, recruiting, or still planned</strong> —
          has no failure to explain, so it gets a plain factual snapshot
          instead, with no AI reasoning involved at all.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-display-sm text-ink">If the trial failed: ranked hypotheses</h2>
        <p className="text-body-md text-body">
          A structured reasoning pass classifies the likely cause against a
          fixed taxonomy, and ranks each hypothesis by confidence:
        </p>
        <ul className="list-disc pl-5 text-body-md text-body">
          {TAXONOMY.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="text-body-md text-body">
          Every claim is labeled by how certain it is. <strong>Fact</strong>{" "}
          means it&apos;s directly in the trial record. <strong>Inference</strong>{" "}
          means it&apos;s a reasonable read of those facts.{" "}
          <strong>Hypothesis</strong> means it&apos;s plausible but unproven.
          Every ranked hypothesis also comes with its strongest
          counter-argument, so nothing is presented as more certain than
          it actually is.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-display-sm text-ink">
          If it didn&apos;t: a plain factual snapshot
        </h2>
        <p className="text-body-md text-body">
          Completed, recruiting, and planned trials don&apos;t have an
          ambiguous &quot;why&quot; to reason about, so we don&apos;t force one — we
          skip the AI pass entirely and pull together what&apos;s already on the
          public record:
        </p>
        <ul className="list-disc pl-5 text-body-md text-body">
          {SNAPSHOT_FIELDS.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="text-body-md text-body">
          If a completed trial has posted results, we show what was
          measured — outcome titles and counts — not a computed
          &quot;did it work&quot; verdict. The full statistical comparison always
          stays on ClinicalTrials.gov, linked from every snapshot.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-display-sm text-ink">What this isn&apos;t</h2>
        <p className="text-body-md text-body">
          This tool doesn&apos;t use any data beyond ClinicalTrials.gov and
          PubMed, has no accounts or saved history, and its output is not
          medical or investment advice — always verify anything
          decision-relevant against primary sources.
        </p>
      </section>
    </main>
  );
}
