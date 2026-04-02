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

export interface ValueProp {
  title: string;
  body: string;
  /** Maps to a CSS accent variable: "teal" | "primary" | "pink" | "green" */
  accent?: string;
}

export interface TemplateContent {
  meta: {
    templateId: string;
    templateName: string;
    version: string;
    /** Page <title> used in layout metadata */
    pageTitle?: string;
    /** Meta description for SEO */
    description?: string;
    /** Heading shown at the top of the PDF/web report */
    reportTitle?: string;
  };
  brand?: {
    /** Short display name for the brand (used in footer, email, etc.) */
    name?: string;
    /** Path to logo for use on dark backgrounds */
    logoPath?: string;
    /** Legacy: separate light/dark logo paths */
    logo?: {
      light?: string;
      dark?: string;
    };
    colors: {
      primary: string;
      primaryHover?: string;
      secondary?: string;
      accent?: string;
      highlight?: string;
      accentTeal?: string;
      accentPink?: string;
      bgDark?: string;
      text: string;
      mutedText: string;
      background: string;
      surface: string;
    };
    typography?: {
      displayFont?: string;
      bodyFont?: string;
    };
    /**
     * Path to the favicon file (relative to /public).
     * Used in generateMetadata() to set the <link rel="icon"> tag.
     * e.g. "/favicons/accelerator-x.png"
     */
    faviconPath?: string;
    /**
     * Absolute URL (or /public-relative path) for the OpenGraph image.
     * Shown when report/landing URLs are shared on social or in messaging apps.
     * e.g. "https://accelerator-x.ai/og-image.png"
     */
    ogImageUrl?: string;
  };
  landing: {
    headline: string;
    subheadline: string;
    ctaText: string;
    /** e.g. "10 minutes" — shown below the CTA button */
    timeEstimate?: string;
    /** Feature cards shown in the "What you'll discover" section */
    valueProps?: ValueProp[];
    /** Social proof line above the bottom CTA */
    trustLine?: string;
  };
  /** Section headings for the report page */
  report?: {
    sectionHeadings?: {
      pillarScores?: string;
      keyInsights?: string;
      nextSteps?: string;
      howWeScore?: string;
      profile?: string;
    };
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
  legal: {
    /** URL to the deployer's privacy policy — shown on the email gate consent checkbox */
    privacyPolicyUrl: string;
    /** Optional override for the consent checkbox label */
    consentText?: string;
  };
}

export const aiReadinessContent: TemplateContent = {
  meta: {
    templateId: "ai-readiness",
    templateName: "AI Readiness Assessment",
    version: "1.0.0",
    pageTitle: "AI Readiness Assessment | Accelerator-X",
    description:
      "Discover how AI-ready your organisation is with our comprehensive assessment. Get personalised insights and actionable recommendations.",
    reportTitle: "AI Readiness Report",
  },

  brand: {
    // ── Accelerator-X brand ────────────────────────────────────────────────
    // Teal/pink palette matching accelerator-x.netlify.app
    // layout.tsx reads these values and injects them as CSS custom property
    // overrides at runtime, so accelerator.css defaults are replaced.
    //
    // To create the Accelerator Solutions version (amber/blue):
    //   1. Copy this template to packages/core/src/templates/ai-readiness-solutions/
    //   2. Update name, colors, and typography below
    //   3. Register in apps/web/src/lib/active-template.ts
    //   4. Deploy with SCOREKIT_TEMPLATE_ID=ai-readiness-solutions
    name: "Accelerator-X",
    // Web logo: PNG (works in both <img> and pdfkit — no conversion needed)
    // Source: accelerator-x-website/assets/icons/AX-wordmark-and-logo.png
    // To replace with SVG later: add .svg file, update logoPath, run pnpm convert-logos
    logoPath: "/logos/accelerator-x.png",
    logo: {
      light: "/logos/accelerator-x.png",
      dark: "/logos/accelerator-x.png",
    },
    // Favicon: square icon used in browser tabs, bookmarks, and PWA home-screen.
    // Source: accelerator-x-website/assets/icons/AX-icon.png
    faviconPath: "/favicons/accelerator-x.png",
    // OG image: shown when quiz/report URLs are shared on LinkedIn, Slack, etc.
    // Reuses the existing OG image from the main site — no new asset needed.
    // PNG preferred over WebP for broadest social crawler compatibility.
    ogImageUrl: "https://accelerator-x.ai/assets/images/og-image-1200.png",
    colors: {
      primary: "#0aadce",       // teal — website primary
      primaryHover: "#089bb8",
      secondary: "#1b2a4a",     // navy
      highlight: "#fea700",     // amber — highlight/badge colour
      accentTeal: "#0aadce",    // alias: same as primary
      accentPink: "#e93f8e",    // hot pink — website accent
      bgDark: "#1b2a4a",        // navy — hero / dark sections
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
    headline: "Is your organisation ready for AI?",
    subheadline:
      "Discover where you stand, uncover hidden gaps, and get a clear roadmap for AI transformation—tailored to your business.",
    ctaText: "Take the Assessment",
    timeEstimate: "10 minutes",
    valueProps: [
      {
        title: "Your AI Readiness Score",
        body: "See how your organisation compares across leadership, data, people, process, and culture.",
        accent: "teal",
      },
      {
        title: "Personalised Insights",
        body: "Understand your specific strengths and the gaps holding you back from AI success.",
        accent: "purple",
      },
      {
        title: "Clear Next Steps",
        body: "Get actionable recommendations prioritised for your current stage and resources.",
        accent: "pink",
      },
    ],
    trustLine:
      "Join hundreds of organisations who have used this assessment to accelerate their AI journey.",
  },

  report: {
    sectionHeadings: {
      pillarScores: "Your Readiness by Pillar",
      keyInsights: "Key Insights",
      nextSteps: "Your Next Steps",
      howWeScore: "How we calculated your scores",
    },
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
    body: "Book a free 45-minute strategy session. We'll review your results together and map out your first 90 days.",
    buttonText: "Book Your Free Strategy Session",
    url: "https://calendar.app.google/JsmYqtkKvuLacvhs8",
  },

  legal: {
    privacyPolicyUrl: "https://accelerator-x.ai/privacy",
  },
};

/** @deprecated Use aiReadinessContent instead */
export const content = aiReadinessContent;
