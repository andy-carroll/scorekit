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

- [ ] FitMum template (second live client)
- [ ] Improved analytics — completion rate, drop-off by question, score distribution
- [ ] Automatic brand extraction from a URL (logo + palette → `TemplateContent.brand`)
  - Input: website URL
  - Extract: primary/accent/dark colors, logo SVG/PNG
  - Output: `brand.colors` JSON + `public/logos/<brand>.svg`
  - PDF-ready: `pnpm convert-logos`

## V1.1 (backlog)

- [ ] Deep research appendix module (separate artefact attached to report)
  - Confirm / rerun / reject controls
  - Citations
  - AI provider abstraction
- [ ] Rate limiting on API routes
- [ ] Additional email providers (Resend, Postmark)
