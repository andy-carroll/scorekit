interface Section {
  id: string;
  name: string;
  completed: boolean;
}

interface SectionProgressProps {
  sections: Section[];
  currentSectionId: string;
}

export function SectionProgress({ sections, currentSectionId }: SectionProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
      {sections.map((section, index) => {
        const isCurrent = section.id === currentSectionId;
        const isCompleted = section.completed;

        return (
          <div key={section.id} className="flex items-center">
            {index > 0 && (
              <div
                className={`w-4 h-0.5 mx-1 ${
                  isCompleted ? "bg-green-400" : "bg-gray-200"
                }`}
              />
            )}
            <div
              data-testid={
                isCompleted
                  ? "section-complete"
                  : isCurrent
                  ? "section-current"
                  : "section-pending"
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isCompleted
                  ? "bg-green-100 text-green-700"
                  : isCurrent
                  ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {isCompleted && (
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="hidden sm:inline">{section.name}</span>
              <span className="sm:hidden">{index + 1}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
