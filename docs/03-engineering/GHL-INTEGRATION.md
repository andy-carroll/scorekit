# GoHighLevel Integration

## Purpose

Upsert contacts, apply tags/fields based on score outputs, and trigger GHL workflows.

## Inputs

- email (required)
- name (optional)
- template_id, template_version
- overall_band
- primary_constraint

## Actions

- Create/update contact
- Apply tags
- Optionally create opportunity
- Trigger workflow/automation

## Failure handling

- If GHL call fails, report still renders.
- Log failure and retry asynchronously.
