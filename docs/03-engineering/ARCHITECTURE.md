# Architecture

## Overview

ScoreKit is a template-driven audit engine with a web app front-end and pluggable integrations.

## Tech stack (V1)

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Package manager | pnpm |
| State | React hooks + sessionStorage (V1) |
| Backend | Planned: Supabase or API routes |
| CRM | GoHighLevel (webhook integration) |

## File structure

```text
apps/web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── quiz/page.tsx         # Multi-step questionnaire (30 questions)
│   │   ├── email/page.tsx        # Email capture gate
│   │   └── report/[id]/page.tsx  # Report display (insight-driven)
│   ├── components/
│   │   ├── QuestionCard.tsx      # Single question UI (all input types)
│   │   ├── PillarIntro.tsx       # Section intro cards
│   │   ├── SectionProgress.tsx   # Quiz progress with checkmarks
│   │   └── ProgressBar.tsx       # Quiz progress indicator
│   └── lib/
│       └── questions.ts          # Question definitions + scoring logic

packages/core/
├── src/
│   ├── types.ts                  # Core types (Question, Template, etc.)
│   ├── template-loader.ts        # Template validation + loading
│   └── templates/
│       ├── index.ts              # Template registry
│       └── ai-readiness/
│           ├── content.ts        # Report copy (bands, pillars, CTAs)
│           └── index.ts          # Template export
```

## Boundaries

- **Core domain**: audit schema, scoring, report contract
- **UI/design system**: components, Tailwind tokens
- **Integrations**: GHL, email (n8n or direct)
- **Template content**: questions, copy, recommendations

## V1 runtime flow

1. User lands on `/` → clicks "Start Assessment"
2. User completes quiz at `/quiz` (30 questions, pillar-grouped)
3. Email gate at `/email` captures lead info
4. Report rendered at `/report/[id]` with insight-driven narrative
5. (Planned) PDF generated and emailed
6. (Planned) Lead upserted into GHL with tags

## Current state (Dec 2025)

- ✅ Landing page
- ✅ Quiz flow (30 questions, 7 sections, pillar intros)
- ✅ Email gate
- ✅ Report page (insight-driven, band + pillar content)
- ✅ Template content system (file-based, type-safe)
- ⏳ GHL integration (planned)
- ⏳ PDF generation (planned)
- ⏳ Share card (planned)

## Post-V1

- Research appendix module is separate and must not affect scoring
