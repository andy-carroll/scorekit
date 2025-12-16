"use client";

import { useState } from "react";
import { QuestionCard, type AnswerValue } from "@/components/QuestionCard";
import type { DiagnosticQuestion, ContextQuestion } from "@scorekit/core";

// Demo questions showcasing all input types
const demoQuestions: (DiagnosticQuestion | ContextQuestion)[] = [
  // Diagnostic: maturity (radio)
  {
    id: "d1",
    text: "How mature is your AI strategy?",
    helpText: "Consider your current planning and documentation",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    pillarId: "leadership",
    options: [
      { value: 1, label: "No strategy exists" },
      { value: 2, label: "Informal discussions only" },
      { value: 3, label: "Draft strategy in progress" },
      { value: 4, label: "Documented and communicated" },
      { value: 5, label: "Fully integrated with business strategy" },
    ],
  },
  // Diagnostic: frequency (radio)
  {
    id: "d2",
    text: "How often do you review AI initiatives?",
    category: "diagnostic",
    questionType: "frequency",
    inputType: "radio",
    pillarId: "leadership",
    options: [
      { value: 1, label: "Never" },
      { value: 2, label: "Rarely" },
      { value: 3, label: "Sometimes" },
      { value: 4, label: "Often" },
      { value: 5, label: "Always" },
    ],
  },
  // Diagnostic: priority (choice)
  {
    id: "d3",
    text: "Which is the bigger blocker for AI adoption?",
    category: "diagnostic",
    questionType: "priority",
    inputType: "choice",
    pillarId: "leadership",
    options: [
      { id: "a", label: "Lack of budget", insight: "Financial constraints" },
      { id: "b", label: "Lack of skills", insight: "Talent gap" },
    ],
  },
  // Context: demographics (number)
  {
    id: "c1",
    text: "How many employees does your company have?",
    category: "context",
    questionType: "demographics",
    inputType: "number",
    numberConfig: {
      min: 1,
      max: 10000,
      placeholder: "Enter number of employees",
    },
  },
  // Context: cost (number with unit)
  {
    id: "c2",
    text: "How many hours per week are lost to inefficiency?",
    category: "context",
    questionType: "cost",
    inputType: "number",
    numberConfig: {
      min: 0,
      max: 100,
      unit: "hours",
      unitPosition: "suffix",
    },
  },
  // Context: pain (multi-select)
  {
    id: "c3",
    text: "What are your biggest frustrations?",
    helpText: "Select all that apply",
    category: "context",
    questionType: "pain",
    inputType: "multi-select",
    options: [
      { id: "slow", label: "Slow decision making" },
      { id: "silos", label: "Information silos" },
      { id: "manual", label: "Too much manual work" },
      { id: "talent", label: "Hard to find the right talent" },
    ],
  },
  // Context: trigger (select)
  {
    id: "c4",
    text: "What triggered your interest in AI?",
    category: "context",
    questionType: "trigger",
    inputType: "select",
    options: [
      { id: "competitor", label: "Competitor pressure" },
      { id: "cost", label: "Cost reduction goals" },
      { id: "growth", label: "Growth opportunity" },
      { id: "leadership", label: "Leadership mandate" },
    ],
  },
  // Context: aspiration (text)
  {
    id: "c5",
    text: "What does success look like for you in 12 months?",
    helpText: "Be as specific as possible",
    category: "context",
    questionType: "aspiration",
    inputType: "text",
  },
];

const pillarNames: Record<string, string> = {
  leadership: "Leadership & Vision",
};

export default function DemoPage() {
  const [answers, setAnswers] = useState<Record<string, number | string | string[]>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAnswer = (answer: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [answer.questionId]: answer.value,
    }));
  };

  const currentQuestion = demoQuestions[currentIndex];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QuestionCard Demo</h1>
          <p className="text-gray-600">
            Testing all {demoQuestions.length} question types. Question {currentIndex + 1} of {demoQuestions.length}
          </p>
        </div>

        <div className="mb-4 flex gap-2">
          {demoQuestions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-8 h-8 rounded-full text-sm font-medium ${
                i === currentIndex
                  ? "bg-indigo-600 text-white"
                  : answers[q.id] !== undefined
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            value={answers[currentQuestion.id]}
            pillarName={currentQuestion.pillarId ? pillarNames[currentQuestion.pillarId] : undefined}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            ← Previous
          </button>
          {currentIndex < demoQuestions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(0)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              ✓ Complete — Start Over
            </button>
          )}
        </div>

        <div className="mt-12 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Current Answers (Debug)</h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(answers, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
