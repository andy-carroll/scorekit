// AI Capability assessment — pillar-grouped questions.
// 14 questions total: 12 diagnostic (2 per dimension, 5 options each) + 2 context.
//
// Diagnostic options 1–4 use the exact labels from the live Tally form KYRAMA
// (mapping to capability levels 1–4: Getting Started / Exploring / Applying /
// Integrating). The 5th option (value 5, level "Leading") is authored from the
// capability rubric — designing/teaching the practice for others.
//
// Exposes only the data arrays (`sections`, `questions`); shared types live in
// ./types and the scoring/lookup helpers live in ./index.
import type { ScoredOption, UnscoredOption } from "@scorekit/core";
import type { Question, Section } from "./types";

export const sections: Section[] = [
  {
    id: "foundations",
    name: "Foundations & mental model",
    description: "Whether you understand how AI systems actually work — and where they fail.",
    type: "pillar",
    questionIds: ["found-1", "found-2"],
  },
  {
    id: "practical-craft",
    name: "Practical craft",
    description: "Getting good results through iteration, framing, and technique.",
    type: "pillar",
    questionIds: ["craft-1", "craft-2"],
  },
  {
    id: "critical-evaluation",
    name: "Critical evaluation & judgement",
    description: "Evaluating AI output rather than accepting it at face value.",
    type: "pillar",
    questionIds: ["eval-1", "eval-2"],
  },
  {
    id: "workflow-integration",
    name: "Workflow integration & leverage",
    description: "How deeply AI is embedded in your day-to-day work.",
    type: "pillar",
    questionIds: ["flow-1", "flow-2"],
  },
  {
    id: "responsible-use",
    name: "Responsible & safe use",
    description: "Handling data, privacy, and appropriate use with judgement.",
    type: "pillar",
    questionIds: ["safe-1", "safe-2"],
  },
  {
    id: "building-scaling",
    name: "Building & scaling",
    description: "Creating AI-powered tools and workflows others can use.",
    type: "pillar",
    questionIds: ["build-1", "build-2"],
  },
  {
    id: "context-end",
    name: "A little about you",
    description: "Optional — helps tailor your results.",
    type: "context",
    questionIds: ["ctx-role", "ctx-org-ai"],
  },
];

