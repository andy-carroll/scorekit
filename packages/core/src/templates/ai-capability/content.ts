/**
 * AI Capability Assessment — Report Content (Tier 1, generic AX-branded)
 *
 * A six-dimension, five-level individual AI capability benchmark.
 * All deterministic report copy lives here. The consultant-quality narrative
 * layer (Tier 2) is generated separately by the Wren skill and is not part of
 * this open-source template.
 *
 * Dimensions (pillars):
 *   foundations · practical-craft · critical-evaluation ·
 *   workflow-integration · responsible-use · building-scaling
 *
 * Capability levels / bands: Getting Started → Exploring → Applying →
 *   Integrating → Leading. Band `name` values MUST match `bandIntros` keys.
 */

// Reuse the canonical TemplateContent type (type-only import — no runtime cycle).
import type { TemplateContent } from "../ai-readiness/content";

export const aiCapabilityContent: TemplateContent = {
  meta: {
    templateId: "ai-capability",
    templateName: "AI Capability Assessment",
    version: "1.0.0",
    pageTitle: "AI Capability Assessment | Accelerator-X",
    description:
      "Benchmark your individual AI capability across six dimensions — from foundations to building for others — and get clear, prioritised next steps.",
    reportTitle: "AI Capability Report",
  },

  brand: {
    name: "Accelerator-X",
    logoPath: "/logos/accelerator-x.png",
    logo: {
      light: "/logos/accelerator-x.png",
      dark: "/logos/accelerator-x.png",
    },
    faviconPath: "/favicons/accelerator-x.png",
    ogImageUrl: "https://accelerator-x.ai/assets/images/og-image-1200.png",
    colors: {
      primary: "#0aadce",
      primaryHover: "#089bb8",
      secondary: "#1b2a4a",
      highlight: "#fea700",
      accentTeal: "#0aadce",
      accentPink: "#e93f8e",
      bgDark: "#1b2a4a",
      text: "#1b2a4a",
      mutedText: "#64748b",
      background: "#ffffff",
      surface: "#f8fafc",
    },
    typography: {
      displayFont: "Aptos",
      bodyFont: "Aptos",
    },
  },

  landing: {
    headline: "How capable are you with AI?",
    subheadline:
      "A 5-minute benchmark across six dimensions of practical AI capability. See where you stand today and exactly what to develop next.",
    ctaText: "Start the Assessment",
    timeEstimate: "5–10 minutes",
    valueProps: [
      {
        title: "Your capability profile",
        body: "See how you score across foundations, craft, judgement, workflow, responsible use, and building for others.",
        accent: "teal",
      },
      {
        title: "Honest, specific insight",
        body: "Understand what your strongest dimension is really doing for you — and which gap is holding the rest back.",
        accent: "purple",
      },
      {
        title: "Prioritised next steps",
        body: "Get concrete actions you can start this week, ranked for your current level.",
        accent: "pink",
      },
    ],
    trustLine:
      "Used in Accelerator-X AI transformation programmes to benchmark individual capability and track growth.",
  },

  report: {
    sectionHeadings: {
      pillarScores: "Your capability by dimension",
      keyInsights: "Key insights",
      nextSteps: "Your next steps",
      howWeScore: "How we calculated your scores",
    },
  },

  // Five capability levels. minScore inclusive, maxScore exclusive (top band
  // inclusive at 100). Thresholds are indicative — validate against the real
  // score distribution once a cohort has completed the assessment.
  bands: [
    { id: "getting-started", name: "Getting Started", minScore: 0, maxScore: 20, color: "#ef4444" },
    { id: "exploring", name: "Exploring", minScore: 20, maxScore: 40, color: "#f59e0b" },
    { id: "applying", name: "Applying", minScore: 40, maxScore: 65, color: "#3b82f6" },
    { id: "integrating", name: "Integrating", minScore: 65, maxScore: 85, color: "#8b5cf6" },
    { id: "leading", name: "Leading", minScore: 85, maxScore: 100, color: "#22c55e" },
  ],

  bandIntros: {
    "Getting Started": {
      headline: "You're at the start — and you now know where to aim",
      intro:
        "AI is still largely unfamiliar territory, and that's a perfectly normal place to begin. What separates people who progress quickly from those who stall is knowing where to focus first. This report shows you the few habits that will move you furthest, fastest — without needing to learn everything at once.",
    },
    Exploring: {
      headline: "You're experimenting — now it's time to build instincts",
      intro:
        "You've started using AI and you're developing a feel for it, but your approach is still hit and miss. That's the exploring stage: enough awareness to know AI can help, not yet enough method to get reliable results. This report points you towards the techniques and judgement that turn experimentation into dependable practice.",
    },
    Applying: {
      headline: "You're getting reliable results — let's make them repeatable",
      intro:
        "You use AI competently on familiar tasks and understand enough to avoid the obvious traps. The next step is consistency under less familiar conditions: a clearer toolkit, sharper judgement about when to trust output, and the start of building things others can use. This report shows you where that next level lies.",
    },
    Integrating: {
      headline: "AI is part of how you work — now multiply it",
      intro:
        "You've embedded AI into your day-to-day work and you handle new situations with method, not guesswork. The highest-leverage move from here is shifting from personal productivity to multiplying capability around you — building, documenting, and teaching. This report highlights where to direct that next.",
    },
    Leading: {
      headline: "You're operating at the leading edge — keep shaping the practice",
      intro:
        "You design systems and practices that lift the capability of others, not just yourself. That's rare. Leadership here isn't a finish line — the field moves fast. This report flags where to extend your advantage and which dimensions, if any, lag behind your strongest.",
    },
  },

  pillarLabels: {
    foundations: "Foundations & mental model",
    "practical-craft": "Practical craft",
    "critical-evaluation": "Critical evaluation & judgement",
    "workflow-integration": "Workflow integration & leverage",
    "responsible-use": "Responsible & safe use",
    "building-scaling": "Building & scaling",
  },

  pillarInsights: {
    foundations: {
      low: {
        title: "Build a working model of how AI actually works",
        insight:
          "Right now AI can feel like a reliable oracle — which makes its failures surprising and hard to predict. The single biggest unlock is understanding that these tools predict plausible patterns, not facts. That one shift explains why they sound confident while being wrong, and it informs every other dimension. Start by learning what hallucination is and why it happens.",
      },
      medium: {
        title: "You know AI errs — now learn why",
        insight:
          "You're aware AI makes mistakes, but the mechanism is still fuzzy, which makes it hard to predict when it will struggle. Closing that gap lets you set realistic expectations before you start a task rather than discovering limits the hard way. Focus on the specific conditions that make AI more or less reliable.",
      },
      high: {
        title: "Strong mental model — put it to work for others",
        insight:
          "You understand the mechanics well enough to anticipate failure modes and calibrate accordingly. The next step is teaching: being able to explain the same concept several ways for different audiences is what turns personal understanding into organisational capability.",
      },
    },
    "practical-craft": {
      low: {
        title: "Iteration is the skill that compounds fastest",
        insight:
          "When the first response isn't right, the instinct to accept it or give up leaves most of AI's value on the table. The highest-return habit you can build is iterating: reframe the task, add context, break it into steps. Reliable results come from method, not from finding the perfect first prompt.",
      },
      medium: {
        title: "You get good results — make them systematic",
        insight:
          "You reframe and add context to get what you need on familiar tasks, but the approach is still improvised, so novel tasks are brittle. Building an explicit toolkit — role, examples, constraints, decomposition — is what lets you handle unfamiliar work with the same consistency.",
      },
      high: {
        title: "Craft is a strength — codify and share it",
        insight:
          "You apply prompting techniques systematically and can diagnose why a poor output went wrong. Capture that as reusable frameworks others can apply, and you turn an individual skill into something your whole team benefits from.",
      },
    },
    "critical-evaluation": {
      low: {
        title: "Treat AI output as a first draft, never a final one",
        insight:
          "Confident, fluent output is easy to send without scrutiny — and that's exactly where AI causes reputational damage. The habit to build is verification proportional to the stakes: read carefully, check factual claims, and never put your name to something you haven't checked. Start by assuming any cited source or statistic could be fabricated.",
      },
      medium: {
        title: "You catch the obvious — now catch the subtle",
        insight:
          "You read outputs and fix clear errors, but subtler issues slip through: fabricated citations, plausible-but-wrong statistics, AI-tell phrasing. The step up is verifying claims to source and checking that a real source actually says what's claimed — not just that it exists.",
      },
      high: {
        title: "Sharp judgement — make it a repeatable standard",
        insight:
          "You verify rigorously and calibrate effort to the stakes. Turning that into an explicit framework — what to check, by task type and risk — lets others apply your standard rather than relying on your instinct each time.",
      },
    },
    "workflow-integration": {
      low: {
        title: "Move from occasional use to recurring leverage",
        insight:
          "Using AI when it occurs to you captures a fraction of the available gain. The shift that matters is applying it to recurring work: pick your most time-consuming repeated task and redesign even one step of it around AI. Embedded use, not occasional use, is where real time savings come from.",
      },
      medium: {
        title: "AI helps — now redesign the work around it",
        insight:
          "AI assists with parts of your recurring tasks, but you haven't yet rethought the workflow itself. The next level is handing the heavy lifting to AI and focusing your time on direction, judgement, and the edge cases — the point where colleagues start asking how you work.",
      },
      high: {
        title: "Deeply integrated — watch for over-automation",
        insight:
          "AI is woven through how you operate and you can describe the architecture of your augmented workflow. The risk at this level shifts to automating things that don't recur often enough to justify it. Direct your leverage at what genuinely repeats, and teach others to design their own.",
      },
    },
    "responsible-use": {
      low: {
        title: "Know what can and can't go into a prompt",
        insight:
          "Pasting in whatever gets a good result is the single most common way capable people create real risk without realising it. Before anything else, learn the line between enterprise-approved and consumer AI environments, and treat client or confidential data with care. This protects you and everyone you work with.",
      },
      medium: {
        title: "Caution is good — replace gut feeling with guidelines",
        insight:
          "You sense some things shouldn't go into AI, but decisions are inconsistent because they rest on instinct. Knowing your organisation's data-handling rules — what categories are permitted and which aren't — turns vague caution into consistent, defensible judgement.",
      },
      high: {
        title: "Principled practice — extend it to others",
        insight:
          "You operate from principles, not just rules, and consider lower-risk ways to get the same result. The leading move is shaping how others handle data: being able to explain why the policies exist, not only what they say, so the standard scales beyond you.",
      },
    },
    "building-scaling": {
      low: {
        title: "The highest-leverage shift: build for others, not just yourself",
        insight:
          "Personal productivity gains stay with you. The biggest multiplier available is creating something others can use — a documented prompt, a simple automation, a reusable template. You don't need to be technical to start; you need to package one thing you do well so a colleague can use it without you.",
      },
      medium: {
        title: "You've built for yourself — now make it reliable for others",
        insight:
          "You've experimented with automations or templates, mostly for personal use. The step up is building something others can depend on without you explaining it each time — which means documenting it and thinking about what happens when it breaks.",
      },
      high: {
        title: "You multiply capability — design it to last",
        insight:
          "You regularly build tools others rely on. The leading edge is maintainable, scalable systems — error handling, documentation, an explicit plan for how they evolve — and teaching others to build, not just to use. This is the rarest and highest-value capability of all.",
      },
    },
  },

  recommendations: {
    foundations: {
      headline: "Learn why AI sounds confident when it's wrong",
      action: "Spend 30 minutes this week understanding how hallucination works",
      detail:
        "A working model of prediction-not-facts informs every other dimension — it's the highest-return half hour you can spend.",
    },
    "practical-craft": {
      headline: "Build an iteration habit",
      action: "On your next three AI tasks, refine the prompt at least twice before accepting the result",
      detail:
        "Reframe, add context, or break the task into steps. Reliable output comes from method, not the perfect first prompt.",
    },
    "critical-evaluation": {
      headline: "Verify before you put your name to it",
      action: "Pick one AI-drafted output this week and check every factual claim and citation to source",
      detail:
        "Assume cited sources and statistics can be fabricated until you've confirmed them. Calibrate the effort to the stakes.",
    },
    "workflow-integration": {
      headline: "Redesign one recurring task around AI",
      action: "Choose your most time-consuming repeated task and hand at least one step of it to AI",
      detail:
        "Embedded use on recurring work is where genuine time savings come from — far more than occasional ad-hoc use.",
    },
    "responsible-use": {
      headline: "Get clear on your data boundaries",
      action: "Find and read your organisation's AI data-handling guidelines this week",
      detail:
        "Know which categories of data are permitted in a prompt and which aren't — and when to use a private vs. shared environment.",
    },
    "building-scaling": {
      headline: "Package one thing for someone else to use",
      action: "Document one prompt or workflow you rely on so a colleague can use it without you",
      detail:
        "Moving from personal use to something others depend on is the hardest and highest-leverage jump you can make.",
    },
  },

  nextSteps: [
    {
      title: "Focus on your lowest-scoring dimension first",
      description:
        "Your biggest constraint is usually where a small improvement has the largest effect on everything else.",
    },
    {
      title: "Pick one action and start this week",
      description:
        "Capability grows through practice, not intention. Choose a single concrete step from your recommendations and do it.",
    },
    {
      title: "Reassess in a few weeks to see your growth",
      description:
        "Retaking the assessment after deliberate practice shows where you've moved and what to develop next.",
    },
  ],

  cta: {
    headline: "Want to accelerate your AI capability?",
    body: "Accelerator-X runs AI transformation programmes that take individuals and teams from where they are to leading practice. Book a conversation to find out how.",
    buttonText: "Book a Conversation",
    url: "https://calendar.app.google/JsmYqtkKvuLacvhs8",
  },

  legal: {
    privacyPolicyUrl: "https://accelerator-x.ai/privacy",
  },
};

export const content = aiCapabilityContent;
