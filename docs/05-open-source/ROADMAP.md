# Roadmap

## V1 (current release train)

- [x] Web questionnaire engine
- [x] Deterministic scoring + on-page report rendering
- [ ] Report access token model (local → API → Supabase) — see `docs/01-product/PRD-REPORT-ACCESS-TOKEN-MODEL.md`
- [x] Share card + mobile share
- [ ] PDF export + email delivery (download shipped; delivery workflow in progress)
- [ ] GHL integration (webhook + sync to pipeline/workflows)
- [ ] Template system with 3 initial templates (AI Readiness live; others in progress)

## V1.x (near-term enhancements)

- [ ] Additional templates
- [ ] Improved analytics and completion insights
- [ ] Automatic brand extraction from a website URL (logo + colors + typography → `TemplateBrand` + assets)
  - Input: website URL (or a known “brand id”)
  - Fetch: logo assets (SVG/PNG) + favicon + key pages for palette sampling
  - Extract: primary/secondary/accent + text/surface/background defaults
  - Output: `TemplateBrand` JSON + `apps/web/public/logos/<brand>.svg`
  - PDF-ready: run `pnpm convert-logos` to generate `apps/web/public/logos/<brand>.png`
  - Future: optional font detection + Google Fonts mapping (manual override always supported)

## V1.1 (backlog/next wave)

- [ ] Deep research appendix module (separate artefact)
  - confirm/rerun/reject
  - citations
  - provider abstraction
