// One icon per stage, literally matching what AnalysisProgress's status
// text says is happening — replaces the earlier animated Signal-mark
// treatment, which stayed the same throughout all three stages and so
// never actually told you anything. Same icon vocabulary as
// HowItWorksSteps.tsx (the record icon is identical) for consistency.
const STAGE_ICONS = [
  // Fetching the trial record — a database/record icon.
  <path key="record" d="M4 6a8 3 0 0 0 16 0 M4 6a8 3 0 0 1 16 0v12a8 3 0 0 1-16 0z M4 12a8 3 0 0 0 16 0" />,
  // Resolving PubMed publications — an open book/journal icon.
  <path key="journal" d="M12 6.5c-1.8-1.3-4.1-2-6.5-2v13.5c2.4 0 4.7.7 6.5 2 1.8-1.3 4.1-2 6.5-2V4.5c-2.4 0-4.7.7-6.5 2z M12 6.5v13.5" />,
  // Reasoning through the evidence — a brain/thinking icon.
  <path key="brain" d="M12 3a5 5 0 0 0-5 5c0 1.5.6 2.4 1.4 3.2.6.6 1.1 1.1 1.1 2.3v1.5h5v-1.5c0-1.2.5-1.7 1.1-2.3.8-.8 1.4-1.7 1.4-3.2a5 5 0 0 0-5-5z M9.5 19h5 M10.5 21.5h3" />,
];

export default function AnalysisStageIcon({
  stageIndex,
  size = 40,
}: {
  stageIndex: number;
  size?: number;
}) {
  return (
    <svg
      key={stageIndex}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-ink)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stage-icon-pulse"
      aria-hidden="true"
    >
      {STAGE_ICONS[stageIndex]}
    </svg>
  );
}
