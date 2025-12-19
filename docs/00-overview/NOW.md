# Now

## NOW: Current Focus

**Status**: Building  
**Last Updated**: 19 Dec 2025

**Design system complete.** All pages (landing, quiz, email, report) now use the Accelerator theme via centralized CSS variables and component classes.

**Recent work:**

- Email gate UI now fully conforms to design system (no inline styles; consistent CTA + icon badge)
- Quiz progress pills adjusted for stronger contrast (no washed-out low-opacity states)
- CI added: GitHub Actions runs `pnpm test` + `pnpm build` on PRs and pushes to `main`
- Quiz + email gate now use a consistent "device-frame" panel layout (sticky header + footer inside the panel; scrollable content)
- Quiz navigation now uses a stable bottom action bar (no jumping between questions)
- Decision documented: staged report access token model (contract-first; storage upgrades local → API → Supabase): `docs/01-product/PRD-REPORT-ACCESS-TOKEN-MODEL.md`
- Tokenised report access implemented (Stage 0 localStorage): `/email` creates report token, `/report/[id]` loads by token; refresh-safe
- Vitest setup updated to avoid Node v25 `localStorage` warning (future cleanup ticket added to pin Node LTS)
- PDF download now works end-to-end (fixed `pdfkit` font bundling issue)
- Quiz section intro screens updated to feel like clear slide-deck section breaks
- Vercel deployment set up so others can test the full flow via a link

**Ensure alignment with BEADS tickets system** [BEADS_REFERENCE.md](BEADS_REFERENCE.md)

## Completed

- ✅ V1 thin-slice: 5-question quiz → email gate → report page
- ✅ PRD updated: business case builder, value quantification, context questions
- ✅ 22 Beads tickets created across implementation phases
- ✅ Session start/finish workflow commands created
- ✅ **Phase 1: Data Model**
  - `@scorekit/core` package with Question + Template types
  - Template loader with validation
  - Type guards and helpers
- ✅ Development workflow defined (`WORKFLOW.md`)
- ✅ **Phase 2: Question Framework (UI)**
  - `QuestionCard` component with all input types (radio, select, multi-select, text, number, range, choice)
  - `PillarIntro` component for section intros
  - `SectionProgress` component with completion checkmarks
  - Pillar-grouped quiz flow (7 sections, 30 questions)
- ✅ **30 Questions Written**
  - 4 context questions (role, employees, industry, trigger)
  - 5 Leadership questions
  - 5 Data questions
  - 5 People questions
  - 5 Process questions
  - 4 Culture questions
  - 2 Goals questions (frustrations, aspirations)
- ✅ **Report Redesign PRD** (`PRD-REPORT-REDESIGN.md`)
  - JTBD analysis, wireframes, implementation approach
  - AI tooling, security, cost, abuse prevention
- ✅ **Content Structure** (`CONTENT-STRUCTURE.md`)
  - File-based multi-template CMS approach
  - Template registry pattern for future templates
- ✅ **Report Redesign** (Phase 5 MVP)
  - Band-specific headlines and intros
  - Pillar insights based on score level (low/medium/high)
  - Strength callout + personalised next steps
  - Premium dark hero section with score badge
- ✅ **Template Content System** (Phase 6)
  - `packages/core/src/templates/ai-readiness/content.ts`
  - Band intros, pillar labels, pillar insights, recommendations
  - Template registry for multi-template support
  - Report page imports from template (clean separation)
- ✅ **Design System & Theming** (Phase 7)
  - Multi-theme architecture (`accelerator.css`, `default.css`)
  - Shared tokens (`base.css`, `typography.css`, `animations.css`)
  - Spline Sans font extracted from Accelerator website
  - Real Accelerator logo downloaded
  - `BrandHeader` component with logo slot
  - Landing page redesigned with dark hero, cap-height highlights
  - Button and typography refinements

## Next: Theme Rollout + PDF

**Priority:** PDF generation for shareable reports.

| Ticket | Description |
|--------|-------------|
| `scorekit-qzo` | PDF generation & sharing |
| `scorekit-su6` | Write recommendations + patterns |

## Implementation phases

1. ~~Data Model~~ ✓
2. ~~Question Framework (UI)~~ ✓
3. Scoring Engine (defer — current scoring works for MVP)
4. Value Calculation (defer — needs cost/value questions)
5. ~~Report Generator + UI~~ ✓
6. ~~AI Readiness Template Content~~ ✓
7. **Polish & Integration** ← Current priority (PDF, GHL)

## V1 completion definition

- Full 30-question template with context questions ✓
- Business case report (cost of inaction, value of transformation)
- PDF emailed
- GHL tags + workflow triggered
- Premium UI (not AI cookie-cutter)
