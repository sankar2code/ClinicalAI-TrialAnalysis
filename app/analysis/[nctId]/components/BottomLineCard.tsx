// design.md `bottom-line-card`: this app's one unique "loud reading
// moment" — a 4px solid ink accent bar (no source-system equivalent)
// plus display-lg text. No shadow at rest, hairline border only.
export default function BottomLineCard({ text }: { text: string }) {
  return (
    <section className="rounded-md border border-hairline border-l-4 border-l-ink bg-canvas pl-5 pr-6 py-6">
      <h2 className="mb-2 text-caption uppercase tracking-wide text-muted">
        Bottom Line
      </h2>
      <p className="text-display-lg text-ink">{text}</p>
    </section>
  );
}
