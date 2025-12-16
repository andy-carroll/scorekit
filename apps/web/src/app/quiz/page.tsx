"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { sections, getQuestionsForSection, calculateScore } from "@/lib/questions";
import { QuestionCard, type AnswerValue } from "@/components/QuestionCard";
import { PillarIntro } from "@/components/PillarIntro";
import { SectionProgress } from "@/components/SectionProgress";

type FlowStep =
  | { type: "intro"; sectionIndex: number }
  | { type: "question"; sectionIndex: number; questionIndex: number };

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FlowStep>({ type: "intro", sectionIndex: 0 });
  const [answers, setAnswers] = useState<Record<string, number | string | string[]>>({});
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  // Build flat list of all questions with section context
  const sectionQuestions = useMemo(() => {
    return sections.map((section) => ({
      section,
      questions: getQuestionsForSection(section.id),
    }));
  }, []);

  const currentSection = sections[currentStep.sectionIndex];
  const currentSectionQuestions = sectionQuestions[currentStep.sectionIndex]?.questions || [];

  // Calculate progress for SectionProgress component
  const progressSections = sections.map((s) => ({
    id: s.id,
    name: s.name,
    completed: completedSections.has(s.id),
  }));

  const handleIntroComplete = () => {
    // Move from intro to first question of this section
    setCurrentStep({ type: "question", sectionIndex: currentStep.sectionIndex, questionIndex: 0 });
  };

  // Store answer without auto-advancing (for multi-select, text)
  const handleAnswerUpdate = (answer: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [answer.questionId]: answer.value }));
  };

  // Auto-advance for single-select inputs (radio, select, choice)
  const handleAnswerAndAdvance = (answer: AnswerValue) => {
    const newAnswers = { ...answers, [answer.questionId]: answer.value };
    setAnswers(newAnswers);
    advanceToNext(newAnswers);
  };

  // Manual advance (for multi-select, text via Next button)
  const handleManualNext = () => {
    advanceToNext(answers);
  };

  const advanceToNext = (currentAnswers: Record<string, number | string | string[]>) => {
    if (currentStep.type !== "question") return;

    const { sectionIndex, questionIndex } = currentStep;
    const isLastQuestionInSection = questionIndex === currentSectionQuestions.length - 1;
    const isLastSection = sectionIndex === sections.length - 1;

    if (isLastQuestionInSection) {
      // Mark section complete
      setCompletedSections((prev) => new Set([...prev, currentSection.id]));

      if (isLastSection) {
        // All done - calculate and navigate
        const result = calculateScore(currentAnswers as Record<string, number>);
        sessionStorage.setItem("scorekit_answers", JSON.stringify(currentAnswers));
        sessionStorage.setItem("scorekit_result", JSON.stringify(result));
        router.push("/email");
      } else {
        // Move to next section intro
        setTimeout(() => {
          setCurrentStep({ type: "intro", sectionIndex: sectionIndex + 1 });
        }, 200);
      }
    } else {
      // Move to next question in section
      setTimeout(() => {
        setCurrentStep({ type: "question", sectionIndex, questionIndex: questionIndex + 1 });
      }, 200);
    }
  };

  // Determine if current question needs manual Next button
  const currentQuestion = currentStep.type === "question" 
    ? currentSectionQuestions[currentStep.questionIndex] 
    : null;
  const needsManualNext = currentQuestion?.inputType === "multi-select" || currentQuestion?.inputType === "text";
  
  // Check if current question has a valid answer
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const currentQuestionHasAnswer = currentAnswer !== undefined && currentAnswer !== "" && 
    (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);

  const handleBack = () => {
    if (currentStep.type === "question" && currentStep.questionIndex > 0) {
      // Go back within section
      setCurrentStep({ ...currentStep, questionIndex: currentStep.questionIndex - 1 });
    } else if (currentStep.type === "question" && currentStep.questionIndex === 0) {
      // Go back to intro
      setCurrentStep({ type: "intro", sectionIndex: currentStep.sectionIndex });
    } else if (currentStep.type === "intro" && currentStep.sectionIndex > 0) {
      // Go back to last question of previous section
      const prevSectionQuestions = sectionQuestions[currentStep.sectionIndex - 1]?.questions || [];
      setCurrentStep({
        type: "question",
        sectionIndex: currentStep.sectionIndex - 1,
        questionIndex: prevSectionQuestions.length - 1,
      });
    }
  };

  const canGoBack =
    (currentStep.type === "question") ||
    (currentStep.type === "intro" && currentStep.sectionIndex > 0);

  // Calculate total progress
  const totalQuestions = sectionQuestions.reduce((sum, sq) => sum + sq.questions.length, 0);
  const questionsBeforeCurrentSection = sectionQuestions
    .slice(0, currentStep.sectionIndex)
    .reduce((sum, sq) => sum + sq.questions.length, 0);
  const currentQuestionNumber =
    currentStep.type === "question"
      ? questionsBeforeCurrentSection + currentStep.questionIndex + 1
      : questionsBeforeCurrentSection;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <SectionProgress sections={progressSections} currentSectionId={currentSection.id} />

        {currentStep.type === "intro" ? (
          <PillarIntro
            pillarName={currentSection.name}
            pillarDescription={currentSection.description}
            questionCount={currentSectionQuestions.length}
            pillarNumber={currentStep.sectionIndex + 1}
            totalPillars={sections.length}
            onContinue={handleIntroComplete}
          />
        ) : (
          <>
            <div className="text-center text-sm text-gray-500 mb-4">
              Question {currentQuestionNumber} of {totalQuestions}
            </div>
            <QuestionCard
              question={currentSectionQuestions[currentStep.questionIndex]}
              value={answers[currentSectionQuestions[currentStep.questionIndex]?.id]}
              onAnswer={needsManualNext ? handleAnswerUpdate : handleAnswerAndAdvance}
              pillarName={currentSection.name}
            />
            {needsManualNext && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleManualNext}
                  disabled={!currentQuestionHasAnswer}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {canGoBack && (
          <div className="mt-8 text-center">
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
