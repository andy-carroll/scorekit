# ScoreKit

ScoreKit is a ScoreApp-like questionnaire/audit platform.

## What this repo is

- A generic engine for multi-step audits (25–35 questions)
- Email gate → instant on-page report unlock
- Shareable score + report
- PDF delivery via email
- Integrations (e.g., GoHighLevel) without using GHL front-end

## What V1 includes

- Deterministic scoring (answers drive scoring)
- Report rendering (web) + PDF export + email delivery
- Share card + mobile share (Web Share API)
- Template-based audits (multiple ICPs)

## What V1 explicitly excludes

- Deep research enrichment (planned post-V1 as a separate appendix module)

## Where to look

- `docs/00-overview/README.md` for the overall context
- `docs/03-engineering/ARCHITECTURE.md` for system boundaries
- `audits/` for template definitions (questions, scoring, copy)
