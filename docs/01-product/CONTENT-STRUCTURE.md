# Content Structure: Multi-Template CMS

> **Goal**: Simple, file-based content management that supports multiple assessment templates without database complexity.

---

## Principle

**Templates are self-contained.** Each assessment template includes:
- Questions + scoring logic
- Report copy (band intros, pillar insights, recommendations)
- Landing page copy
- Branding/styling hints

All stored in **version-controlled files** — easy to edit, review, and deploy.

---

## Proposed Directory Structure

```
packages/
  core/
    src/
      templates/
        ai-readiness/
          template.ts        # Questions, pillars, scoring config
          content.ts         # All report/landing copy
          index.ts           # Export combined template
        talent-assessment/
          template.ts
          content.ts
          index.ts
        ops-maturity/
          template.ts
          content.ts
          index.ts
      index.ts               # Export all templates
```

---

## Content File Structure

Each `content.ts` exports a `TemplateContent` object:

```typescript
// templates/ai-readiness/content.ts

export const content = {
  // Landing page
  landing: {
    headline: "How AI-Ready Is Your Team?",
    subheadline: "A 15-minute diagnostic to identify your biggest opportunities",
    valueProps: [
      "Benchmark against industry peers",
      "Identify your #1 blocker",
      "Get a personalised action plan"
    ],
    ctaText: "Start Assessment"
  },

  // Report - Band-based intros (4 variants)
  bandIntros: {
    starting: {
      headline: "You're at the beginning — and that's exactly the right time to act.",
      body: "Most organisations at this stage are overwhelmed by options..."
    },
    emerging: {
      headline: "You've started the journey — now it's time to build momentum.",
      body: "You've made initial moves, but haven't yet seen consistent results..."
    },
    progressing: {
      headline: "You're ahead of most — a few targeted moves will accelerate you.",
      body: "Your foundation is solid. The question now is where to double down..."
    },
    leading: {
      headline: "You're in strong shape — focus on sustaining and scaling.",
      body: "You've built real capability. The risk now is complacency..."
    }
  },

  // Report - Pillar insights (5 variants)
  pillarInsights: {
    leadership: {
      low: "Your team may be ready, but strategic clarity is holding you back...",
      medium: "Leadership engagement is growing, but sponsorship isn't yet consistent...",
      high: "Strong leadership commitment is fueling your progress..."
    },
    data: {
      low: "Without accessible, quality data, even the best AI initiatives stall...",
      medium: "You have data, but it's fragmented or hard to access...",
      high: "Your data infrastructure is a competitive advantage..."
    },
    people: {
      low: "Skills gaps are your biggest constraint right now...",
      medium: "You have pockets of capability, but they're not widespread...",
      high: "Your team has the skills to execute confidently..."
    },
    process: {
      low: "AI tools exist, but they're not embedded in how you work...",
      medium: "Some processes are AI-enhanced, but adoption is inconsistent...",
      high: "AI is woven into your core workflows..."
    },
    culture: {
      low: "The tech is there, but the organisation isn't ready to experiment...",
      medium: "There's interest, but psychological safety for experimentation is limited...",
      high: "Your culture actively encourages experimentation and learning..."
    }
  },

  // Report - Recommendations (by pillar, for low scores)
  recommendations: {
    leadership: {
      headline: "Align leadership on AI priorities",
      action: "Schedule a 90-minute leadership alignment session this month",
      detail: "Use a simple framework: What's the opportunity? What's blocking us? What's our first move?"
    },
    data: {
      headline: "Audit your data accessibility",
      action: "Map your top 5 data sources and who can access them",
      detail: "Most data problems are access problems, not quality problems."
    },
    people: {
      headline: "Start a weekly AI Lab",
      action: "Block 45 minutes every Friday for hands-on AI experimentation",
      detail: "No agenda, no pressure — just protected time to build capability."
    },
    process: {
      headline: "Pick one workflow to AI-enhance",
      action: "Identify a repetitive task that takes >2 hours/week and pilot AI assistance",
      detail: "Success here creates momentum for broader adoption."
    },
    culture: {
      headline: "Make experimentation safe",
      action: "Run a 'failed experiments' retrospective — celebrate what you learned",
      detail: "Psychological safety is the prerequisite for innovation."
    }
  },

  // CTA
  cta: {
    headline: "Want to discuss your results?",
    body: "Book a free 15-minute strategy call to talk through your priorities.",
    buttonText: "Book a Call",
    url: "https://calendly.com/..."
  }
};
```

---

## Why This Works

| Concern | Solution |
|---------|----------|
| **Easy to edit** | Plain TypeScript, IDE autocomplete, type-safe |
| **Version controlled** | Git history, PRs for content changes |
| **No database** | Zero ops complexity for MVP |
| **Type-safe** | TypeScript catches missing content |
| **Extensible** | Add new templates by copying folder |
| **Portable** | Move to database/CMS later without changing types |

---

## Template Registry

```typescript
// packages/core/src/templates/index.ts

import { aiReadinessTemplate } from './ai-readiness';
import { talentAssessmentTemplate } from './talent-assessment';

export const templates = {
  'ai-readiness': aiReadinessTemplate,
  'talent-assessment': talentAssessmentTemplate,
} as const;

export type TemplateId = keyof typeof templates;

export function getTemplate(id: TemplateId) {
  return templates[id];
}
```

---

## Content Variants by Score

The `pillarInsights` use a simple **low/medium/high** model:

| Score Range | Variant |
|-------------|---------|
| 0–40% | `low` |
| 41–70% | `medium` |
| 71–100% | `high` |

This gives you **5 pillars × 3 variants = 15 insight paragraphs** per template.

Combined with **4 band intros** and **5 recommendations**, that's **24 content blocks** to write per template.

---

## Migration Path

**Now (MVP)**: Content in TypeScript files, version controlled.

**Later (if needed)**:
- Move content to Markdown files with frontmatter
- Add a simple admin UI to edit content
- Or integrate with headless CMS (Sanity, Contentful)

The `Template` type stays the same — only the storage changes.

---

## Next Steps

1. Create `templates/ai-readiness/content.ts` with real copy
2. Wire content into report page
3. Test with a few users
4. Iterate on copy based on feedback

---

## Example Templates for Future

| Template ID | Audience | Use Case |
|-------------|----------|----------|
| `ai-readiness` | Leadership teams | AI transformation readiness |
| `talent-assessment` | HR / Talent teams | Recruitment process maturity |
| `ops-maturity` | Ops teams | Process efficiency audit |
| `product-velocity` | Product teams | Delivery capability assessment |
| `data-readiness` | Data teams | Data infrastructure audit |

Each follows the same structure — just different questions and copy.
