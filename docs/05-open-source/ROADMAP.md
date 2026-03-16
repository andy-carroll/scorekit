# Roadmap

## V1 (current release)

- [x] Web questionnaire engine
- [x] Deterministic scoring + on-page report rendering
- [x] Report access token model — Upstash KV, 1-year TTL, cross-device shareable links
- [x] PDF export (download)
- [x] PDF email delivery via Brevo (transactional, PDF attachment)
- [x] Template-driven architecture — copy, brand, questions, scoring all in `content.ts`
- [x] Multi-tenant model — one codebase, `SCOREKIT_TEMPLATE_ID` env var per Vercel project
- [x] Accelerator-X design system — Aptos font, teal/pink palette, CSS custom property theming
- [x] n8n webhook integration (fire-and-forget → Airtable CRM)
- [x] Deployment guide (Vercel + Upstash KV + Brevo + DNS)

## V1.x (near-term)

- [ ] **"Other" free-text capture on context questions** — when a respondent selects an option with `id: "other"`, a required text input appears asking them to specify. Applies to `select`, `multi-select`, and `radio` input types on context (unscored) questions only.
  - Store free text as a companion key: `{questionId}-other-text` in the answers object — no schema changes
  - Display in report Q&A section as *"Other — [their text]"* instead of bare *"Other"*
  - Flows through to webhook payload automatically
  - **Design principle (must be documented):** "Other" is not valid on scored (diagnostic) questions. Scored questions use a 1–5 maturity scale where every option maps to a specific numeric value — "Other" has no meaningful score and would either distort pillar averages or break them. If respondents are reaching for "Other" on a scored question, the options need to be rewritten. This is enforced by convention, not code.
  - Files to change: `QuestionCard.tsx` (conditional text input), `quiz/page.tsx` (store companion key), report view (display other-text)

- [ ] FitMum template (second live client)
- [ ] Improved analytics — completion rate, drop-off by question, score distribution
- [ ] Automatic brand extraction from a URL (logo + palette → `TemplateContent.brand`)
  - Input: website URL
  - Extract: primary/accent/dark colors, logo SVG/PNG
  - Output: `brand.colors` JSON + `public/logos/<brand>.svg`
  - PDF-ready: `pnpm convert-logos`

- [ ] **PDF renderer — replace hardcoded `aiReadinessContent` with `getActiveTemplateContent()`** — `route.ts` and `theme.ts` both import the AI Readiness template directly. Until this is fixed, deploying a different template will produce a PDF containing AI Readiness copy. Low-risk change (server-only files) but bundled with the Part 2 architecture work so it's done once cleanly.
  - Replace `import { aiReadinessContent }` in both files with `getActiveTemplateContent()` from `@/lib/active-template`
  - Replace `buildPseudoTemplate()` (which hardcodes sections/questions) with template-package data
  - See `docs/05-open-source/PDF-RENDERER.md` for full context

## V1.1 (backlog)

- [ ] **Optional free-form field at end of each scored section** — an unscored, optional text input shown after each pillar's questions: *"Anything else you'd like to add about [pillar name]?"* Captures nuance that the 1–5 scale can't. Richer discovery data before a sales call; could feed AI-generated commentary in a future premium tier. Not urgent — the scored questions already provide strong signal.

- [ ] Deep research appendix module (separate artefact attached to report)
  - Confirm / rerun / reject controls
  - Citations
  - AI provider abstraction
- [ ] Rate limiting on API routes
- [ ] Additional email providers (Resend, Postmark)
