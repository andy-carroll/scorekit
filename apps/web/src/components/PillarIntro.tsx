interface PillarIntroProps {
  pillarName: string;
  pillarDescription: string;
  questionCount: number;
  pillarNumber: number;
  totalPillars: number;
  onContinue?: () => void;
  wrapInCard?: boolean;
}

export function PillarIntro({
  pillarName,
  pillarDescription,
  questionCount,
  pillarNumber,
  totalPillars,
  onContinue,
  wrapInCard = true,
}: PillarIntroProps) {
  const content = (
    <div className="pillar-intro">
      <div className="pillar-intro-divider" aria-hidden="true" />

      <div className="pillar-intro-content">
        <div className="section-label pillar-intro-kicker">
          SECTION {pillarNumber} OF {totalPillars}
        </div>

        <h2 className="pillar-intro-title">{pillarName}</h2>

        <p className="body-text pillar-intro-description">{pillarDescription}</p>

        <div className="muted-text pillar-intro-meta">
          {questionCount} {questionCount === 1 ? "question" : "questions"}
        </div>

        {onContinue && (
          <button onClick={onContinue} className="btn-primary">
            Continue
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="pillar-intro-divider" aria-hidden="true" />
    </div>
  );

  if (!wrapInCard) return content;

  return <div className="card">{content}</div>;
}
