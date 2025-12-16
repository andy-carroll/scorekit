"use client";

import type { Question } from "@/lib/questions";

interface QuestionCardProps {
  question: Question;
  selectedValue: number | null;
  onSelect: (value: number) => void;
}

export function QuestionCard({
  question,
  selectedValue,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-2 text-sm font-medium text-indigo-600 uppercase tracking-wide">
        {question.pillar}
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {question.text}
      </h2>
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-150 ${
              selectedValue === option.value
                ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50 text-gray-700"
            }`}
          >
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
