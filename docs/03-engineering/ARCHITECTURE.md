# Architecture

## Overview

ScoreKit is a template-driven audit engine with a web app front-end and pluggable integrations.

## Boundaries

- Core domain (audit schema, scoring, report contract)
- UI/design system
- Integrations (GHL, email)
- Template content (questions, copy, recommendations)

## V1 runtime flow

1. User completes assessment
2. Email gate unlocks report
3. Report is rendered on-page
4. PDF is generated and emailed
5. Lead is upserted into GHL and tagged

## Post-V1

- Research appendix module is separate and must not affect scoring
