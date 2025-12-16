// V1 thin-slice: 5 questions for AI Readiness audit template
export interface Question {
  id: string;
  text: string;
  pillar: string;
  options: { value: number; label: string }[];
}

export const questions: Question[] = [
  {
    id: "q1",
    pillar: "Strategy",
    text: "How clear is your AI strategy?",
    options: [
      { value: 1, label: "No AI strategy exists" },
      { value: 2, label: "Informal discussions only" },
      { value: 3, label: "Draft strategy in progress" },
      { value: 4, label: "Documented and communicated" },
      { value: 5, label: "Fully integrated with business strategy" },
    ],
  },
  {
    id: "q2",
    pillar: "Tools",
    text: "What AI tools does your team currently use?",
    options: [
      { value: 1, label: "None" },
      { value: 2, label: "Free tools (ChatGPT free tier)" },
      { value: 3, label: "Paid tools for some team members" },
      { value: 4, label: "Standardised toolset across team" },
      { value: 5, label: "Custom AI integrations in workflows" },
    ],
  },
  {
    id: "q3",
    pillar: "Skills",
    text: "How would you rate your team's AI skills?",
    options: [
      { value: 1, label: "No training or experience" },
      { value: 2, label: "Self-taught basics" },
      { value: 3, label: "Some formal training" },
      { value: 4, label: "Regular upskilling programme" },
      { value: 5, label: "Deep expertise with ongoing development" },
    ],
  },
  {
    id: "q4",
    pillar: "Systems",
    text: "How integrated is AI into your daily workflows?",
    options: [
      { value: 1, label: "Not at all" },
      { value: 2, label: "Ad-hoc use by individuals" },
      { value: 3, label: "Some documented processes" },
      { value: 4, label: "Embedded in key workflows" },
      { value: 5, label: "Fully automated where appropriate" },
    ],
  },
  {
    id: "q5",
    pillar: "Data",
    text: "How ready is your data for AI applications?",
    options: [
      { value: 1, label: "Data is scattered and unstructured" },
      { value: 2, label: "Some data is organised" },
      { value: 3, label: "Key datasets are clean and accessible" },
      { value: 4, label: "Data pipelines established" },
      { value: 5, label: "AI-ready data infrastructure" },
    ],
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
    pillarScores[q.pillar] = answer;
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
