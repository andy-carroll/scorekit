"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/questions";

interface ScoreResult {
  total: number;
  max: number;
  percentage: number;
  pillarScores: Record<string, number>;
  band: string;
}

interface Lead {
  email: string;
  name: string;
  company: string;
  reportId: string;
}

const bandColors: Record<string, { bg: string; text: string; border: string }> =
  {
    Leader: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    Progressing: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    Emerging: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    Starting: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },
  };

export default function ReportPage() {
  const router = useRouter();

  const { result, lead, answers } = useMemo(() => {
    if (typeof window === "undefined") {
      return { result: null, lead: null, answers: {} };
    }
    const storedResult = sessionStorage.getItem("scorekit_result");
    const storedLead = sessionStorage.getItem("scorekit_lead");
    const storedAnswers = sessionStorage.getItem("scorekit_answers");

    if (!storedResult || !storedLead) {
      return { result: null, lead: null, answers: {} };
    }

    return {
      result: JSON.parse(storedResult) as ScoreResult,
      lead: JSON.parse(storedLead) as Lead,
      answers: storedAnswers ? JSON.parse(storedAnswers) : {},
    };
  }, []);

  if (!result || !lead) {
    if (typeof window !== "undefined") {
      router.push("/quiz");
    }
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading your report...</div>
      </main>
    );
  }

  const bandStyle = bandColors[result.band] || bandColors.Starting;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Readiness Report
          </h1>
          <p className="text-gray-600">
            Prepared for {lead.name} at {lead.company}
          </p>
        </div>

        {/* Score Card */}
        <div
          className={`rounded-2xl border-2 ${bandStyle.border} ${bandStyle.bg} p-8 mb-8`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                Your AI Readiness Band
              </div>
              <div className={`text-4xl font-bold ${bandStyle.text}`}>
                {result.band}
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900">
                {result.percentage}%
              </div>
              <div className="text-sm text-gray-500">
                {result.total} / {result.max} points
              </div>
            </div>
          </div>
        </div>

        {/* Pillar Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Score by Pillar
          </h2>
          <div className="space-y-4">
            {questions.map((q) => {
              const score = answers[q.id] || 1;
              const percentage = (score / 5) * 100;
              return (
                <div key={q.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{q.pillar}</span>
                    <span className="text-gray-500">{score}/5</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations Placeholder */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Key Recommendations
          </h2>
          <ul className="space-y-3">
            {Object.entries(result.pillarScores)
              .filter(([, score]) => score <= 3)
              .slice(0, 3)
              .map(([pillar]) => (
                <li key={pillar} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                    <svg
                      className="w-4 h-4 text-indigo-600"
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
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{pillar}:</span>{" "}
                    <span className="text-gray-600">
                      Focus on strengthening this area to unlock significant
                      improvements in your AI capabilities.
                    </span>
                  </div>
                </li>
              ))}
            {Object.entries(result.pillarScores).filter(([, score]) => score <= 3)
              .length === 0 && (
              <li className="text-gray-600">
                Great work! You&apos;re performing well across all pillars.
                Consider deepening your strengths further.
              </li>
            )}
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-indigo-600 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Want to improve your score?
          </h2>
          <p className="text-indigo-100 mb-6">
            Book a free 15-minute strategy call to discuss your results.
          </p>
          <button className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
            Book a Call
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            A PDF copy of this report has been sent to {lead.email}
          </p>
          <p className="mt-1">Report ID: {lead.reportId}</p>
        </div>
      </div>
    </main>
  );
}
