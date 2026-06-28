# ADR 0002: Multi-template resolution (questions, bands, PDF)

## Status

Accepted

## Context

ScoreKit is white-label: one codebase, one Vercel project per client, each
selecting a template via the `SCOREKIT_TEMPLATE_ID` env var. Until now only
report **content** was template-aware. Three things were still hardcoded to the
AI Readiness template, which blocked shipping a genuine second template:

- `apps/web/src/lib/questions.ts` was a single global module — the quiz rendered
  the same questions regardless of the active template.
- Score band names were hardcoded in `calculateScore()`.
- The PDF renderer (`api/report/pdf/route.ts`, `theme.ts`) imported
  `aiReadinessContent` directly, so any template's PDF showed AI Readiness copy.

## Decision

- **Per-template question registry.** `apps/web/src/lib/questions/` holds one
  module per template (`ai-readiness.ts`, `ai-capability.ts`) plus an `index.ts`
  resolver. The active set is chosen by `NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID` — the
  client-visible twin of `SCOREKIT_TEMPLATE_ID`, required because the quiz is a
  client component. `index.ts` re-exports the prior public surface
  (`sections`, `getQuestionsForSection`, `getPillarSections`, `calculateScore`,
  `Question`) so no call sites change.
- **Content-driven score bands.** `TemplateContent` gains an optional
  `bands?: Band[]`. `calculateScore` resolves the band from the active template's
  `bands` by percentage (minScore inclusive, maxScore exclusive, top band
  inclusive at 100); when absent it falls back to the original hardcoded 4-band
  logic. Band `name` values must match `bandIntros` keys.
- **PDF renders the active template.** `route.ts` and `theme.ts` resolve copy and
  theme via `getActiveTemplateContent()` (server-side, reads
  `SCOREKIT_TEMPLATE_ID`). Optional `report.pdfLabels` lets a template relabel
  PDF-only strings (e.g. "OVERALL READINESS" → "OVERALL CAPABILITY"); defaults
  equal the prior AI Readiness wording.

## Rationale

- Generalises the platform to N templates without per-deployment forks — directly
  unblocks the AI Capability template and the planned COO / recruitment templates.
- All defaults preserve AI Readiness behaviour byte-for-byte, so the live product
  is unaffected (verified by an independent review + page-by-page PDF check).
- Keeps platform logic separate from template content, consistent with ADR 0001.

## Consequences

- A deployment must set **both** `SCOREKIT_TEMPLATE_ID` (server: content + PDF)
  **and** `NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID` (client: question set) to the same
  value. `getActiveTemplateContent()` enforces this: it throws if the effective
  server and client template ids diverge, failing fast at the first server-side
  resolution rather than silently emitting a report whose scores and content come
  from different templates (#17). Both default to `ai-readiness`, so a
  single-template deployment is unaffected.
- Pillar structure for the PDF is still derived from the active question set via
  `buildPseudoTemplate()` rather than from `content.pillars`; a future
  "pillars in content" refactor remains open but no longer blocks per-template
  PDF copy.
