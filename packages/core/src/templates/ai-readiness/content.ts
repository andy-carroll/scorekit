/**
 * AI Readiness Template - Report Content
 *
 * All copy for the AI Readiness assessment report.
 * Structured for easy editing and version control.
 */

export type ScoreLevel = "low" | "medium" | "high";

export interface BandContent {
  headline: string;
  intro: string;
}

export interface PillarInsight {
  title: string;
  insight: string;
}

export interface RecommendationContent {
  headline: string;
  action: string;
  detail: string;
}

export interface TemplateContent {
  meta: {
    templateId: string;
    templateName: string;
    version: string;
  };
  landing: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  bandIntros: Record<string, BandContent>;
  pillarLabels: Record<string, string>;
  pillarInsights: Record<string, Record<ScoreLevel, PillarInsight>>;
  recommendations: Record<string, RecommendationContent>;
  nextSteps: Array<{ title: string; description: string }>;
  cta: {
    headline: string;
    body: string;
    buttonText: string;
    url?: string;
  };
}

export const content: TemplateContent = {
  meta: {
    templateId: "ai-readiness",
    templateName: "AI Readiness Assessment",
    version: "1.0.0",
  },

  landing: {
    headline: "How AI-Ready Is Your Organisation?",
    subheadline:
      "A 15-minute diagnostic to identify your biggest opportunities and blockers",
    ctaText: "Start Assessment",
  },

  bandIntros: {
    Starting: {
      headline: "You're at the starting line — and that's a great place to be",
      intro:
        "Most organisations at your stage are overwhelmed by AI hype but unclear on where to begin. The good news? You're now armed with clarity. This report identifies exactly where to focus first, so you can make meaningful progress without wasted effort or budget.",
    },
    Emerging: {
      headline: "You've taken the first steps — now it's time to build momentum",
      intro:
        "Your organisation has begun its AI journey, but like many at this stage, progress may feel inconsistent. Some pockets of experimentation exist, but they're not yet connected to a coherent strategy. This report shows you how to turn scattered efforts into systematic progress.",
    },
    Progressing: {
      headline: "You're making real progress — let's accelerate it",
      intro:
        "Your organisation has moved beyond experimentation into genuine AI adoption. You have some foundations in place, but there are clear opportunities to deepen impact and scale what's working. This report identifies the gaps that, once closed, will unlock your next level of capability.",
    },
    Leader: {
      headline: "You're leading the pack — here's how to stay ahead",
      intro:
        "Congratulations. Your organisation demonstrates strong AI readiness across multiple dimensions. But leadership is never static. This report highlights opportunities to extend your advantage and avoid the complacency that catches many high performers.",
    },
  },

  pillarLabels: {
    leadership: "Leadership & Vision",
    data: "Data & Infrastructure",
    people: "People & Skills",
    process: "Process & Operations",
    culture: "Culture & Experimentation",
  },

  pillarInsights: {
    leadership: {
      low: {
        title: "Leadership alignment is your biggest unlock",
        insight:
          "Without clear executive sponsorship and a documented AI strategy, teams struggle to prioritise and invest. The most successful AI transformations start with leadership alignment — not technology selection. Consider scheduling a leadership workshop to establish shared vision and accountability.",
      },
      medium: {
        title: "Leadership is engaged, but strategy needs sharpening",
        insight:
          "Your executives are interested in AI, but the strategy may lack the specificity needed to drive action. Teams need clearer priorities and success metrics. Consider documenting your AI strategy with concrete use cases and owners.",
      },
      high: {
        title: "Strong leadership foundation in place",
        insight:
          "Your leadership team is actively driving AI as a strategic priority. To maintain momentum, ensure regular reviews of AI initiatives against business outcomes, and keep expanding the coalition of sponsors across the organisation.",
      },
    },
    data: {
      low: {
        title: "Data foundations need urgent attention",
        insight:
          "AI is only as good as the data it's built on. Scattered, siloed, or poor-quality data will undermine any AI initiative. Before investing in AI tools, prioritise getting your core data assets organised, accessible, and governed. This is unglamorous but essential work.",
      },
      medium: {
        title: "Data is accessible but not yet AI-ready",
        insight:
          "You have some data infrastructure in place, but gaps in quality, integration, or governance may slow AI adoption. Focus on your highest-value datasets first — ensure they're clean, documented, and accessible to the teams who need them.",
      },
      high: {
        title: "Data infrastructure is a competitive advantage",
        insight:
          "Your data foundations are strong. You can confidently pursue more sophisticated AI use cases knowing the underlying data will support them. Consider how to extend this capability to more parts of the organisation.",
      },
    },
    people: {
      low: {
        title: "Skills gap is holding you back",
        insight:
          "Your team lacks the AI literacy needed to identify opportunities, evaluate tools, or work effectively with AI systems. This isn't about hiring data scientists — it's about ensuring everyone understands enough to contribute. Start with foundational AI training for key roles.",
      },
      medium: {
        title: "Pockets of expertise exist, but skills are uneven",
        insight:
          "Some team members are AI-capable, but knowledge isn't distributed evenly. This creates bottlenecks and single points of failure. Invest in structured training and create opportunities for knowledge sharing across teams.",
      },
      high: {
        title: "Your team is AI-capable and confident",
        insight:
          "Your people have the skills and confidence to work with AI tools effectively. Focus on maintaining this through continuous learning, and consider how your team can help upskill others in the organisation.",
      },
    },
    process: {
      low: {
        title: "AI isn't yet part of how you work",
        insight:
          "AI tools may be available, but they're not embedded in your daily workflows. This means missed opportunities for efficiency and insight. Start by identifying 2-3 high-frequency, high-value processes where AI could make an immediate difference.",
      },
      medium: {
        title: "Some AI adoption, but not yet systematic",
        insight:
          "Individual team members may be using AI tools, but there's no standard approach. This leads to inconsistent results and missed learning opportunities. Document what's working, standardise the best practices, and create shared resources.",
      },
      high: {
        title: "AI is embedded in your operations",
        insight:
          "You've moved beyond experimentation to systematic AI integration. Your processes benefit from automation and augmentation. Focus on measuring impact, sharing successes, and identifying the next wave of opportunities.",
      },
    },
    culture: {
      low: {
        title: "Culture may be blocking AI adoption",
        insight:
          "Even with the right strategy, data, and skills, AI initiatives fail if the culture isn't ready. Fear of failure, resistance to change, or slow decision-making will stall progress. Focus on creating psychological safety for experimentation and celebrating learning from failures.",
      },
      medium: {
        title: "Culture is open but not yet optimised for AI",
        insight:
          "Your organisation is willing to try new things, but the pace of experimentation could be faster. Look for ways to reduce friction in trying new AI tools, and create more opportunities to share learnings across teams.",
      },
      high: {
        title: "Culture of experimentation is a strength",
        insight:
          "Your organisation embraces change and learns quickly from experiments. This cultural readiness is often the hardest thing to build — protect it, celebrate it, and use it as a foundation for ambitious AI initiatives.",
      },
    },
  },

  recommendations: {
    leadership: {
      headline: "Align leadership on AI priorities",
      action: "Schedule a 90-minute leadership alignment session this month",
      detail:
        "Use a simple framework: What's the opportunity? What's blocking us? What's our first move?",
    },
    data: {
      headline: "Audit your data accessibility",
      action: "Map your top 5 data sources and who can access them",
      detail:
        "Most data problems are access problems, not quality problems.",
    },
    people: {
      headline: "Start a weekly AI Lab",
      action: "Block 45 minutes every Friday for hands-on AI experimentation",
      detail:
        "No agenda, no pressure — just protected time to build capability.",
    },
    process: {
      headline: "Pick one workflow to AI-enhance",
      action:
        "Identify a repetitive task that takes >2 hours/week and pilot AI assistance",
      detail: "Success here creates momentum for broader adoption.",
    },
    culture: {
      headline: "Make experimentation safe",
      action:
        "Run a 'failed experiments' retrospective — celebrate what you learned",
      detail: "Psychological safety is the prerequisite for innovation.",
    },
  },

  nextSteps: [
    {
      title: "Share this report with your leadership team",
      description:
        "Alignment starts with shared understanding. Use this as a conversation starter.",
    },
    {
      title: "Focus on your lowest-scoring pillar first",
      description:
        "Small improvements in your weakest area will have outsized impact.",
    },
    {
      title: "Book a strategy session to build your roadmap",
      description:
        "Get personalised guidance on turning these insights into action.",
    },
  ],

  cta: {
    headline: "Ready to accelerate your AI journey?",
    body: "Book a free 30-minute strategy session. We'll review your results together and map out your first 90 days.",
    buttonText: "Book Your Free Strategy Session",
  },
};
