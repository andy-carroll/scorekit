# Report Contract

## Purpose

Define the canonical report JSON schema and traceability rules.

## Traceability rules

- Numeric score is derived only from answers + scoring config.
- Any enriched narrative must declare its inputs:
  - Based on answers
  - Based on template copy
  - (Post-V1) Based on public research appendix

## Report sections (suggested)

- Executive summary
- Overall score and maturity band
- Pillar breakdown
- Primary constraint
- Top 3 focus areas
- 30/60/90-day roadmap
- Resources

## Identifiers

- report_id
- template_id
- template_version
- created_at

## Sharing

- Share card inputs must be derived from the report contract
