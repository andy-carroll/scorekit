# ScoreKit — Template Generation Prompt

**How to use this:** Paste your completed `02-worksheet.md` below the line marked `[PASTE YOUR WORKSHEET HERE]`, then paste the entire document into Claude (or any capable LLM). You'll get back a ready-to-use `content.ts` file.

---

## My worksheet

[PASTE YOUR COMPLETED 02-worksheet.md CONTENT HERE]

---

## Your task

Generate a complete, production-ready `content.ts` file for a ScoreKit quiz template based on the worksheet above.

### The TypeScript interface you must match exactly

```typescript
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
}
```

### Rules

1. **Match the interface exactly.** Do not add or invent fields not in the interface above. Do not omit required fields.
2. **Use the worksheet values verbatim** wherever possible. Do not paraphrase unless the original is clearly a placeholder or example.
3. **Band keys** in `bandIntros` must match the band labels from the worksheet exactly (e.g. `"Foundation Stage"`, `"Building Momentum"`).
4. **Pillar keys** in `pillarLabels`, `pillarInsights`, and `recommendations` must match the pillar IDs from the worksheet exactly.
5. **Colors**: If only a primary colour is given, set `text: "#111827"`, `mutedText: "#64748b"`, `background: "#ffffff"`, `surface: "#f8fafc"`. Derive `primaryHover` by darkening the primary ~10%.
6. **Optional fields**: Only include optional fields if the worksheet provides a value. Do not include them with placeholder values.
7. **Mark ambiguity**: If any worksheet field is missing, ambiguous, or clearly a placeholder, fill in a reasonable value and append `// [REVIEW]` on that line.
8. **Export name**: Name the exported constant after the templateId in camelCase + `Content` (e.g. `templateId: "fitness-readiness"` → `export const fitnessReadinessContent: TemplateContent`).
9. **Deprecated re-export**: Add `/** @deprecated Use [exportName] instead */ export const content = [exportName];` at the bottom.
10. **File header**: Start the file with:
    ```typescript
    /**
     * [Template Name] - Report Content
     *
     * All copy for the [Template Name] assessment report.
     */
    ```

### Output format

Output the complete `content.ts` file as a single TypeScript code block. Then output a separate section titled **"Questions for `questions.ts`"** containing:

```
## Questions for questions.ts

> Note: Until Part 2 of the ScoreKit architecture is complete, you must also add
> your sections and questions to apps/web/src/lib/questions.ts manually.
> See docs/06-template-authoring/README.md Step 4b for instructions.

### Sections array entry

[TypeScript for your pillar sections]

### Questions array entries

[TypeScript for all your questions — diagnostic and context]
```

For the `questions.ts` section:
- Each section should follow the pattern: `{ id: "[pillar-id]", name: "[Pillar Name]", description: "[Pillar Description]", type: "diagnostic" as const }`
- Context questions should use `type: "context" as const` and have no `pillarId`
- Each diagnostic question should have: `id`, `text`, `category: "diagnostic"`, `questionType: "maturity"`, `inputType: "radio"`, `pillarId`, and `options` as `[{ value: 1, label: "..." }, ..., { value: 5, label: "..." }]`
- Each context question should have: `id`, `text`, `category: "context"`, `questionType` (use `"aspiration"` for goal questions, `"demographics"` for profile questions, `"pain"` for blocker questions), `inputType` (`"select"`, `"multi-select"`, or `"text"`), and `options` as `[{ id: "...", label: "..." }]` for select/multi-select types

---

Once generated, spot-check any lines marked `// [REVIEW]` and replace with your actual values before dropping the file into your template directory.
