"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions, calculateScore } from "@/lib/questions";
import { QuestionCard } from "@/components/QuestionCard";
import { ProgressBar } from "@/components/ProgressBar";

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelect = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Calculate score and store in sessionStorage
      const result = calculateScore(newAnswers);
      sessionStorage.setItem("scorekit_answers", JSON.stringify(newAnswers));
      sessionStorage.setItem("scorekit_result", JSON.stringify(result));
      router.push("/email");
    } else {
      // Auto-advance after selection
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 200);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        <QuestionCard
          question={currentQuestion}
          selectedValue={answers[currentQuestion.id] || null}
          onSelect={handleSelect}
        />

        {currentIndex > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Back to previous question
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
