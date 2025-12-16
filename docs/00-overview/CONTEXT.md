# Context

> **Last updated**: Dec 2025

## What we're building

A **template-driven assessment engine** that produces business case documents, not scorecards. The output helps respondents articulate pain, quantify costs, and justify transformation investment.

## Current decisions

- V1 ships without deep research enrichment
- Deterministic scoring from answers only (no AI generation)
- Assessment = business case builder, not just a quiz
- Context questions (pain, cost, aspiration) are as important as diagnostic questions
- Apache 2.0 for open-source core
- Monetisation via:
  - Hosted managed edition
  - Lifetime Self‑Host Pro Templates + Support Pack (no compute)

## Initial templates (V1)

| Template | ICP | Core question |
|----------|-----|---------------|
| **AI Readiness** | Founder/MD at scaling company | "How ready is your business to adopt AI?" |
| **Project & Admin Chaos** | COO/Ops lead at SMB | "Where is operational friction costing you?" |
| **Talent Acquisition** | TA lead or recruitment agency owner | "What's holding back your hiring function?" |

**First to ship**: AI Readiness template

## Tech stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Core package**: `@scorekit/core` (types, template loader, scoring)
- **Testing**: Vitest
- **Package manager**: pnpm (monorepo)
- **Deployment**: TBD (likely Vercel)
- **CRM integration**: GoHighLevel

## Key artifacts

- PRD: `docs/01-product/PRD-ASSESSMENT-FRAMEWORK.md`
- Workflow: `docs/00-overview/WORKFLOW.md`
- Current status: `docs/00-overview/NOW.md`
