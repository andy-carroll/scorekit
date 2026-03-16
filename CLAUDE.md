# ScoreKit — AI Agent Orientation

## What this is

ScoreKit is a white-label quiz/assessment platform. One codebase, multiple branded quiz templates. V1 is live as the **AI Readiness Assessment** for Accelerator-X.

User flow: Landing page → Quiz → Email gate → Report page (+ PDF emailed automatically)

## Stack

- **Monorepo**: pnpm workspace — `apps/web` (Next.js 15 App Router) + `packages/core` (shared types, templates, scoring)
- **PDF generation**: pdfkit (server-side, Node.js API route) — NOT Puppeteer/headless Chrome
- **Storage**: Upstash KV (Redis) for report persistence
- **Email**: Brevo (transactional) with PDF attachment
- **Webhook**: n8n (fire-and-forget POST on form submit)
- **Deployment**: Vercel

## Critical files

| File | What it does |
|------|-------------|
| `packages/core/src/templates/ai-readiness/content.ts` | All copy, brand, insights, recommendations for the live template |
| `apps/web/src/lib/questions.ts` | Questions, sections, scoring logic |
| `apps/web/src/app/api/report/pdf/route.ts` | **PDF renderer** — ~1100 lines of pdfkit layout code |
| `apps/web/src/app/api/report/pdf/theme.ts` | PDF theme builder — reads brand colours from template |
| `apps/web/src/app/api/report/email/route.ts` | Email delivery with PDF attachment |
| `apps/web/src/lib/active-template.ts` | Template registry + loader |

## The PDF is the highest-stakes output

Every respondent receives a branded PDF report via email. **Every piece of text in the PDF comes from the template's `content.ts`**. If you change `bandIntros`, `pillarInsights`, `recommendations`, `nextSteps`, `pillarLabels`, or `cta` in `content.ts`, you are changing what appears in every PDF sent to leads.

Read `docs/05-open-source/PDF-RENDERER.md` before touching any PDF code. Key gotchas:
- pdfkit cannot render SVG — logos must be `.png`
- After `switchToPage()`: never use `continued: true` (spawns pages), never call `widthOfString()` (returns NaN)
- Footer drawing requires temporarily zeroing `doc.page.margins.bottom`
- The PDF renderer currently hardcodes `aiReadinessContent` — see the "Known limitation" section in the docs

Test PDF changes with: `node apps/web/scripts/test-pdf.mjs` (requires dev server running)

## Template authoring

To create a new quiz template, follow `docs/06-template-authoring/README.md`. The critical fields for PDF quality are documented there with a "what goes wrong" table.

## Conventions

- Use pnpm (not npm/yarn)
- Secrets in env vars only — never committed
- `@scorekit/core` for shared logic — don't duplicate in `apps/web`
- CSS custom properties for web theming; `PdfTheme` object for PDF colours
- All colours in the PDF come from the theme — no inline colour literals

## Running locally

```bash
pnpm install
pnpm dev --filter=web        # Start Next.js dev server
pnpm test                     # Run all tests
node apps/web/scripts/test-pdf.mjs   # Generate test PDF (needs dev server)
```

## Docs structure

```
docs/
  05-open-source/
    PDF-RENDERER.md           ← PDF architecture deep-dive (read this first for PDF work)
  06-template-authoring/
    README.md                 ← 5-step template creation guide
    01-quiz-design-prompt.md  ← AI prompt to design a quiz from scratch
    02-worksheet.md           ← Structured fill-in questionnaire
    03-template-generation-prompt.md  ← AI prompt to generate content.ts
```
