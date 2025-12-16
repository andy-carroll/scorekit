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
- Shareable score + report
- PDF delivery via email (planned)
- Integrations (e.g., GoHighLevel) without using GHL front-end

## What V1 includes

- Deterministic scoring (answers drive scoring)
- Report rendering (web) + PDF export + email delivery
- Share card + mobile share (Web Share API)
- Template-based audits (multiple ICPs)

## What V1 explicitly excludes

- Deep research enrichment (planned post-V1 as a separate appendix module)

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

## Where to look

- `docs/00-overview/README.md` – overall context
- `docs/03-engineering/ARCHITECTURE.md` – system boundaries
- `apps/web/src/lib/questions.ts` – question definitions + scoring
