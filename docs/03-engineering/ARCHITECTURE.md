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
│   │   ├── page.tsx          # Landing page
│   │   ├── quiz/page.tsx     # Multi-step questionnaire
│   │   ├── email/page.tsx    # Email capture gate
│   │   └── report/[id]/page.tsx  # Report display
│   ├── components/
│   │   ├── QuestionCard.tsx  # Single question UI
│   │   └── ProgressBar.tsx   # Quiz progress indicator
│   └── lib/
│       └── questions.ts      # Question definitions + scoring logic
```

## Boundaries

- **Core domain**: audit schema, scoring, report contract
- **UI/design system**: components, Tailwind tokens
- **Integrations**: GHL, email (n8n or direct)
- **Template content**: questions, copy, recommendations

## V1 runtime flow

1. User lands on `/` → clicks "Start Assessment"
2. User completes quiz at `/quiz` (5 questions, auto-advance)
3. Email gate at `/email` captures lead info
4. Report rendered at `/report/[id]` with score + pillar breakdown
5. (Planned) PDF generated and emailed
6. (Planned) Lead upserted into GHL with tags

## Current state (Dec 2024)

- ✅ Landing page
- ✅ Quiz flow (5 questions)
- ✅ Email gate
- ✅ Report page with scoring
- ⏳ GHL integration (planned)
- ⏳ PDF generation (planned)
- ⏳ Share card (planned)

## Post-V1

- Research appendix module is separate and must not affect scoring
