# ScoreKit — Template Authoring Guide

ScoreKit is a white-label quiz platform. You deploy it once; every new quiz is just a new template. This guide walks you from "I have a quiz idea" to "my quiz is live" in five steps.

---

## The 5-step process

```
1. DESIGN    → Use AI to design your quiz architecture (pillars, questions, bands)
2. REVIEW    → Refine the output until it's right
3. GENERATE  → Use AI to produce your content.ts file
4. INSTALL   → Drop the file in, register it, set your env var
5. DEPLOY    → Push to Vercel — your quiz is live
```

---

## Step 1 — Design your quiz with AI

Open [`01-quiz-design-prompt.md`](./01-quiz-design-prompt.md). Fill in 5 lines about your quiz, paste the whole thing into Claude (or any LLM). You'll get back:

- A set of assessment pillars tailored to your domain
- 4–5 questions per pillar, each with 5 concrete answer options
- Context questions (unscored demographics and goals)
- Band names and thresholds that fit your topic
- Insights and recommendations per pillar

**This step is optional** if you already know exactly what you want — skip to Step 2.

## Step 2 — Fill in the worksheet

Open [`02-worksheet.md`](./02-worksheet.md) and fill it in with your design output (or your own ideas). This structured format is what the generation prompt in Step 3 expects.

## Step 3 — Generate your content.ts

Open [`03-template-generation-prompt.md`](./03-template-generation-prompt.md). Paste your completed worksheet into it, then paste the whole thing into Claude. You'll get back a ready-to-use `content.ts` file.

Spot-check any fields marked `// [REVIEW]` — these are places where your input was ambiguous and Claude made a reasonable guess.

## Step 4 — Install your template

**4a. Create your template directory**

```
packages/core/src/templates/[your-template-id]/
  content.ts       ← paste the generated file here
  index.ts         ← re-export (copy from _starter/index.ts)
```

**4b. Add your questions to questions.ts**

> **Note:** This is a temporary manual step. A future release will move questions into `content.ts` automatically.

Open `apps/web/src/lib/questions.ts`. Add:

1. Your sections to the `sections` array (after any existing sections)
2. Your questions to the `questions` array

The file is well-commented — follow the existing pattern exactly. Each diagnostic question needs a `pillarId` matching your pillar IDs. Context questions should not have a `pillarId`.

**4c. Register your template**

Open `apps/web/src/lib/active-template.ts`. Add your template to the registry:

```typescript
import { myTemplateContent } from "@scorekit/core/templates/[your-id]/content";

const TEMPLATES = {
  "ai-readiness": aiReadinessContent,
  "[your-id]": myTemplateContent,   // ← add this line
};
```

**4d. Set your environment variable**

In your Vercel project (or `.env.local` for local dev):

```
SCOREKIT_TEMPLATE_ID=[your-id]
NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID=[your-id]
```

## Step 5 — Deploy

Push to `main`. Vercel builds and deploys automatically.

---

## Reference files

| File | Purpose |
|------|---------|
| [`01-quiz-design-prompt.md`](./01-quiz-design-prompt.md) | AI prompt to design your quiz from scratch |
| [`02-worksheet.md`](./02-worksheet.md) | Structured fill-in questionnaire |
| [`03-template-generation-prompt.md`](./03-template-generation-prompt.md) | AI prompt to generate your content.ts |
| [`packages/core/src/templates/_starter/content.ts`](../../packages/core/src/templates/_starter/content.ts) | Heavily commented starter file — use as reference |
| [`packages/core/src/templates/ai-readiness/content.ts`](../../packages/core/src/templates/ai-readiness/content.ts) | Live example (the AI Readiness quiz) |

---

## Questions?

If you're unsure what a field does, check the `_starter/content.ts` file — every field has a `// WHAT THIS DOES:` comment and an example.