export const questions: Question[] = [
  // ===========================================================================
  // DIMENSION 1: Foundations & mental model
  // ===========================================================================
  {
    id: "found-1",
    pillarId: "foundations",
    text: "How would you describe your understanding of what AI systems can and cannot do?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "I'm not sure how they work or where they fail" },
      { value: 2, label: "I have a general sense but I'm often surprised by their limits" },
      { value: 3, label: "I understand their capabilities and common failure modes well enough to set realistic expectations" },
      { value: 4, label: "I can explain the underlying mechanics and use that to anticipate failures before they happen" },
      { value: 5, label: "I teach this — I explain how these systems work in different ways for different people and anticipate failures before they arise" },
    ] as ScoredOption[],
  },
  {
    id: "found-2",
    pillarId: "foundations",
    text: "If a colleague asked you why an AI tool can sound confident while being completely wrong, what would you say?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "I'm not sure — it catches me off guard too" },
      { value: 2, label: "I'd say AI sometimes makes mistakes, but I couldn't explain why in detail" },
      { value: 3, label: "I'd explain that AI predicts plausible responses based on patterns, not facts — so it sounds confident even when it's guessing" },
      { value: 4, label: "I'd give a precise explanation tailored to their background and point to the specific conditions that make this more or less likely" },
      { value: 5, label: "I regularly help others grasp this — explaining it several ways for different audiences and using it to pre-empt where AI will struggle" },
    ] as ScoredOption[],
  },

  // ===========================================================================
  // DIMENSION 2: Practical craft
  // ===========================================================================
  {
    id: "craft-1",
    pillarId: "practical-craft",
    text: "When an AI tool's first response isn't quite right, what do you typically do?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Accept it or give up on the task" },
      { value: 2, label: "Ask again with slightly different wording" },
      { value: 3, label: "Reframe the task, add context, or break it into steps until I get what I need" },
      { value: 4, label: "Systematically iterate using different techniques — role, examples, constraints, decomposition" },
      { value: 5, label: "Work from reusable techniques I've refined, and pinpoint exactly which part of a prompt caused a poor result so I can fix it" },
    ] as ScoredOption[],
  },
  {
    id: "craft-2",
    pillarId: "practical-craft",
    text: "In the last two weeks, how often have you used AI tools in your actual day-to-day work (not just experimenting)?",
    category: "diagnostic",
    questionType: "frequency",
    inputType: "radio",
    options: [
      { value: 1, label: "Not at all" },
      { value: 2, label: "Once or twice" },
      { value: 3, label: "Several times a week" },
      { value: 4, label: "Daily, across multiple tasks" },
      { value: 5, label: "Daily and by design — I've deliberately chosen which tasks AI handles and keep refining how" },
    ] as ScoredOption[],
  },

  // ===========================================================================
  // DIMENSION 3: Critical evaluation & judgement
  // ===========================================================================
  {
    id: "eval-1",
    pillarId: "critical-evaluation",
    text: "You've asked AI to draft an email to a client. It reads well and sounds confident. What do you do before sending it?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Send it — if it reads well, it's good enough" },
      { value: 2, label: "Skim it quickly and fix any obvious issues" },
      { value: 3, label: "Read it carefully and verify every factual claim before putting my name to it" },
      { value: 4, label: "Read it carefully, verify facts, rewrite AI-tell phrases, and check the tone is right for this specific client" },
      { value: 5, label: "Apply a consistent review routine I've turned into checks my colleagues use too" },
    ] as ScoredOption[],
  },
  {
    id: "eval-2",
    pillarId: "critical-evaluation",
    text: "AI includes a specific statistic in a report you're preparing, with a source cited. What do you do?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Use it — if the AI has cited a source, it's probably accurate" },
      { value: 2, label: "Note I should probably check it, but include it if I'm short on time" },
      { value: 3, label: "Always verify statistics independently — I know AI-generated citations can be fabricated" },
      { value: 4, label: "Verify the stat, check the source exists and says what's claimed, and consider whether it's the most authoritative source available" },
      { value: 5, label: "I can audit a whole document and flag every claim that needs verification — and I've shown others how" },
    ] as ScoredOption[],
  },

  // ===========================================================================
  // DIMENSION 4: Workflow integration & leverage
  // ===========================================================================
  {
    id: "flow-1",
    pillarId: "workflow-integration",
    text: "Think about your most time-consuming recurring task. How much of it have you redesigned or handed off using AI?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "None — I haven't applied AI to it" },
      { value: 2, label: "A small part — AI helps with one or two steps" },
      { value: 3, label: "A significant portion — AI handles the heavy lifting and I focus on review and direction" },
      { value: 4, label: "I've fundamentally redesigned how I do it, with AI embedded throughout" },
      { value: 5, label: "I've redesigned it end to end and can teach others to architect their own AI-augmented workflows" },
    ] as ScoredOption[],
  },
  {
    id: "flow-2",
    pillarId: "workflow-integration",
    text: "Which best describes how AI fits into your work right now?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "I use it occasionally when I think of it" },
      { value: 2, label: "I reach for it regularly for specific types of tasks" },
      { value: 3, label: "It's a core part of how I work — I'd notice its absence immediately" },
      { value: 4, label: "I've fundamentally changed how I operate — AI handles the heavy lifting on routine tasks and I focus on higher-value work" },
      { value: 5, label: "I've redesigned how I work and actively help others design their own AI-augmented ways of working" },
    ] as ScoredOption[],
  },

  // ===========================================================================
  // DIMENSION 5: Responsible & safe use
  // ===========================================================================
  {
    id: "safe-1",
    pillarId: "responsible-use",
    text: "A colleague sends you client data to use as context in an AI prompt. What do you do?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Paste it straight in — getting a good result is what matters" },
      { value: 2, label: "Feel uncertain — I'm not sure whether this is okay" },
      { value: 3, label: "Check our data handling guidelines and only proceed if the data type is permitted" },
      { value: 4, label: "Apply my own framework: consider data sensitivity, whether the AI environment is enterprise-approved, and whether there's a lower-risk way to get the same result" },
      { value: 5, label: "Apply my framework and help set the standard others follow — I can explain why the rules exist, not just what they say" },
    ] as ScoredOption[],
  },
  {
    id: "safe-2",
    pillarId: "responsible-use",
    text: "When using AI for work, how do you handle confidential or sensitive information?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "I include whatever is needed to get a good result" },
      { value: 2, label: "I try to be careful but I'm not always sure what's safe to include" },
      { value: 3, label: "I follow clear guidelines about what I can and can't include — I know what's safe and what isn't" },
      { value: 4, label: "I have a clear framework for data handling and apply it consistently — including knowing when to use private vs. shared AI environments" },
      { value: 5, label: "I help shape how my organisation handles data in AI — designing and explaining the guidelines others follow" },
    ] as ScoredOption[],
  },

  // ===========================================================================
  // DIMENSION 6: Building & scaling
  // ===========================================================================
  {
    id: "build-1",
    pillarId: "building-scaling",
    text: "Have you built anything using AI — a workflow, automation, prompt template, or tool — that saves time for you or your colleagues?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "No, I haven't tried this" },
      { value: 2, label: "I've experimented with simple automations or prompt templates for myself" },
      { value: 3, label: "I've built something that others use or that runs automatically" },
      { value: 4, label: "I regularly build and iterate on AI-powered tools and workflows that others rely on" },
      { value: 5, label: "I design maintainable, scalable tools others depend on — with documentation and a plan for how they evolve — and help others learn to build" },
    ] as ScoredOption[],
  },
  {
    id: "build-2",
    pillarId: "building-scaling",
    text: "When something you've built with AI works well, what do you typically do with it?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Keep using it myself until it breaks or I find something better" },
      { value: 2, label: "Share it informally if someone asks" },
      { value: 3, label: "Document it so colleagues can use it reliably without needing me to explain it each time" },
      { value: 4, label: "Design it to be maintainable and scalable — with error handling, documentation, and a plan for how it evolves" },
      { value: 5, label: "Build it to last and teach others to build their own — I'm growing the team's capability, not just shipping a tool" },
    ] as ScoredOption[],
  },

  // ===========================================================================
  // CONTEXT: A little about you (optional)
  // ===========================================================================
  {
    id: "ctx-role",
    text: "What is your role type?",
    category: "context",
    questionType: "demographics",
    inputType: "select",
    required: false,
    options: [
      { id: "ic", label: "Individual contributor (specialist / professional)" },
      { id: "lead", label: "Team lead or manager" },
      { id: "senior", label: "Senior leader or director" },
      { id: "other", label: "Other" },
    ] as UnscoredOption[],
  },
  {
    id: "ctx-org-ai",
    text: "Which best describes your organisation's current relationship with AI tools?",
    category: "context",
    questionType: "demographics",
    inputType: "select",
    required: false,
    options: [
      { id: "not-started", label: "We haven't really started yet" },
      { id: "informal", label: "Some people use AI informally, but it's not coordinated" },
      { id: "active", label: "We have active AI initiatives underway" },
      { id: "central", label: "AI is central to how we operate" },
    ] as UnscoredOption[],
  },
];
