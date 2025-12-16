// AI Readiness assessment template with pillar-grouped questions
// 30 questions total: 6 context + 24 diagnostic
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
    questionIds: ["ctx-role", "ctx-employees", "ctx-industry", "ctx-trigger"],
  },
  {
    id: "leadership",
    name: "Leadership & Vision",
    description: "Assess executive commitment, strategy clarity, and investment appetite.",
    type: "pillar",
    questionIds: ["lead-1", "lead-2", "lead-3", "lead-4", "lead-5"],
  },
  {
    id: "data",
    name: "Data & Infrastructure",
    description: "Evaluate data quality, accessibility, and technical readiness.",
    type: "pillar",
    questionIds: ["data-1", "data-2", "data-3", "data-4", "data-5"],
  },
  {
    id: "people",
    name: "People & Skills",
    description: "Gauge in-house expertise, training, and access to talent.",
    type: "pillar",
    questionIds: ["people-1", "people-2", "people-3", "people-4", "people-5"],
  },
  {
    id: "process",
    name: "Process & Operations",
    description: "Assess automation readiness and use case identification.",
    type: "pillar",
    questionIds: ["process-1", "process-2", "process-3", "process-4", "process-5"],
  },
  {
    id: "culture",
    name: "Culture & Experimentation",
    description: "Measure risk tolerance, learning culture, and speed of adoption.",
    type: "pillar",
    questionIds: ["culture-1", "culture-2", "culture-3", "culture-4"],
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
  // =============================================================================
  // CONTEXT: About Your Business (4 questions)
  // =============================================================================
  {
    id: "ctx-role",
    text: "What best describes your role?",
    category: "context",
    questionType: "demographics",
    inputType: "select",
    options: [
      { id: "founder", label: "Founder / CEO" },
      { id: "c-suite", label: "C-Suite Executive" },
      { id: "director", label: "Director / VP" },
      { id: "manager", label: "Manager / Team Lead" },
      { id: "individual", label: "Individual Contributor" },
      { id: "consultant", label: "Consultant / Advisor" },
    ] as UnscoredOption[],
  },
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
      { id: "media", label: "Media / Entertainment" },
      { id: "education", label: "Education" },
      { id: "other", label: "Other" },
    ] as UnscoredOption[],
  },
  {
    id: "ctx-trigger",
    text: "Why are you exploring AI readiness now?",
    category: "context",
    questionType: "trigger",
    inputType: "select",
    options: [
      { id: "competitive", label: "Competitors are pulling ahead" },
      { id: "efficiency", label: "Need to improve efficiency" },
      { id: "growth", label: "Preparing for growth" },
      { id: "mandate", label: "Board or leadership mandate" },
      { id: "curiosity", label: "General curiosity" },
      { id: "other", label: "Other" },
    ] as UnscoredOption[],
  },

  // =============================================================================
  // PILLAR 1: Leadership & Vision (5 questions)
  // =============================================================================
  {
    id: "lead-1",
    pillarId: "leadership",
    text: "How clear is your organisation's AI strategy?",
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
    id: "lead-2",
    pillarId: "leadership",
    text: "How engaged is your executive team with AI initiatives?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Not engaged — AI is not on the agenda" },
      { value: 2, label: "Aware but passive" },
      { value: 3, label: "Interested and asking questions" },
      { value: 4, label: "Actively sponsoring initiatives" },
      { value: 5, label: "Driving AI as a strategic priority" },
    ] as ScoredOption[],
  },
  {
    id: "lead-3",
    pillarId: "leadership",
    text: "Is there a clear owner or sponsor for AI initiatives?",
    category: "diagnostic",
    questionType: "specificity",
    inputType: "radio",
    options: [
      { value: 1, label: "No — no one owns this" },
      { value: 2, label: "Informal — someone has taken interest" },
      { value: 3, label: "Partial — shared responsibility" },
      { value: 4, label: "Yes — named owner with some authority" },
      { value: 5, label: "Yes — executive sponsor with budget and mandate" },
    ] as ScoredOption[],
  },
  {
    id: "lead-4",
    pillarId: "leadership",
    text: "How much has your organisation invested in AI in the last 12 months?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Nothing" },
      { value: 2, label: "Minimal (free tools, individual subscriptions)" },
      { value: 3, label: "Moderate (team tools, some training)" },
      { value: 4, label: "Significant (dedicated budget, pilots)" },
      { value: 5, label: "Major (substantial budget, multiple initiatives)" },
    ] as ScoredOption[],
  },
  {
    id: "lead-5",
    pillarId: "leadership",
    text: "How aligned is your leadership team on AI priorities?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "No alignment — different views and priorities" },
      { value: 2, label: "Limited — some agreement but no consensus" },
      { value: 3, label: "Moderate — generally aligned on direction" },
      { value: 4, label: "Good — clear priorities with minor disagreements" },
      { value: 5, label: "Excellent — fully aligned and committed" },
    ] as ScoredOption[],
  },

  // =============================================================================
  // PILLAR 2: Data & Infrastructure (5 questions)
  // =============================================================================
  {
    id: "data-1",
    pillarId: "data",
    text: "How would you rate the quality of your organisation's data?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Poor — inconsistent, incomplete, unreliable" },
      { value: 2, label: "Fair — some quality issues" },
      { value: 3, label: "Good — mostly reliable with known gaps" },
      { value: 4, label: "Very good — well-maintained and trusted" },
      { value: 5, label: "Excellent — high quality with governance" },
    ] as ScoredOption[],
  },
  {
    id: "data-2",
    pillarId: "data",
    text: "Can your team easily access the data they need?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "No — data is siloed or locked away" },
      { value: 2, label: "Limited — requires IT requests" },
      { value: 3, label: "Partial — some self-service access" },
      { value: 4, label: "Good — most data accessible to those who need it" },
      { value: 5, label: "Excellent — full self-service with governance" },
    ] as ScoredOption[],
  },
  {
    id: "data-3",
    pillarId: "data",
    text: "How well integrated are your key data systems?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Not at all — systems are disconnected" },
      { value: 2, label: "Minimal — manual data transfers" },
      { value: 3, label: "Partial — some integrations exist" },
      { value: 4, label: "Good — most systems connected" },
      { value: 5, label: "Excellent — unified data platform" },
    ] as ScoredOption[],
  },
  {
    id: "data-4",
    pillarId: "data",
    text: "Do you have clear data governance policies?",
    category: "diagnostic",
    questionType: "specificity",
    inputType: "radio",
    options: [
      { value: 1, label: "No policies exist" },
      { value: 2, label: "Informal guidelines only" },
      { value: 3, label: "Some policies documented" },
      { value: 4, label: "Comprehensive policies in place" },
      { value: 5, label: "Policies enforced with regular review" },
    ] as ScoredOption[],
  },
  {
    id: "data-5",
    pillarId: "data",
    text: "How prepared is your infrastructure for AI workloads?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Not prepared — legacy systems only" },
      { value: 2, label: "Limited — basic cloud usage" },
      { value: 3, label: "Moderate — modern stack but not AI-ready" },
      { value: 4, label: "Good — can run AI workloads with some effort" },
      { value: 5, label: "Excellent — AI-ready infrastructure in place" },
    ] as ScoredOption[],
  },

  // =============================================================================
  // PILLAR 3: People & Skills (5 questions)
  // =============================================================================
  {
    id: "people-1",
    pillarId: "people",
    text: "How would you rate your team's general AI literacy?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Very low — most don't understand AI basics" },
      { value: 2, label: "Low — some awareness but limited understanding" },
      { value: 3, label: "Moderate — understand concepts, limited practice" },
      { value: 4, label: "Good — comfortable using AI tools" },
      { value: 5, label: "Excellent — can evaluate and implement AI solutions" },
    ] as ScoredOption[],
  },
  {
    id: "people-2",
    pillarId: "people",
    text: "Do you have access to AI expertise when needed?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "No — we have no AI expertise" },
      { value: 2, label: "Limited — occasional external support" },
      { value: 3, label: "Partial — one or two internal champions" },
      { value: 4, label: "Good — dedicated AI resource or team" },
      { value: 5, label: "Excellent — AI centre of excellence" },
    ] as ScoredOption[],
  },
  {
    id: "people-3",
    pillarId: "people",
    text: "How much AI training has your team received?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "None" },
      { value: 2, label: "Self-directed only (YouTube, articles)" },
      { value: 3, label: "Some formal training for individuals" },
      { value: 4, label: "Regular training programme in place" },
      { value: 5, label: "Comprehensive upskilling with certifications" },
    ] as ScoredOption[],
  },
  {
    id: "people-4",
    pillarId: "people",
    text: "How confident is your team in using AI tools?",
    category: "diagnostic",
    questionType: "capability",
    inputType: "radio",
    options: [
      { value: 1, label: "Not at all confident" },
      { value: 2, label: "Slightly confident" },
      { value: 3, label: "Somewhat confident" },
      { value: 4, label: "Fairly confident" },
      { value: 5, label: "Very confident" },
    ] as ScoredOption[],
  },
  {
    id: "people-5",
    pillarId: "people",
    text: "How easy is it to hire or access AI talent?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Very difficult — no success" },
      { value: 2, label: "Difficult — limited options" },
      { value: 3, label: "Moderate — can find talent with effort" },
      { value: 4, label: "Good — reasonable access to talent" },
      { value: 5, label: "Excellent — strong talent pipeline" },
    ] as ScoredOption[],
  },

  // =============================================================================
  // PILLAR 4: Process & Operations (5 questions)
  // =============================================================================
  {
    id: "process-1",
    pillarId: "process",
    text: "How integrated is AI into your daily workflows?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Not at all" },
      { value: 2, label: "Ad-hoc use by individuals" },
      { value: 3, label: "Used in some documented processes" },
      { value: 4, label: "Embedded in key workflows" },
      { value: 5, label: "Fully automated where appropriate" },
    ] as ScoredOption[],
  },
  {
    id: "process-2",
    pillarId: "process",
    text: "What AI tools does your team currently use?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "None" },
      { value: 2, label: "Free tools only (ChatGPT free tier, etc.)" },
      { value: 3, label: "Paid tools for some team members" },
      { value: 4, label: "Standardised toolset across the team" },
      { value: 5, label: "Custom AI integrations in workflows" },
    ] as ScoredOption[],
  },
  {
    id: "process-3",
    pillarId: "process",
    text: "How well documented are your AI use cases?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "No use cases identified" },
      { value: 2, label: "Informal ideas discussed" },
      { value: 3, label: "Some use cases documented" },
      { value: 4, label: "Prioritised backlog of use cases" },
      { value: 5, label: "Roadmap with business cases" },
    ] as ScoredOption[],
  },
  {
    id: "process-4",
    pillarId: "process",
    text: "How do you measure the impact of AI initiatives?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "We don't measure" },
      { value: 2, label: "Anecdotal feedback only" },
      { value: 3, label: "Some metrics tracked informally" },
      { value: 4, label: "Clear KPIs for each initiative" },
      { value: 5, label: "Comprehensive measurement with regular review" },
    ] as ScoredOption[],
  },
  {
    id: "process-5",
    pillarId: "process",
    text: "How quickly can you iterate on AI implementations?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Very slow — changes take months" },
      { value: 2, label: "Slow — weeks to make adjustments" },
      { value: 3, label: "Moderate — can iterate in days" },
      { value: 4, label: "Fast — same-day changes possible" },
      { value: 5, label: "Very fast — continuous improvement built in" },
    ] as ScoredOption[],
  },

  // =============================================================================
  // PILLAR 5: Culture & Experimentation (4 questions)
  // =============================================================================
  {
    id: "culture-1",
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
      { value: 5, label: "Failure is celebrated as a learning opportunity" },
    ] as ScoredOption[],
  },
  {
    id: "culture-2",
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
  {
    id: "culture-3",
    pillarId: "culture",
    text: "How open is your team to changing how they work?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Very resistant — 'we've always done it this way'" },
      { value: 2, label: "Skeptical — need convincing" },
      { value: 3, label: "Open-minded — willing to try new approaches" },
      { value: 4, label: "Enthusiastic — actively seeking improvements" },
      { value: 5, label: "Champions of change — driving adoption" },
    ] as ScoredOption[],
  },
  {
    id: "culture-4",
    pillarId: "culture",
    text: "How effectively does your organisation share learnings?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Not at all — knowledge stays siloed" },
      { value: 2, label: "Rarely — occasional informal sharing" },
      { value: 3, label: "Sometimes — team meetings or docs" },
      { value: 4, label: "Often — regular knowledge sharing sessions" },
      { value: 5, label: "Systematically — documented and accessible to all" },
    ] as ScoredOption[],
  },

  // =============================================================================
  // CONTEXT: Your Goals (2 questions)
  // =============================================================================
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
      { id: "leadership", label: "Lack of leadership support" },
      { id: "tools", label: "Too many tools, unclear which to use" },
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
