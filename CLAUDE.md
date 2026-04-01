# ScoreKit — AI Agent Orientation

## What this is

ScoreKit is a white-label quiz/assessment platform. One codebase, multiple branded quiz templates. It functions as both a **customer discovery tool** (structured diagnostic data on every lead) and a **lead magnet** (respondents get a premium PDF report they'd otherwise pay £2k–£5k to receive).

V1 is live as the **AI Readiness Assessment** for Accelerator-X at **quiz.accelerator-x.ai**. The platform itself is open-source — see `docs/05-open-source/` for licensing strategy.

User flow: Landing page → Quiz → Email gate → Report page (+ PDF emailed automatically)

## Stack

- **Monorepo**: pnpm workspace — `apps/web` (Next.js 16 App Router) + `packages/core` (shared types, templates, scoring)
- **PDF generation**: pdfkit (server-side, Node.js API route) — NOT Puppeteer/headless Chrome
- **Storage**: Upstash KV (Redis) for report persistence
- **Email**: Brevo (transactional) with PDF attachment
- **Webhook**: n8n (fire-and-forget POST on form submit)
- **Deployment**: Vercel

## App routes

| Route | File | Role |
|-------|------|------|
| `/` | `apps/web/src/app/page.tsx` | Landing page |
| `/quiz` | `apps/web/src/app/quiz/page.tsx` | Quiz engine — writes `scorekit_answers` + `scorekit_result` to `sessionStorage` on completion |
| `/email` | `apps/web/src/app/email/EmailGatePage.tsx` | Email gate — reads sessionStorage, creates report token, pushes to `/report/[token]` |
| `/report/[id]` | `apps/web/src/app/report/[id]/page.tsx` | Report viewer — fetches from Upstash KV server-side; falls back to client-side localStorage in local dev |
| `/demo` | `apps/web/src/app/demo/` | Demo/preview route |

**State handoff:** Quiz → `sessionStorage` → Email gate → Upstash KV (keyed by token) → Report page. The token is the only thing that crosses page boundaries via the URL.

## Critical files

| File | What it does |
|------|-------------|
| `packages/core/src/templates/ai-readiness/content.ts` | All copy, brand, insights, recommendations for the live template |
| `apps/web/src/lib/questions.ts` | Questions, sections, scoring logic |
| `apps/web/src/app/api/report/pdf/route.ts` | **PDF renderer** — ~1200 lines of pdfkit layout code |
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

## What NOT to do

- **Don't add questions in `apps/web`** — questions belong in the template's `content.ts` in `packages/core`
- **Don't hardcode colours in the PDF** — all colours must come from the `PdfTheme` object
- **Don't use SVG logos in the PDF** — pdfkit can't render SVG; run `pnpm convert-logos` to generate `.png` versions
- **Don't touch the PDF renderer without reading `docs/05-open-source/PDF-RENDERER.md` first** — there are multiple non-obvious constraints around `switchToPage()`, `continued: true`, and footer rendering
- **Don't duplicate template copy in `apps/web`** — landing page and email gate copy is still partially hardcoded (known gap); don't make it worse

## Template authoring

To create a new quiz template, follow `docs/06-template-authoring/README.md`. The critical fields for PDF quality are documented there with a "what goes wrong" table.

## Conventions

- Use pnpm (not npm/yarn)
- Secrets in env vars only — never committed
- CSS custom properties for web theming; `PdfTheme` object for PDF colours
- All colours in the PDF come from the theme — no inline colour literals

### `@scorekit/core` public API

Shared logic lives in `packages/core/src/` — import via `@scorekit/core`, never duplicate in `apps/web`.

Key exports: `Template`, `Question`, `Pillar`, `Band` types · `loadTemplate()` · `mapAnswersToPillars()` · template registry

Entry point: `packages/core/src/index.ts`

## Running locally

```bash
pnpm install
pnpm dev                      # Start Next.js dev server (alias for --filter=web)
pnpm test                     # Run all tests
pnpm test:watch               # Watch mode during development
pnpm typecheck                # TypeScript type check across all packages (run before pushing)
pnpm build                    # Production build
pnpm test:pdf                 # Generate test PDF (alias; needs dev server running)
node apps/web/scripts/test-pdf.mjs   # Generate test PDF directly
```

## Environment variables

Copy `apps/web/.env.example` to `apps/web/.env.local`. Key vars:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Yes | Full public URL — used in report email links |
| `UPSTASH_REDIS_REST_URL` | Recommended | KV store for report persistence (falls back to localStorage without it) |
| `UPSTASH_REDIS_REST_TOKEN` | Recommended | Auth token for above |
| `BREVO_API_KEY` | Yes (for email) | `xkeysib-...` from app.brevo.com |
| `EMAIL_FROM` | Yes (for email) | Verified sender address |
| `NEXT_PUBLIC_WEBHOOK_URL` | No | n8n/Zapier endpoint for lead capture (fire-and-forget) |

Full reference: `docs/04-ops/ENV-VARS.md`

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
