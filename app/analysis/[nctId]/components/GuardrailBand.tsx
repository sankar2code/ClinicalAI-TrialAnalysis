// design.md `guardrail-band`: surface-soft fill, no shadow (deliberately
// flat — a shadow would make a mandatory disclosure look decorative).
// Non-collapsible, always rendered.
export default function GuardrailBand({ text }: { text: string }) {
  return (
    <section className="rounded-md bg-surface-soft p-6">
      <div className="mb-2 flex items-center gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-ink"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <h2 className="text-caption text-ink">Guardrail — what's known vs. inferred vs. speculative</h2>
      </div>
      <p className="text-body-md text-body">{text}</p>
    </section>
  );
}
