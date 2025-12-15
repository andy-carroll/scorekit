# ADR 0001: Architecture Baseline

## Status

Accepted

## Decision

Use a monorepo structure with:

- `apps/` for deployable applications
- `packages/` for reusable domain + integrations
- `audits/` for template content/config
- `docs/` for maintained context and specs

## Rationale

- Enables template-driven scaling
- Keeps platform logic separate from template content
- Supports open-source core + optional hosted edition
