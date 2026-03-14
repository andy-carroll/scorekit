# Environment Variables

All variables are set per Vercel project (one project per client deployment).
Copy `apps/web/.env.example` to `apps/web/.env.local` for local development.

---

## Core

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Yes | Full public URL of this deployment, **including any subpath**. e.g. `https://accelerator-x.ai/quiz/aireadiness` (subpath) or `https://quiz.yourdomain.com` (subdomain). Used to build report links in emails and PDFs. |
| `NEXT_PUBLIC_BASE_PATH` | No | URL prefix for subpath deployments. Must start with `/`, e.g. `/quiz/aireadiness`. Must match the subpath in `NEXT_PUBLIC_APP_URL`. Leave unset for standalone subdomain deployments. |
| `SCOREKIT_TEMPLATE_ID` | No | Template to activate. Default: `ai-readiness`. Add new templates to `lib/active-template.ts`. |

---

## Webhook (lead/CRM integration)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_WEBHOOK_URL` | No | Webhook URL that receives the full quiz payload (answers, scores, lead) on submission. Fire-and-forget — quiz still completes if missing or if the request fails. Point this at n8n, Zapier, Make.com, or any endpoint that accepts a POST with JSON. |

---

## Report Storage (Upstash / Vercel KV)

| Variable | Required | Description |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Recommended | REST URL from Upstash or Vercel KV. Without this, reports fall back to localStorage (dev-only — no cross-device sharing). |
| `UPSTASH_REDIS_REST_TOKEN` | Recommended | API token for above. |

**Create Upstash KV:**
- Vercel Dashboard → Storage → KV → Create Database → copy env vars, or
- [console.upstash.com](https://console.upstash.com) → Create Database → REST API → copy URL + token.

Reports are stored with a 1-year TTL.

---

## Email Delivery (Brevo)

| Variable | Required | Description |
|---|---|---|
| `EMAIL_PROVIDER` | No | Email provider to use. Default + only supported value: `brevo`. |
| `BREVO_API_KEY` | Yes (for email) | Brevo SMTP API key (`xkeysib-...`). Found at app.brevo.com → SMTP & API → API Keys. |
| `EMAIL_FROM` | Yes (for email) | Sender email address. Must be a verified sender in your email provider. e.g. `reports@yourdomain.com` |
| `EMAIL_FROM_NAME` | No | Sender display name. e.g. `Your Brand Name` |

---

## Notes

- No secrets are committed to git. All values live in Vercel project settings or `.env.local`.
- `NEXT_PUBLIC_*` variables are embedded in the client bundle — never put secrets in them.
- The GHL integration (`lib/ghl.ts`) is deprecated and will be removed in Sprint 3.
