// AI Readiness assessment template with pillar-grouped questions
// Using @scorekit/core types
import type { DiagnosticQuestion, ContextQuestion, ScoredOption, UnscoredOption } from "@scorekit/core";

export type Question = DiagnosticQuestion | ContextQuestion;

// Section definitions for pillar-grouped flow
export interface Section {
  id: string;
  name: string;
  description: string;
  type: "context" | "pillar";
  questionIds: string[];
}

export const sections: Section[] = [
  {
    id: "context-start",
    name: "About Your Business",
    description: "A few quick questions to personalise your report.",
    type: "context",
    questionIds: ["ctx-employees", "ctx-industry"],
  },
  {
    id: "leadership",
    name: "Leadership & Vision",
    description: "Assess executive commitment, strategy clarity, and investment appetite.",
    type: "pillar",
    questionIds: ["q1", "q2"],
  },
  {
    id: "data",
    name: "Data & Infrastructure",
    description: "Evaluate data quality, accessibility, and technical readiness.",
    type: "pillar",
    questionIds: ["q3", "q4"],
  },
  {
    id: "people",
    name: "People & Skills",
    description: "Gauge in-house expertise, training, and access to talent.",
    type: "pillar",
    questionIds: ["q5", "q6"],
  },
  {
    id: "process",
    name: "Process & Operations",
    description: "Assess automation readiness and use case identification.",
    type: "pillar",
    questionIds: ["q7", "q8"],
  },
  {
    id: "culture",
    name: "Culture & Experimentation",
    description: "Measure risk tolerance, learning culture, and speed of adoption.",
    type: "pillar",
    questionIds: ["q9", "q10"],
  },
  {
    id: "context-end",
    name: "Your Goals",
    description: "Help us understand what success looks like for you.",
    type: "context",
    questionIds: ["ctx-pain", "ctx-aspiration"],
  },
];

export const questions: Question[] = [
  // Context: About Your Business
  {
    id: "ctx-employees",
    text: "How many employees does your company have?",
    category: "context",
    questionType: "demographics",
    inputType: "select",
    options: [
      { id: "1-10", label: "1–10" },
      { id: "11-50", label: "11–50" },
      { id: "51-200", label: "51–200" },
      { id: "201-500", label: "201–500" },
      { id: "500+", label: "500+" },
    ] as UnscoredOption[],
  },
  {
    id: "ctx-industry",
    text: "What industry are you in?",
    category: "context",
    questionType: "demographics",
    inputType: "select",
    options: [
      { id: "tech", label: "Technology / Software" },
      { id: "finance", label: "Financial Services" },
      { id: "healthcare", label: "Healthcare" },
      { id: "manufacturing", label: "Manufacturing" },
      { id: "retail", label: "Retail / E-commerce" },
      { id: "professional", label: "Professional Services" },
      { id: "other", label: "Other" },
    ] as UnscoredOption[],
  },

  // Pillar 1: Leadership & Vision
  {
    id: "q1",
    pillarId: "leadership",
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
    pillarId: "leadership",
    text: "How often does leadership discuss AI in strategy meetings?",
    category: "diagnostic",
    questionType: "frequency",
    inputType: "radio",
    options: [
      { value: 1, label: "Never" },
      { value: 2, label: "Rarely (once or twice a year)" },
      { value: 3, label: "Sometimes (quarterly)" },
      { value: 4, label: "Often (monthly)" },
      { value: 5, label: "Always (every meeting)" },
    ] as ScoredOption[],
  },

  // Pillar 2: Data & Infrastructure
  {
    id: "q3",
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
  {
    id: "q4",
    pillarId: "data",
    text: "Can your team easily access the data they need?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "No — data is siloed or locked away" },
      { value: 2, label: "Limited — requires IT requests" },
      { value: 3, label: "Partial — some self-service access" },
      { value: 4, label: "Good — most data accessible" },
      { value: 5, label: "Excellent — full self-service with governance" },
    ] as ScoredOption[],
  },

  // Pillar 3: People & Skills
  {
    id: "q5",
    pillarId: "people",
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
    id: "q6",
    pillarId: "people",
    text: "Do you have access to AI expertise when needed?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "No — we have no AI expertise" },
      { value: 2, label: "Limited — occasional contractor support" },
      { value: 3, label: "Partial — one or two internal champions" },
      { value: 4, label: "Good — dedicated AI resource" },
      { value: 5, label: "Excellent — AI team or centre of excellence" },
    ] as ScoredOption[],
  },

  // Pillar 4: Process & Operations
  {
    id: "q7",
    pillarId: "process",
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
    id: "q8",
    pillarId: "process",
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

  // Pillar 5: Culture & Experimentation
  {
    id: "q9",
    pillarId: "culture",
    text: "How does your organisation respond to failed experiments?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Failure is penalised or hidden" },
      { value: 2, label: "Failure is tolerated but not discussed" },
      { value: 3, label: "Failure is accepted as part of innovation" },
      { value: 4, label: "Failure is analysed for learnings" },
      { value: 5, label: "Failure is celebrated as learning opportunity" },
    ] as ScoredOption[],
  },
  {
    id: "q10",
    pillarId: "culture",
    text: "How quickly can your team try new AI tools or approaches?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Very slow — months of approval required" },
      { value: 2, label: "Slow — weeks of process" },
      { value: 3, label: "Moderate — can pilot in days" },
      { value: 4, label: "Fast — can test same day" },
      { value: 5, label: "Very fast — experimentation is encouraged" },
    ] as ScoredOption[],
  },

  // Context: Your Goals
  {
    id: "ctx-pain",
    text: "What are your biggest frustrations with AI adoption?",
    helpText: "Select all that apply",
    category: "context",
    questionType: "pain",
    inputType: "multi-select",
    options: [
      { id: "budget", label: "Lack of budget" },
      { id: "skills", label: "Lack of skills" },
      { id: "time", label: "Lack of time" },
      { id: "strategy", label: "Unclear where to start" },
      { id: "data", label: "Data quality issues" },
      { id: "culture", label: "Resistance to change" },
    ] as UnscoredOption[],
  },
  {
    id: "ctx-aspiration",
    text: "What would success look like in 12 months?",
    helpText: "Be as specific as possible",
    category: "context",
    questionType: "aspiration",
    inputType: "text",
  },
];

