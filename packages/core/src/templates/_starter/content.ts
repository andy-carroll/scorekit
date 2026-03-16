/**
 * [Your Template Name] — Report Content
 *
 * All copy for your assessment report.
 * Replace every "YOUR_VALUE_HERE" placeholder before using this file.
 *
 * ⚠️  IMPORTANT: These fields drive BOTH the web report AND the PDF that gets
 *     emailed to every respondent. If any field is wrong, missing, or still a
 *     placeholder, your leads will receive a broken PDF. The most critical
 *     fields for PDF quality are: bandIntros, pillarLabels, pillarInsights,
 *     recommendations, nextSteps, cta, and brand.colors/logo.
 *     See docs/05-open-source/PDF-RENDERER.md for the full PDF architecture.
 *
 * HOW TO USE:
 *   1. Copy this directory to packages/core/src/templates/[your-id]/
 *   2. Fill in every placeholder below
 *   3. Rename the exported constant (see bottom of file)
 *   4. Follow steps 4a–4d in docs/06-template-authoring/README.md to install
 *   5. Generate a test PDF and review every page before going live:
 *        node apps/web/scripts/test-pdf.mjs
 *
 * SHORTCUT: Instead of filling this in manually, use the generation prompt:
 *   docs/06-template-authoring/03-template-generation-prompt.md
 */

// =============================================================================
// Types (do not edit — these are the contracts used by the report renderer)
// =============================================================================

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
    pageTitle?: string;
    description?: string;
    reportTitle?: string;
  };
  brand?: {
    name?: string;
    logoPath?: string;
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
    faviconPath?: string;
    ogImageUrl?: string;
  };
  landing: {
    headline: string;
    subheadline: string;
    ctaText: string;
    timeEstimate?: string;
    valueProps?: ValueProp[];
    trustLine?: string;
  };
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
    /**
     * REQUIRED. Full URL to your privacy policy.
     * Shown as a link in the consent checkbox on the email gate.
     * Must be a publicly accessible URL — respondents will click it.
     * The consent checkbox is ALWAYS shown and ALWAYS required.
     * You cannot disable it: ScoreKit collects personal data (name, email,
     * company) and requires explicit consent before submitting.
     *
     * The following data is recorded in every webhook payload:
     *   consent_given: true
     *   consent_timestamp: ISO 8601 datetime
     *   privacy_policy_url: the URL you supply here
     *
     * This gives you a timestamped, policy-versioned consent record
     * for every respondent — suitable for GDPR and similar frameworks.
     */
    privacyPolicyUrl: string;

    /**
     * OPTIONAL. Override the default consent checkbox label.
     * Default: "I agree to the [Privacy Policy] and consent to receiving
     *           my report and occasional relevant updates by email."
     * Only override if your legal requirements differ — the default is
     * deliberately broad enough to cover report delivery + follow-up.
     */
    consentText?: string;
  };
}

// =============================================================================
// Template content — fill in everything below
// =============================================================================

