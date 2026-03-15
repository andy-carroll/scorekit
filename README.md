# ScoreKit

**Multi-tenant quiz and assessment platform.** Build ScoreApp-style assessments with email capture, instant on-page reports, PDF delivery, and CRM integration — then deploy a separate branded instance for each client in ~15 minutes.

**Live demo:** [accelerator-x.ai/quiz/aireadiness](https://accelerator-x.ai/quiz/aireadiness) — Accelerator-X AI Readiness Assessment

---

## What it does

A user completes a multi-step quiz → hits an email gate → gets an instant personalised report (on-page + PDF) → you get their lead in your CRM.

```
Landing → /quiz → /email gate → /report/[token]
                      │
                      ├─→ Upstash KV (report stored, shareable link, 1yr TTL)
                      ├─→ Webhook → any automation tool → your CRM  [optional]
                      └─→ Email provider (PDF report emailed to user)  [optional]
```

---

## Key features

- **Template-driven** — all copy, brand, questions, and scoring live in one `content.ts` file per template. No code changes to launch a new brand.
- **Multi-tenant** — one codebase, one Vercel project per client. `SCOREKIT_TEMPLATE_ID` env var selects the active template.
- **Shareable reports** — stored server-side in Upstash KV. Links work across devices and browsers.
- **PDF delivery** — server-side PDF generation via `pdfkit`, emailed as an attachment via your email provider of choice (Brevo, Resend, or any SMTP).
- **CRM integration** — fire-and-forget webhook delivers the full quiz payload (lead + answers + scores) to any automation tool (n8n, Zapier, Make) or custom endpoint.
- **Privacy & consent built in** — a required consent checkbox with a link to your privacy policy is built into the email gate and cannot be accidentally removed. Consent timestamp and policy URL are recorded in every webhook payload. Your privacy policy URL is configured per template in `content.ts` — each deployer supplies their own.
- **Self-hostable** — Apache 2.0. All integrations are pluggable. localStorage fallback for local dev (no cloud accounts needed to run).

---

## Quick start

```bash
git clone https://github.com/your-org/scorekit.git
cd scorekit
pnpm install
pnpm dev --filter=web
# → http://localhost:3000
```

No cloud accounts needed. Reports fall back to browser localStorage in local dev; email delivery is silently skipped if `BREVO_API_KEY` is not set.

---

## Deploy your own instance (~15 minutes)

Full step-by-step: **[docs/04-ops/DEPLOYMENT.md](docs/04-ops/DEPLOYMENT.md)**

Accounts you'll need:

| Service | What for | Cost |
|---|---|---|
| [Vercel](https://vercel.com) | Hosting | Free |
| [Upstash](https://upstash.com) | Serverless Redis (report storage) | Free tier |
| Email provider | PDF report emailed to respondent | Brevo / Resend (both free tier) |
| Webhook consumer | Lead + scores → your CRM | Optional (n8n, Zapier, Make, custom) |

All env vars documented in [docs/04-ops/ENV-VARS.md](docs/04-ops/ENV-VARS.md).

---

## Add a new template (new client or brand)

**The full guide is in [`docs/06-template-authoring/`](docs/06-template-authoring/README.md).** It's a five-step process designed to be completed with AI assistance in under an hour, even if you don't know what questions to ask:

```
1. DESIGN    → Fill in 5 lines of context, paste into Claude → get pillars + questions proposed
2. REVIEW    → Refine until it's right
3. GENERATE  → Paste your worksheet into Claude → get a ready-to-use content.ts
4. INSTALL   → Drop the file in, register it, set your env var
5. DEPLOY    → Push to Vercel — your quiz is live
```

No CSS changes required. Brand colors are injected at runtime as CSS custom properties.

---

## Theming architecture

ScoreKit uses a two-tier system:

1. **Static base** — `apps/web/src/styles/themes/accelerator.css` defines component structure (buttons, cards, quiz flow) using CSS custom properties.
2. **Runtime overrides** — `layout.tsx` (server component) reads `brand.colors` from `content.ts` and injects a `<style>` tag that overrides color and font vars per-brand.

Changing brand colors requires **zero CSS edits** — only `content.ts`. The full architecture is documented in the comment block at the top of `accelerator.css`.

Font: **Aptos** (Microsoft Office 365 font, self-hosted from `public/fonts/` via `next/font/local`). To use a different font, add `.woff2` files to `public/fonts/`, register in `layout.tsx`, and reference the CSS variable.

---

## Repo structure

```
apps/
  web/                          # Next.js 16 App Router
    src/
      app/                      # Pages: /, /quiz, /email, /report/[id]
      app/api/                  # API routes: /report/pdf, /report/email
      lib/
        active-template.ts      # Template registry (env var → content)
        report-store/           # Upstash KV adapter + localStorage fallback
        email-provider/         # Brevo adapter (pluggable interface)
      styles/themes/            # CSS theme base files
    public/fonts/               # Self-hosted Aptos .woff2 files

packages/
  core/                         # Shared types + template content
    src/
      templates/
        ai-readiness/           # AI Readiness Assessment (Accelerator-X)
          content.ts            # All copy, brand config, questions, scoring

docs/
  06-template-authoring/        # ← Start here to build a new quiz
    README.md                   # 5-step guide
    01-quiz-design-prompt.md    # AI prompt: design your quiz from scratch
    02-worksheet.md             # Structured fill-in for all content
    03-template-generation-prompt.md  # AI prompt: generate content.ts
  04-ops/DEPLOYMENT.md          # Vercel + DNS setup guide
  04-ops/ENV-VARS.md            # All environment variables
  03-engineering/ARCHITECTURE.md
  03-engineering/INTEGRATION-GUIDE.md
```

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styles | Tailwind CSS + CSS custom properties |
| Font | Aptos (self-hosted, `next/font/local`) |
| Report storage | Upstash Redis (serverless KV) |
| Email | Brevo or Resend (pluggable adapter) |
| PDF generation | pdfkit (server-side Node.js) |
| CRM bridge | Webhook (fire-and-forget, any consumer) |
| Package manager | pnpm (monorepo) |
| Deployment | Vercel |
| Licence | Apache 2.0 |

---

## PDF logo pipeline

`pdfkit` doesn't render SVGs, so PDF logos must be raster (PNG).

- Web logo: `apps/web/public/logos/<brand>.svg`
- PDF logo: `apps/web/public/logos/<brand>.png` (generated)

```bash
pnpm convert-logos
```

`apps/web/src/app/api/report/pdf/theme.ts` prefers `.png` automatically when an `.svg` is configured.

---

## Contributing

See [docs/05-open-source/CONTRIBUTING.md](docs/05-open-source/CONTRIBUTING.md).

The fastest way to contribute is to **add a template** — follow the guide in `docs/06-template-authoring/`, then open a PR. Templates are self-contained.

---

## Licence

[Apache 2.0](LICENSE)
