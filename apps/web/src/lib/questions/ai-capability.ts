// AI Capability assessment — pillar-grouped questions (assessment v1.1).
// 17 questions total: 13 diagnostic (5 options each, values 1–5) + 2 free-text
// context + 2 demographic context.
//
// Per-dimension diagnostic counts: foundations 2 · practical-craft 2 ·
// critical-evaluation 2 · workflow-integration 2 · responsible-use 3 ·
// building-scaling 2.
//
// All diagnostic wording is VERBATIM from the live Tally form KYRAMA v1.1
// (the source-of-truth instrument for the managed path). House style for the
// question copy: no em-dashes. Keep this file in lockstep with the live form —
// the free ScoreKit path and the managed Tally path must be the same instrument.
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
    questionIds: ["safe-1", "safe-2", "safe-3"],
  },
  {
    id: "building-scaling",
    name: "Building & scaling",
    description: "Creating AI-powered tools and workflows others can use.",
    type: "pillar",
    questionIds: ["build-1", "build-2"],
  },
  {
    id: "context-words",
    name: "In your own words",
    description: "Two quick questions about your real experience with AI. The first helps ground your report in actual work.",
    type: "context",
    questionIds: ["ctx-recent-work", "ctx-frustration"],
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
      { value: 5, label: "I teach this to others, adapting the explanation to their background, and I anticipate failure modes before they arise" },
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
      { value: 1, label: "I'm not sure, it catches me off guard too" },
      { value: 2, label: "I'd say AI sometimes makes mistakes, but I couldn't explain why in detail" },
      { value: 3, label: "I'd explain that AI predicts plausible responses based on patterns, not facts, so it sounds confident even when it's guessing" },
      { value: 4, label: "I'd give a precise explanation tailored to their background and point to the specific conditions that make this more or less likely" },
      { value: 5, label: "I explain this regularly, in different ways for different audiences, and use it to predict where AI will struggle before it does" },
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
      { value: 4, label: "Systematically iterate using different techniques: role, examples, constraints, decomposition" },
      { value: 5, label: "I have a method I could teach: I can diagnose why an output missed and know which technique will fix it" },
    ] as ScoredOption[],
  },
  {
    // NEW in v1.1 — replaces the old usage-frequency question with a
    // prompt-construction craft question.
    id: "craft-2",
    pillarId: "practical-craft",
    text: "Think about how you brief an AI tool on a substantial piece of work. What typically goes into your prompt?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "I type my question or request and see what comes back" },
      { value: 2, label: "I add some background or rephrase if the first attempt misses" },
      { value: 3, label: "I usually include context, the format I want, and an example where it helps" },
      { value: 4, label: "I construct prompts deliberately: role, context, constraints, examples, and I break large tasks into steps" },
      { value: 5, label: "I keep a refined set of reusable prompts and patterns, and I've shown others how to brief AI well" },
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
      { value: 1, label: "Send it: if it reads well, it's good enough" },
      { value: 2, label: "Skim it quickly and fix any obvious issues" },
      { value: 3, label: "Read it carefully and verify every factual claim before putting my name to it" },
      { value: 4, label: "Read it carefully, verify facts, rewrite AI-tell phrases, and check the tone is right for this specific client" },
      { value: 5, label: "I apply a consistent review routine matched to the stakes, and I've helped colleagues adopt the same standard" },
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
      { value: 1, label: "Use it: if the AI has cited a source, it's probably accurate" },
      { value: 2, label: "Note I should probably check it, but include it if I'm short on time" },
      { value: 3, label: "Always verify statistics independently, since AI-generated citations can be fabricated" },
      { value: 4, label: "Verify the stat, check the source exists and says what's claimed, and consider whether it's the most authoritative source available" },
      { value: 5, label: "I audit AI-drafted documents claim by claim, and colleagues ask me to sanity-check theirs" },
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
      { value: 1, label: "None, I haven't applied AI to it" },
      { value: 2, label: "A small part: AI helps with one or two steps" },
      { value: 3, label: "A significant portion: AI handles the heavy lifting and I focus on review and direction" },
      { value: 4, label: "I've fundamentally redesigned how I do it, with AI embedded throughout" },
      { value: 5, label: "I've redesigned it end to end, and I can show others how to rebuild their own workflows the same way" },
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
      { value: 3, label: "It's a core part of how I work, I'd notice its absence immediately" },
      { value: 4, label: "I've fundamentally changed how I operate: AI handles the heavy lifting on routine tasks and I focus on higher-value work" },
      { value: 5, label: "I've redesigned how I operate, and I actively help others design their own ways of working with AI" },
    ] as ScoredOption[],
  },

  // ===========================================================================
  // DIMENSION 5: Responsible & safe use (three questions in v1.1)
  // ===========================================================================
  {
    id: "safe-1",
    pillarId: "responsible-use",
    text: "A colleague sends you client data to use as context in an AI prompt. What do you do?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Paste it straight in, getting a good result is what matters" },
      { value: 2, label: "Feel uncertain: I'm not sure whether this is okay" },
      { value: 3, label: "Check our data handling guidelines and only proceed if the data type is permitted" },
      { value: 4, label: "Apply my own framework: consider data sensitivity, whether the AI environment is enterprise-approved, and whether there's a lower-risk way to get the same result" },
      { value: 5, label: "Apply my framework and help set the standard others follow. I can explain why the rules exist, not just what they say" },
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
      { value: 3, label: "I follow clear guidelines about what I can and can't include, and I know what's safe and what isn't" },
      { value: 4, label: "I have a clear framework for data handling and apply it consistently, including knowing when to use private vs shared AI environments" },
      { value: 5, label: "I help shape how my organisation handles data in AI, designing and explaining the guidelines others follow" },
    ] as ScoredOption[],
  },
  {
    // NEW in v1.1 — outputs, ownership, and disclosure.
    id: "safe-3",
    pillarId: "responsible-use",
    text: "AI has helped you draft something that will go to a client under your name. How do you think about responsibility for it?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "Once it reads well, it's ready. The AI did the work" },
      { value: 2, label: "I feel slightly uneasy about how much of it is AI-drafted, but I send it anyway" },
      { value: 3, label: "I review it properly and take full responsibility for the content before it goes out" },
      { value: 4, label: "I own every judgement in it, and I think about when it's right to say AI was involved" },
      { value: 5, label: "I've helped define how we use and disclose AI in client work, including where it shouldn't be used at all" },
    ] as ScoredOption[],
  },

  // ===========================================================================
  // DIMENSION 6: Building & scaling
  // ===========================================================================
  {
    id: "build-1",
    pillarId: "building-scaling",
    text: "Have you built anything using AI (a workflow, automation, prompt template, or tool) that saves time for you or your colleagues?",
    category: "diagnostic",
    questionType: "maturity",
    inputType: "radio",
    options: [
      { value: 1, label: "No, I haven't tried this" },
      { value: 2, label: "I've experimented with simple automations or prompt templates for myself" },
      { value: 3, label: "I've built something that others use or that runs automatically" },
      { value: 4, label: "I regularly build and iterate on AI-powered tools and workflows that others rely on" },
      { value: 5, label: "I design tools that are documented and maintained, and I teach others to build their own" },
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
      { value: 4, label: "Design it to be maintainable and scalable, with error handling, documentation, and a plan for how it evolves" },
      { value: 5, label: "Build it to last and teach others to build their own. I'm growing the team's capability, not just sharing a tool" },
    ] as ScoredOption[],
  },

  // ===========================================================================
  // CONTEXT: In your own words (free text — not scored; rendered in the
  // report/PDF "Your Profile" section)
  // ===========================================================================
  {
    id: "ctx-recent-work",
    text: "What's the most recent piece of real work you used AI for? A sentence or two is plenty.",
    helpText: "For example: drafting a client proposal, summarising interview notes, building a shortlist",
    category: "context",
    // No dedicated "usage evidence" ContextQuestionType exists; "trigger" is
    // the closest fit (recent concrete context). Purely informational — the
    // renderer keys off category + inputType.
    questionType: "trigger",
    inputType: "text",
    required: true,
  },
  {
    id: "ctx-frustration",
    text: "What's your biggest frustration with AI at work right now?",
    helpText: "Optional: whatever comes to mind",
    category: "context",
    questionType: "pain",
    inputType: "text",
    required: false,
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