export const starterContent: TemplateContent = {

  // ---------------------------------------------------------------------------
  // meta
  // WHAT THIS DOES: Identifies this template and sets page metadata (title tag,
  // SEO description, report heading).
  // ---------------------------------------------------------------------------
  meta: {
    // REQUIRED. Must match the directory name and the key in active-template.ts.
    // EXAMPLE: "ai-readiness"
    templateId: "YOUR_TEMPLATE_ID",

    // REQUIRED. Human-readable name shown in emails and UI.
    // EXAMPLE: "AI Readiness Assessment"
    templateName: "YOUR_TEMPLATE_NAME",

    // REQUIRED. Semantic version — increment when you change questions.
    // EXAMPLE: "1.0.0"
    version: "1.0.0",

    // OPTIONAL. Browser tab title.
    // EXAMPLE: "AI Readiness Assessment | Accelerator-X"
    pageTitle: "YOUR_TEMPLATE_NAME | YOUR_BRAND_NAME",

    // OPTIONAL. Meta description for search engines and social previews.
    // EXAMPLE: "Discover how AI-ready your organisation is."
    description: "YOUR_DESCRIPTION",

    // OPTIONAL. Heading shown at the top of the report page and PDF.
    // EXAMPLE: "AI Readiness Report"
    reportTitle: "YOUR_REPORT_TITLE",
  },

  // ---------------------------------------------------------------------------
  // brand
  // WHAT THIS DOES: Controls all colours and fonts used throughout the quiz and
  // report. Values are injected as CSS custom properties at runtime, so they
  // override any theme defaults from accelerator.css.
  // ---------------------------------------------------------------------------
  brand: {
    // OPTIONAL. Short name used in footer and email subjects.
    // EXAMPLE: "Accelerator-X"
    name: "YOUR_BRAND_NAME",

    // OPTIONAL. Path to logo file in /public/logos/.
    // EXAMPLE: "/logos/accelerator-x.png"
    logoPath: "/logos/YOUR_LOGO_FILE.png",

    // OPTIONAL. Separate light/dark logo variants (legacy — use logoPath if possible).
    logo: {
      light: "/logos/YOUR_LOGO_FILE.png",
      dark: "/logos/YOUR_LOGO_FILE.png",
    },

    colors: {
      // REQUIRED. Primary brand colour — used for buttons, links, highlights.
      // EXAMPLE: "#0aadce"
      primary: "#YOUR_PRIMARY_HEX",

      // OPTIONAL. Slightly darker version of primary — used on hover.
      // EXAMPLE: "#089bb8"
      primaryHover: "#YOUR_PRIMARY_HOVER_HEX",

      // OPTIONAL. Secondary colour — used for dark backgrounds, badges.
      // EXAMPLE: "#1b2a4a"
      secondary: "#YOUR_SECONDARY_HEX",

      // OPTIONAL. Accent/highlight colour — used for callouts, badges.
      // EXAMPLE: "#fea700"
      highlight: "#YOUR_HIGHLIGHT_HEX",

      // These defaults are safe for most light-background designs.
      // Only change if you have a custom dark theme.
      text: "#111827",
      mutedText: "#64748b",
      background: "#ffffff",
      surface: "#f8fafc",
    },

    typography: {
      // OPTIONAL. Font name must be loaded separately (e.g. via Google Fonts in layout.tsx).
      // EXAMPLE: "Aptos"
      displayFont: "YOUR_DISPLAY_FONT",

      // OPTIONAL.
      // EXAMPLE: "Aptos"
      bodyFont: "YOUR_BODY_FONT",
    },

    // OPTIONAL. Path to favicon in /public/favicons/.
    // EXAMPLE: "/favicons/accelerator-x.png"
    faviconPath: "/favicons/YOUR_FAVICON_FILE.png",

    // OPTIONAL. Absolute URL for OpenGraph image (shown in social link previews).
    // EXAMPLE: "https://accelerator-x.ai/assets/images/og-image-1200.png"
    ogImageUrl: "https://YOUR_DOMAIN/og-image.png",
  },

  // ---------------------------------------------------------------------------
  // landing
  // WHAT THIS DOES: All copy on the landing page — the page people see before
  // they start the quiz.
  // ---------------------------------------------------------------------------
  landing: {
    // REQUIRED. Main headline — the most important line on the page.
    // EXAMPLE: "Is your organisation ready for AI?"
    headline: "YOUR_HEADLINE",

    // REQUIRED. Supporting sentence below the headline.
    // EXAMPLE: "Discover where you stand and get a clear roadmap for transformation."
    subheadline: "YOUR_SUBHEADLINE",

    // REQUIRED. Text on the start button.
    // EXAMPLE: "Take the Assessment"
    ctaText: "Take the Assessment",

    // OPTIONAL. Shown below the button.
    // EXAMPLE: "10 minutes"
    timeEstimate: "10 minutes",

    // OPTIONAL. Three feature cards shown in the "What you'll discover" section.
    // Accent options: "teal" | "primary" | "pink" | "green"
    valueProps: [
      {
        // EXAMPLE: "Your AI Readiness Score"
        title: "YOUR_VALUE_PROP_1_TITLE",
        // EXAMPLE: "See how your organisation compares across five key dimensions."
        body: "YOUR_VALUE_PROP_1_BODY",
        accent: "teal",
      },
      {
        title: "YOUR_VALUE_PROP_2_TITLE",
        body: "YOUR_VALUE_PROP_2_BODY",
        accent: "purple",
      },
      {
        title: "YOUR_VALUE_PROP_3_TITLE",
        body: "YOUR_VALUE_PROP_3_BODY",
        accent: "pink",
      },
    ],

    // OPTIONAL. Social proof line above the second CTA on the landing page.
    // EXAMPLE: "Join hundreds of organisations who have used this assessment."
    trustLine: "YOUR_TRUST_LINE",
  },

  // ---------------------------------------------------------------------------
  // report (section headings)
  // WHAT THIS DOES: Overrides the default section headings on the report page.
  // All fields are optional — omit any you want to keep as default.
  // ---------------------------------------------------------------------------
  report: {
    sectionHeadings: {
      // OPTIONAL. Default: "Your Results by Pillar"
      pillarScores: "YOUR_PILLAR_SCORES_HEADING",
      // OPTIONAL. Default: "Key Insights"
      keyInsights: "YOUR_KEY_INSIGHTS_HEADING",
      // OPTIONAL. Default: "Your Next Steps"
      nextSteps: "YOUR_NEXT_STEPS_HEADING",
      // OPTIONAL. Default: "How we calculated your scores"
      howWeScore: "YOUR_HOW_WE_SCORE_HEADING",
      // OPTIONAL. Default: "Your Profile"
      profile: "YOUR_PROFILE_HEADING",
    },
  },

  // ---------------------------------------------------------------------------
  // bandIntros
  // WHAT THIS DOES: The opening section of the report. Each band shows a
  // headline and a 2–3 sentence paragraph describing what this score level means
  // and setting a motivating tone. Keys must exactly match your band labels.
  //
  // Your 4 bands (adjust labels to match what you defined in your worksheet):
  // ---------------------------------------------------------------------------
  bandIntros: {
    // REQUIRED. Key must exactly match the band label (not the band ID).
    // EXAMPLE: "Starting" or "Foundation Stage" — whatever you named it.
    "YOUR_BAND_1_LABEL": {
      // EXAMPLE: "You're at the starting line — and that's a great place to be"
      headline: "YOUR_BAND_1_HEADLINE",
      // EXAMPLE: "Most organisations at your stage are overwhelmed by hype but unclear on where to begin..."
      intro: "YOUR_BAND_1_INTRO",
    },
    "YOUR_BAND_2_LABEL": {
      headline: "YOUR_BAND_2_HEADLINE",
      intro: "YOUR_BAND_2_INTRO",
    },
    "YOUR_BAND_3_LABEL": {
      headline: "YOUR_BAND_3_HEADLINE",
      intro: "YOUR_BAND_3_INTRO",
    },
    "YOUR_BAND_4_LABEL": {
      headline: "YOUR_BAND_4_HEADLINE",
      intro: "YOUR_BAND_4_INTRO",
    },
  },

  // ---------------------------------------------------------------------------
  // pillarLabels
  // WHAT THIS DOES: Maps pillar IDs to display names shown on the report.
  // Keys must exactly match the pillarId values in your questions.ts sections.
  // ---------------------------------------------------------------------------
  pillarLabels: {
    // EXAMPLE: leadership: "Leadership & Vision",
    "YOUR_PILLAR_1_ID": "YOUR_PILLAR_1_DISPLAY_NAME",
    "YOUR_PILLAR_2_ID": "YOUR_PILLAR_2_DISPLAY_NAME",
    "YOUR_PILLAR_3_ID": "YOUR_PILLAR_3_DISPLAY_NAME",
    "YOUR_PILLAR_4_ID": "YOUR_PILLAR_4_DISPLAY_NAME",
    // Add more if you have 5–6 pillars
  },

  // ---------------------------------------------------------------------------
  // pillarInsights
  // WHAT THIS DOES: The diagnostic narrative for each pillar shown on the report.
  // Each pillar has three levels: low (avg 1–2.3), medium (2.4–3.6), high (3.7–5).
  // Title: 5–8 words. Insight: 2–3 sentences, specific and actionable.
  // ---------------------------------------------------------------------------
  pillarInsights: {
    "YOUR_PILLAR_1_ID": {
      low: {
        // EXAMPLE: "Leadership alignment is your biggest unlock"
        title: "YOUR_PILLAR_1_LOW_TITLE",
        // EXAMPLE: "Without clear executive sponsorship and a documented AI strategy, teams struggle..."
        insight: "YOUR_PILLAR_1_LOW_INSIGHT",
      },
      medium: {
        title: "YOUR_PILLAR_1_MEDIUM_TITLE",
        insight: "YOUR_PILLAR_1_MEDIUM_INSIGHT",
      },
      high: {
        title: "YOUR_PILLAR_1_HIGH_TITLE",
        insight: "YOUR_PILLAR_1_HIGH_INSIGHT",
      },
    },
    "YOUR_PILLAR_2_ID": {
      low: {
        title: "YOUR_PILLAR_2_LOW_TITLE",
        insight: "YOUR_PILLAR_2_LOW_INSIGHT",
      },
      medium: {
        title: "YOUR_PILLAR_2_MEDIUM_TITLE",
        insight: "YOUR_PILLAR_2_MEDIUM_INSIGHT",
      },
      high: {
        title: "YOUR_PILLAR_2_HIGH_TITLE",
        insight: "YOUR_PILLAR_2_HIGH_INSIGHT",
      },
    },
    "YOUR_PILLAR_3_ID": {
      low: {
        title: "YOUR_PILLAR_3_LOW_TITLE",
        insight: "YOUR_PILLAR_3_LOW_INSIGHT",
      },
      medium: {
        title: "YOUR_PILLAR_3_MEDIUM_TITLE",
        insight: "YOUR_PILLAR_3_MEDIUM_INSIGHT",
      },
      high: {
        title: "YOUR_PILLAR_3_HIGH_TITLE",
        insight: "YOUR_PILLAR_3_HIGH_INSIGHT",
      },
    },
    "YOUR_PILLAR_4_ID": {
      low: {
        title: "YOUR_PILLAR_4_LOW_TITLE",
        insight: "YOUR_PILLAR_4_LOW_INSIGHT",
      },
      medium: {
        title: "YOUR_PILLAR_4_MEDIUM_TITLE",
        insight: "YOUR_PILLAR_4_MEDIUM_INSIGHT",
      },
      high: {
        title: "YOUR_PILLAR_4_HIGH_TITLE",
        insight: "YOUR_PILLAR_4_HIGH_INSIGHT",
      },
    },
    // Add more pillars here if needed
  },

  // ---------------------------------------------------------------------------
  // recommendations
  // WHAT THIS DOES: The #1 actionable recommendation for each pillar, shown on
  // the report. Headline is verb-first. Action is what to do this week (1
  // concrete sentence). Detail is the why or a practical tip (1 sentence).
  // ---------------------------------------------------------------------------
  recommendations: {
    // EXAMPLE from AI Readiness:
    // leadership: {
    //   headline: "Align leadership on AI priorities",
    //   action: "Schedule a 90-minute leadership alignment session this month",
    //   detail: "Use a simple framework: What's the opportunity? What's blocking us? What's our first move?",
    // },
    "YOUR_PILLAR_1_ID": {
      headline: "YOUR_PILLAR_1_REC_HEADLINE",
      action: "YOUR_PILLAR_1_REC_ACTION",
      detail: "YOUR_PILLAR_1_REC_DETAIL",
    },
    "YOUR_PILLAR_2_ID": {
      headline: "YOUR_PILLAR_2_REC_HEADLINE",
      action: "YOUR_PILLAR_2_REC_ACTION",
      detail: "YOUR_PILLAR_2_REC_DETAIL",
    },
    "YOUR_PILLAR_3_ID": {
      headline: "YOUR_PILLAR_3_REC_HEADLINE",
      action: "YOUR_PILLAR_3_REC_ACTION",
      detail: "YOUR_PILLAR_3_REC_DETAIL",
    },
    "YOUR_PILLAR_4_ID": {
      headline: "YOUR_PILLAR_4_REC_HEADLINE",
      action: "YOUR_PILLAR_4_REC_ACTION",
      detail: "YOUR_PILLAR_4_REC_DETAIL",
    },
    // Add more pillars here if needed
  },

  // ---------------------------------------------------------------------------
  // nextSteps
  // WHAT THIS DOES: Three action items shown at the bottom of the report, above
  // the CTA block. Keep them concrete and ordered (most important first).
  // ---------------------------------------------------------------------------
  nextSteps: [
    {
      // EXAMPLE: "Share this report with your leadership team"
      title: "YOUR_NEXT_STEP_1_TITLE",
      // EXAMPLE: "Alignment starts with shared understanding. Use this as a conversation starter."
      description: "YOUR_NEXT_STEP_1_DESCRIPTION",
    },
    {
      title: "YOUR_NEXT_STEP_2_TITLE",
      description: "YOUR_NEXT_STEP_2_DESCRIPTION",
    },
    {
      title: "YOUR_NEXT_STEP_3_TITLE",
      description: "YOUR_NEXT_STEP_3_DESCRIPTION",
    },
  ],

  // ---------------------------------------------------------------------------
  // cta
  // WHAT THIS DOES: The call-to-action block at the very bottom of the report.
  // This is your commercial conversion point — make it specific and relevant.
  // ---------------------------------------------------------------------------
  cta: {
    // REQUIRED. Headline above the CTA block.
    // EXAMPLE: "Ready to accelerate your AI journey?"
    headline: "YOUR_CTA_HEADLINE",

    // REQUIRED. 1–2 sentence description of what clicking the button gets them.
    // EXAMPLE: "Book a free 30-minute strategy session. We'll review your results together."
    body: "YOUR_CTA_BODY",

    // REQUIRED. Button label.
    // EXAMPLE: "Book Your Free Strategy Session"
    buttonText: "YOUR_CTA_BUTTON_TEXT",

    // OPTIONAL. Full URL the button links to. If omitted, the button is not rendered.
    // EXAMPLE: "https://accelerator-x.ai/book"
    url: "https://YOUR_DOMAIN/YOUR_BOOKING_PATH",
  },

  // ---------------------------------------------------------------------------
  // legal
  // WHAT THIS DOES: Powers the consent checkbox on the email gate form.
  //
  // ScoreKit collects personal data (name, email, company). A required consent
  // checkbox is ALWAYS shown before form submission — this is not optional and
  // cannot be disabled. This section configures what that checkbox says and
  // links to.
  //
  // Every webhook payload includes:
  //   consent_given: true
  //   consent_timestamp: "<ISO 8601 datetime>"
  //   privacy_policy_url: "<your URL>"
  //
  // This gives you a timestamped, auditable consent record for every
  // respondent — suitable for GDPR (UK/EU), CASL, and similar frameworks.
  // ---------------------------------------------------------------------------
  legal: {
    // REQUIRED. Must be a publicly accessible URL — respondents will click it.
    // EXAMPLE: "https://yourdomain.com/privacy"
    privacyPolicyUrl: "https://YOUR_DOMAIN/privacy",

    // OPTIONAL. Override the consent checkbox label.
    // Default: "I agree to the [Privacy Policy] and consent to receiving
    //           my report and occasional relevant updates by email."
    // Only set this if your legal requirements genuinely differ.
    // consentText: "YOUR_CUSTOM_CONSENT_TEXT",
  },
};

/** @deprecated Use starterContent instead */
export const content = starterContent;
