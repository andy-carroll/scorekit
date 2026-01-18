# Integration Guide (generic)

This guide describes a way to connect ScoreKit to your own data store and CRM without exposing private infrastructure details. It assumes Airtable or Supabase for storage and n8n (or any webhook-capable tool) as the broker.

## Goals

- Keep ScoreKit front end unchanged.
- Upsert leads + quiz submissions into your system of record via webhook.
- Keep submit non-blocking (report still unlocks even if the webhook fails).
- Optionally mirror to a CRM (e.g., GoHighLevel, HubSpot) for nurture.

## Minimal flow

1) ScoreKit email gate POSTs to a webhook (n8n recommended).
2) Webhook normalises data and upserts your store:
   - **Prospect**: email (key), name, company, role, website.
   - **Submission**: template_id, overall_score, overall_band, primary_constraint, pillar_scores, answers (optional), report_url/token, source/UTM.
3) Webhook responds 200; UI continues to report.

## Example payload (public-safe)

```json
{
  "source": "scorekit",
  "template_id": "ai-readiness",
  "email": "jane@company.com",
  "name": "Jane Smith",
  "company": "Acme Inc",
  "role": "COO",
  "website": "https://acme.com",
  "overall_score": 74,
  "overall_band": "progressing",
  "primary_constraint": "process",
  "pillar_scores": {"leadership": 68, "data": 72, "people": 70, "process": 60, "culture": 80},
  "report_url": "https://example.com/report/{token}",
  "token": "{token}",
  "utm": {"source": "ads", "campaign": "scorecard"}
}
```

## Webhook handling (n8n or similar)

- Upsert **Prospects** by email; store normalised website (prefix https:// if missing).
- Create **Quiz Submission** linked to Prospect (template_id + token as identifiers).
- Log errors; do not block response.
- Optional: POST to CRM webhook with minimal fields (email/name/company/role + band tags).

## Data store options

- **Airtable**: One table for Prospects, one for Quiz Submissions (linked). Use formula fields for quick links (e.g., `report_url`).
- **Supabase**: Same schema pattern; use RLS as needed.

## CRM (optional)

- Post a pared-down payload to your CRM (e.g., GoHighLevel) with tags for template_id, band, primary_constraint.
- Trigger nurture workflows there; keep Airtable/Supabase as source of truth.

## Private/consulting-specific PRD

For consulting-specific wiring (custom Airtable base, GHL fields, and n8n workflows), keep the detailed PRD in your private repo: `/Users/andyc/CascadeProjects/ai-consulting-toolkit/docs/PRDs`.
