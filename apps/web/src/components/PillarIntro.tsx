interface PillarIntroProps {
  pillarName: string;
  pillarDescription: string;
  questionCount: number;
  pillarNumber: number;
  totalPillars: number;
  onContinue: () => void;
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <div className="text-sm text-indigo-600 font-medium mb-2">
        Section {pillarNumber} of {totalPillars}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">{pillarName}</h2>

      <p className="text-gray-600 mb-6 max-w-md mx-auto">{pillarDescription}</p>

      <div className="text-sm text-gray-500 mb-8">
        {questionCount} {questionCount === 1 ? "question" : "questions"}
      </div>

      <button
        onClick={onContinue}
        className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
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
    </div>
  );
}
