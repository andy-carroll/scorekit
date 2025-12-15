# Principles

## Product principles

- Premium-by-default: the UI must feel refined, calm, and trustworthy.
- Clarity over cleverness: users should understand what their score means.
- Fast path to value: report unlock is instant after email capture.
- Shareable outputs: score + card must be easy to share (especially on mobile).

## Engineering principles

- Deterministic scoring: research and AI features must not affect numeric scores.
- Template-driven: audits are data/config and copy, not hard-coded flows.
- Pluggable integrations: providers (email, GHL, storage) behind interfaces.
- Safe defaults: avoid foot-guns; explicit failure states; rerun/retry for recoverable actions.

## Anti-slop rules

- No generic AI filler copy.
- No “AI magic” claims without traceability.
- No random UI choices: typography, spacing, motion and charts must follow the design spec.
