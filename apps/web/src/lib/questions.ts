// V1 thin-slice: 5 questions for AI Readiness audit template
// Using @scorekit/core types
import type { DiagnosticQuestion, ScoredOption } from "@scorekit/core";

export type Question = DiagnosticQuestion;

export const questions: Question[] = [
  {
    id: "q1",
    pillarId: "strategy",
    text: "How clear is your AI strategy?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "No AI strategy exists" },
      { value: 2, label: "Informal discussions only" },
      { value: 3, label: "Draft strategy in progress" },
      { value: 4, label: "Documented and communicated" },
      { value: 5, label: "Fully integrated with business strategy" },
    ] as ScoredOption[],
  },
  {
    id: "q2",
    pillarId: "tools",
    text: "What AI tools does your team currently use?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "None" },
      { value: 2, label: "Free tools (ChatGPT free tier)" },
      { value: 3, label: "Paid tools for some team members" },
      { value: 4, label: "Standardised toolset across team" },
      { value: 5, label: "Custom AI integrations in workflows" },
    ] as ScoredOption[],
  },
  {
    id: "q3",
    pillarId: "skills",
    text: "How would you rate your team's AI skills?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "No training or experience" },
      { value: 2, label: "Self-taught basics" },
      { value: 3, label: "Some formal training" },
      { value: 4, label: "Regular upskilling programme" },
      { value: 5, label: "Deep expertise with ongoing development" },
    ] as ScoredOption[],
  },
  {
    id: "q4",
    pillarId: "systems",
    text: "How integrated is AI into your daily workflows?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Not at all" },
      { value: 2, label: "Ad-hoc use by individuals" },
      { value: 3, label: "Some documented processes" },
      { value: 4, label: "Embedded in key workflows" },
      { value: 5, label: "Fully automated where appropriate" },
    ] as ScoredOption[],
  },
  {
    id: "q5",
    pillarId: "data",
    text: "How ready is your data for AI applications?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Data is scattered and unstructured" },
      { value: 2, label: "Some data is organised" },
      { value: 3, label: "Key datasets are clean and accessible" },
      { value: 4, label: "Data pipelines established" },
      { value: 5, label: "AI-ready data infrastructure" },
    ] as ScoredOption[],
  },
];

export function calculateScore(answers: Record<string, number>): {
  total: number;
  max: number;
  percentage: number;
  pillarScores: Record<string, number>;
  band: string;
} {
  const pillarScores: Record<string, number> = {};
  let total = 0;

  for (const q of questions) {
    const answer = answers[q.id] || 1;
    total += answer;
    if (q.pillarId) {
      pillarScores[q.pillarId] = answer;
    }
  }

  const max = questions.length * 5;
  const percentage = Math.round((total / max) * 100);

  let band: string;
  if (percentage >= 80) band = "Leader";
  else if (percentage >= 60) band = "Progressing";
  else if (percentage >= 40) band = "Emerging";
  else band = "Starting";

  return { total, max, percentage, pillarScores, band };
}
