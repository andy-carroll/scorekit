# ScoreKit

**Multi-tenant quiz and assessment platform.** Build ScoreApp-style assessments with email capture, instant on-page reports, PDF delivery, and CRM integration — then deploy a separate branded instance for each client in ~15 minutes.

**Live demo:** [quiz.accelerator-x.ai](https://quiz.accelerator-x.ai) — Accelerator-X AI Readiness Assessment

---

## What it does

A user completes a multi-step quiz → hits an email gate → gets an instant personalised report (on-page + PDF) → you get their lead in your CRM.

```
Landing → /quiz → /email gate → /report/[token]
                      │
                      ├─→ Upstash KV (report stored, shareable link, 1yr TTL)
                      ├─→ n8n webhook → Airtable (lead + scores → CRM)
                      └─→ Brevo (PDF report emailed to user)
```

---

## Key features

- **Template-driven** — all copy, brand, questions, and scoring live in one `content.ts` file per template. No code changes to launch a new brand.
- **Multi-tenant** — one codebase, one Vercel project per client. `SCOREKIT_TEMPLATE_ID` env var selects the active template.
- **Shareable reports** — stored server-side in Upstash KV. Links work across devices and browsers.
- **PDF delivery** — server-side PDF generation via `pdfkit`, emailed as an attachment via Brevo.
- **CRM integration** — fire-and-forget n8n webhook delivers the full quiz payload (lead + answers + scores) to Airtable or any downstream system.
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
| [Brevo](https://brevo.com) | Transactional email + PDF attachment | Free tier (300/day) |
| [n8n](https://n8n.io) | Webhook → Airtable CRM bridge | Optional |

All env vars documented in [docs/04-ops/ENV-VARS.md](docs/04-ops/ENV-VARS.md).

---

## Add a new template (new client or brand)

1. Copy `packages/core/src/templates/ai-readiness/` → `your-template-id/`
2. Edit `content.ts` — update `brand.colors`, landing copy, questions, scoring bands, and recommendations
3. Export from `packages/core/src/index.ts`
4. Register in `apps/web/src/lib/active-template.ts`
5. Deploy a new Vercel project with `SCOREKIT_TEMPLATE_ID=your-template-id`

No CSS changes required. Brand colors are injected at runtime as CSS custom properties from `content.ts`. Every comment you need is inline in those two files.

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
| Email | Brevo (transactional, PDF attachment) |
| PDF generation | pdfkit (server-side Node.js) |
| CRM bridge | n8n webhook (fire-and-forget) |
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

The fastest way to contribute is to **add a template** — copy `ai-readiness/`, update `content.ts`, and open a PR. Templates are self-contained.

---

## Licence

[Apache 2.0](LICENSE)
