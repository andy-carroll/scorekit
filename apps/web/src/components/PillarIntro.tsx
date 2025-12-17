interface PillarIntroProps {
  pillarName: string;
  pillarDescription: string;
  questionCount: number;
  pillarNumber: number;
  totalPillars: number;
  onContinue?: () => void;
}

export function PillarIntro({
  pillarName,
  pillarDescription,
  questionCount,
  pillarNumber,
  totalPillars,
  onContinue,
}: PillarIntroProps) {
  return (
    <div className="card text-center">
      <div className="section-label mb-2">
        Section {pillarNumber} of {totalPillars}
      </div>

      <h2 className="section-heading mb-4">{pillarName}</h2>

      <p className="body-text mb-6 max-w-md mx-auto">{pillarDescription}</p>

      <div className="muted-text mb-8">
        {questionCount} {questionCount === 1 ? "question" : "questions"}
      </div>

      {onContinue && (
        <button
          onClick={onContinue}
          className="btn-primary"
        >
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
  );
}
