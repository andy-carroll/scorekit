# PDF + Email Delivery

## V1 goal

- User can download a PDF immediately
- User receives the PDF by email

## Current status

- PDF download is implemented via `/api/report/pdf`.
- Email delivery is implemented via GHL integration (Phase 1 complete).

## Delivery options

- Option A: Generate PDF in app and hand off to GHL workflow to send
  - Pros: Leverages existing GHL infrastructure, unified email templates, tracking in GHL
  - Cons: Requires GHL integration to be built first, adds dependency on GHL reliability
  - Complexity: Medium (need GHL webhook/API integration)

- Option B: Generate and send directly from the app (e.g., Resend)
  - Pros: Faster to ship, direct control, no GHL dependency for email delivery
  - Cons: Separate email infrastructure, duplicate tracking if GHL also used
  - Complexity: Low (single API integration)

## Recommendation: Option A (GHL)

**Reasoning:**

1. **Strategic Alignment**: GHL is intended as the primary CRM/automation platform
2. **Avoid Technical Debt**: No need to migrate from direct email later
3. **Unified Customer Experience**: All touchpoints in one system
4. **GHL Integration Already Planned**: Tickets scorekit-skz and scorekit-pu4 exist

**Implementation approach (incremental):**

- **Phase 1**: Basic GHL contact upsert with PDF attachment
- **Phase 2**: Add tags and workflow triggers based on scores
- **Phase 3**: Enhanced tracking and error handling

**Dependencies:**

- GHL API credentials (GHL_BASE_URL, GHL_API_KEY)
- GHL workflow configured to send PDF email
- Contact/object mapping defined

## Reliability requirements

- PDF layout matches on-page report
- Email deliverability is acceptable
- Retries for transient failures
