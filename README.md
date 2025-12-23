# ScoreKit

Open-source questionnaire/audit platform. Build ScoreApp-style assessments with email capture, instant reports, and CRM integration.

## Tech stack

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Package manager**: pnpm
- **Licence**: Apache 2.0

## Quick start

```bash
cd apps/web
pnpm install
pnpm dev
# → http://localhost:3000
```

## What this repo is

- Generic engine for multi-step audits (5–35 questions per template)
- Email gate → instant on-page report unlock
- Shareable score + report (web)
- Downloadable PDF report (via API)
- PDF delivery via email (planned)
- Integrations (e.g., GoHighLevel) without using GHL front-end

## What V1 includes

- Deterministic scoring (answers drive scoring)
- Report rendering (web)
- PDF export (download)
- Template-based audits (multiple ICPs)

## What V1 explicitly excludes

- Deep research enrichment (planned post-V1 as a separate appendix module)

## Branding & logo pipeline (SVG → PNG → PDF)

ScoreKit supports brand-forward PDF reports by deriving a `PdfTheme` from the active template’s brand pack.

Key constraint: `pdfkit` does not render SVGs reliably, so PDF logos must be raster (PNG).

- **Brand pack lives in**: `packages/core/src/templates/<template>/content.ts` (`content.brand`)
- **Web logo asset**: SVG in `apps/web/public/logos/<brand>.svg`
- **PDF logo asset**: PNG in `apps/web/public/logos/<brand>.png` (generated)

Conversion helper:

```bash
pnpm convert-logos
```

PDF behaviour:

- `apps/web/src/app/api/report/pdf/theme.ts` prefers a `.png` logo when an `.svg` is configured.
- `apps/web/src/app/api/report/pdf/route.ts` attempts multiple filesystem locations and logs a warning if the logo cannot be rendered.

## Repo structure

```text
apps/
  web/                  # Next.js frontend
    src/
      app/              # Pages (quiz, email, report)
      components/       # UI components
      lib/              # Questions, scoring logic
docs/                   # Product + engineering docs
.beads/                 # Issue tracker (git-synced)
```

## Design System

ScoreKit includes a **multi-theme design system** that allows you to white-label the entire product by changing a single import. All components use CSS custom properties and utility classes defined in theme files.

**To switch themes**, change the import in `apps/web/src/app/globals.css`:

```css
@import "../styles/themes/accelerator.css";  /* Current theme */
/* @import "../styles/themes/default.css"; */
```

See [docs/02-design/DESIGN-SYSTEM.md](docs/02-design/DESIGN-SYSTEM.md) for the full specification including:

- Token categories (colors, typography, spacing, shapes, motion)
- Component classes (buttons, cards, typography)
- How to add new themes
- Brand slot system (logos, headers)

## Where to look

- `docs/00-overview/README.md` – overall context
- `docs/02-design/DESIGN-SYSTEM.md` – theming architecture + brand support
- `docs/03-engineering/ARCHITECTURE.md` – system boundaries
- `apps/web/src/lib/questions.ts` – question definitions + scoring