// Helper to get questions for a section
export function getQuestionsForSection(sectionId: string): Question[] {
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return [];
  return section.questionIds
    .map((qId) => questions.find((q) => q.id === qId))
    .filter((q): q is Question => q !== undefined);
}

// Get pillar sections only (excluding context)
export function getPillarSections(): Section[] {
  return sections.filter((s) => s.type === "pillar");
}

export function calculateScore(answers: Record<string, number>): {
  total: number;
  max: number;
  percentage: number;
  pillarScores: Record<string, number>;
  band: string;
} {
  const pillarScores: Record<string, number> = {};
  const pillarTotals: Record<string, { sum: number; count: number }> = {};
  let total = 0;
  let scoredQuestionCount = 0;

  // Only score diagnostic questions (those with pillarId)
  for (const q of questions) {
    if (q.category === "diagnostic" && "pillarId" in q && q.pillarId) {
      const answer = typeof answers[q.id] === "number" ? answers[q.id] : 1;
      total += answer;
      scoredQuestionCount++;

      // Accumulate pillar scores
      if (!pillarTotals[q.pillarId]) {
        pillarTotals[q.pillarId] = { sum: 0, count: 0 };
      }
      pillarTotals[q.pillarId].sum += answer;
      pillarTotals[q.pillarId].count++;
    }
  }

  // Calculate average score per pillar (1-5 scale)
  for (const [pillarId, { sum, count }] of Object.entries(pillarTotals)) {
    pillarScores[pillarId] = Math.round((sum / count) * 10) / 10; // Round to 1 decimal
  }

  const max = scoredQuestionCount * 5;
  const percentage = max > 0 ? Math.round((total / max) * 100) : 0;

  let band: string;
  if (percentage >= 80) band = "Leader";
  else if (percentage >= 60) band = "Progressing";
  else if (percentage >= 40) band = "Emerging";
  else band = "Starting";

  return { total, max, percentage, pillarScores, band };
}
