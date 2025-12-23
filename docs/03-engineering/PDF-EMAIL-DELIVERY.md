# PDF + Email Delivery

## V1 goal

- User can download a PDF immediately
- User receives the PDF by email

## Current status

- PDF download is implemented via `/api/report/pdf`.
- Email delivery is not implemented yet.

## Delivery options

- Option A: Generate PDF in app and hand off to GHL workflow to send
- Option B: Generate and send directly from the app (e.g., Resend)

## V1 default

TBD (choose based on reliability and speed to ship).

## Reliability requirements

- PDF layout matches on-page report
- Email deliverability is acceptable
- Retries for transient failures
