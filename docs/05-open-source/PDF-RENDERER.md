# PDF Report Renderer — Architecture Reference

This document describes how ScoreKit generates PDF reports. It is intended for contributors, template authors, and AI agents working on this codebase.

---

## Overview

PDF generation is handled entirely server-side using [pdfkit](https://pdfkit.org/) (Node.js). There is no browser-based rendering — no Puppeteer, no headless Chrome, no HTML-to-PDF conversion. The layout is drawn programmatically using pdfkit's drawing API (rectangles, text, lines, images).

The core export function is:

```typescript
// apps/web/src/app/api/report/pdf/route.ts
export async function renderPdf(report: ReportRecord): Promise<Buffer>
```

It takes a `ReportRecord` (the stored report — scores, answers, lead info) and returns a binary PDF buffer.

---

## Two entry points, one renderer

`renderPdf()` is called from two places:

| Route | When | Returns |
|-------|------|---------|
| `POST /api/report/pdf` | User clicks "Download PDF" on the report page | Binary PDF (`application/pdf`) streamed as a file download |
| `POST /api/report/email` | Automatically after the user submits the email gate form | PDF buffer is base64-encoded and attached to the Brevo email |

Both call the same `renderPdf()` function. The PDF a user downloads is identical to the one emailed to them.

---

## PDF structure

### Page 1 — Executive Snapshot

`renderPage1ExecutiveSnapshot(doc, report, theme, reportUrl)`

**Layout (top to bottom):**
1. **Header bar** — logo (top-left), template name, lead name + company, "Executive snapshot" label
2. **Hero card** — overall score (large %, left column), band label pill, band headline + intro text (right column)
3. **Two-column grid:**
   - Left: "Next steps" — strength/opportunity summary, then all next steps with numbered badge, title, description
   - Right: "Readiness by pillar" — colour-coded bar chart for each pillar (label, score, filled bar)
4. **CTA block** — branded panel, headline, body text, pill-shaped button with hyperlink

**Data sources:**
- `report.result.percentage` — overall score
- `report.result.band` — band label (e.g. "Progressing")
- `report.result.pillarScores` — per-pillar scores
- `aiReadinessContent.bandIntros[band]` — headline + intro text for the band ⚠️ see note below
- `aiReadinessContent.nextSteps` — all next steps (HTML parity) ⚠️
- `aiReadinessContent.pillarLabels` — human-readable pillar names ⚠️
- `aiReadinessContent.cta` — CTA headline, body, button text ⚠️

### Page 2+ — Insights & Recommendations

`renderPage2InsightsAndRecommendations(doc, report, theme, reportUrl)`

**Layout:**
1. **Header bar** — "Insights & Recommendations" title + subtitle
2. **Strength card** — highest-scoring pillar, name + score + insight text
3. **Focus area cards** (×3) — the three lowest-scoring pillars, each with:
   - Pillar name + score/level chip ("2.1/5 · Needs focus")
   - Colour-coded accent stripe (red/primary/emerald matching HTML report)
   - Insight title (brief framing sentence)
   - Insight body (2–3 sentence explanation)
   - Score bar
   - Recommendation box (headline + action)
4. **CTA repeat** — same branded CTA from page 1

Pagination: focus cards use relative-offset-then-absolute-position pattern to avoid the y-position invalidation bug when a page break resets `cursorY`.

**Level mapping:** `score ≤ 2.2 → "low"`, `≤ 3.6 → "medium"`, `> 3.6 → "high"`

**Data sources:**
- `aiReadinessContent.pillarInsights[pillarId][level]` — `{ title, insight }` ⚠️
- `aiReadinessContent.recommendations[pillarId]` — `{ headline, action }` ⚠️
- `aiReadinessContent.pillarLabels` ⚠️
- `aiReadinessContent.cta` ⚠️

### Answer Appendix (multi-page)

`renderPage3AnswerAppendix(doc, theme, mappedAnswersByPillar, pillarScores)`

**Layout:**
- Header bar — "Answer Appendix" title + subtitle
- Compact table-row layout: one card per pillar with colour-coded accent stripe, containing all Q&A rows with thin dividers
- Scored pillars shown first ("How we calculated your scores"), then context/profile questions ("Your Profile")
- Automatically adds new pages when content overflows (`ensureSpace()` + `doc.addPage()`)
- Returns final `cursorY` position so the caller can append the final CTA

### Final CTA

`renderFinalCta(doc, theme, cursorY)`

Appended after the last answer appendix content — a branded "book a call" panel with headline, body text, and centred pill-shaped button. Ensures the PDF ends with a clear call to action rather than trailing off after raw answers.

### Global Footers

`drawGlobalFooters(doc, theme, report, reportUrl)`

Drawn on **every page** after all content is rendered (uses pdfkit's `bufferPages` + `switchToPage` API). Each footer includes:
- Left: "Prepared for [name], [company] · View full report" (hyperlinked)
- Right: page number ("1 / 6")

**Data sources:**
- `mapAnswersToPillars()` from `@scorekit/core` — maps raw answers to pillar groups with display labels
- `aiReadinessContent.pillarLabels` ⚠️
- `report.answers` — the raw answer values stored at form submission

---

## The theme system

`buildPdfTheme()` in `theme.ts` reads from the template's `brand` object and returns a `PdfTheme`:

```typescript
{
  colors: {
    pageBg, headerBg, headerText,
    primary, secondary, accent,
    text, mutedText, border,
    badgeBg, badgeText, surface
  },
  logo: { src }   // file path, .svg replaced with .png
}
```

All three page renderers accept this theme object and use it for every colour value. No inline colour literals appear in the rendering functions — all colours come from the theme.

**Logo handling:**
- Configured via `brand.logo.light` (or `.dark` as fallback) in `content.ts`
- SVG paths are automatically replaced with `.png` — pdfkit cannot render SVG
- The renderer searches multiple candidate paths (`public/`, `apps/web/public/`, etc.) to handle both local dev and Vercel deployment layouts
- If a PNG logo is not found, the logo is silently omitted (a warning is logged, rendering continues)
- **Required action for new templates:** convert your logo to PNG and place it at the path specified in `brand.logo.light` under `apps/web/public/`

---

## ⚠️ Known limitation: hardcoded to AI Readiness template

**Current state:** `route.ts` and `theme.ts` both import `aiReadinessContent` directly:

```typescript
import { aiReadinessContent, ... } from "@scorekit/core";
```

This means all copy inside the PDF — band intros, pillar labels, pillar insights, recommendations, next steps, CTA — is hardcoded to the AI Readiness template. Deploying a different template (`SCOREKIT_TEMPLATE_ID=fitmum`) will generate a PDF with AI Readiness copy inside it.

**The email route does not have this problem** — `/api/report/email/route.ts` correctly uses `getActiveTemplateContent()`.

**Planned fix (Part 2 of the architecture roadmap):**

Replace the direct import in both files:

```typescript
// BEFORE (both route.ts and theme.ts)
import { aiReadinessContent } from "@scorekit/core";

// AFTER
import { getActiveTemplateContent } from "@/lib/active-template";
const content = getActiveTemplateContent();
```

This is safe to do because both files are server-side only (`export const runtime = "nodejs"`). `getActiveTemplateContent()` reads the server-only `SCOREKIT_TEMPLATE_ID` env var — that's fine here.

**Why it's deferred:** The fix is low-risk in isolation but is bundled with the broader "questions into template" architecture work (Part 2), which also needs `buildPseudoTemplate()` replaced. Doing both together avoids a partial state.

---

## `buildPseudoTemplate()` — the answer mapping shim

The answer appendix uses `mapAnswersToPillars()` from `@scorekit/core`, which needs a `Template`-shaped object to map question IDs to pillar groups and resolve display labels. Since the full Template type is richer than what's in `content.ts` today, `buildPseudoTemplate()` constructs a minimal conforming object from:

- `aiReadinessContent.meta` — template id, name, version ⚠️ hardcoded
- `sections` and `getQuestionsForSection()` from `apps/web/src/lib/questions.ts` — pillar + question definitions ⚠️ hardcoded to questions.ts

Once Part 2 is complete (questions moved into template package), `buildPseudoTemplate()` can be replaced with a direct call to the template content.

---

## Adding a new template — what you must provide

For the PDF to render correctly with your template, your `content.ts` must include:

| Field | Used by | Notes |
|-------|---------|-------|
| `brand.colors` | Theme (all pages) | See `PdfTheme` type — needs primary, secondary, accent, text, mutedText, background, surface |
| `brand.logo.light` | Theme (header logo) | Must resolve to a `.png` file under `apps/web/public/` |
| `meta.templateName` | Page 1 header | Displayed as the report title |
| `pillarLabels` | All pages | `{ [pillarId]: "Human Name" }` |
| `bandIntros` | Page 1 hero | `{ [bandLabel]: { headline, intro } }` — one entry per band |
| `nextSteps` | Page 1 | Array of `{ title, description }` — first 3 are used |
| `pillarInsights` | Page 2 | `{ [pillarId]: { low: { title, insight }, medium: {...}, high: {...} } }` |
| `recommendations` | Page 2 | `{ [pillarId]: { headline, action } }` |
| `cta` | Pages 1, 2, and final page | `{ headline, body, buttonText, url }` |

**Currently these are only read from `aiReadinessContent` directly.** Until the hardcoded dependency is resolved, a new template's copy will not appear in the PDF. The _starter template and template authoring guide note this as a known limitation.

---

## Styling and layout — what's customisable vs fixed

| Customisable (via `content.ts`) | Fixed in code |
|---------------------------------|---------------|
| All colours | Page dimensions (A4) |
| Logo | Margin sizes (48pt) |
| All copy (headlines, insights, next steps, CTA) | Font family (Helvetica/Helvetica-Bold — pdfkit built-in) |
| Pillar order (driven by `pillarLabels` key order) | Multi-page structure (exec → insights → appendix → CTA) |
| Band names and thresholds | Layout grid (two-column on page 1) |
| | Global footer on every page (report URL + page numbers) |

Font family is constrained to pdfkit's built-in fonts (`Helvetica`, `Helvetica-Bold`, `Times-Roman`, `Courier`) unless custom `.ttf` fonts are registered. The web app uses Aptos (via Google Fonts) — this does not carry through to the PDF.

---

## File locations

```
apps/web/src/app/api/report/pdf/
  route.ts     — renderPdf(), page renderers, POST handler
  theme.ts     — buildPdfTheme() — reads brand from template
```
