# Deployment Guide

Deploy ScoreKit to Vercel in ~15 minutes.

---

## Prerequisites

- Vercel account
- Upstash account (via Vercel Marketplace — see Step 3)
- Brevo account (free tier supports up to 300 emails/day)
- n8n instance with the ScoreKit webhook workflow (see `docs/03-engineering/N8N-SETUP.md`)

---

## Step 1: Create Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Set **Root Directory** to `apps/web`
4. Framework preset: **Next.js** (auto-detected)
5. Click **Deploy** — it will fail (no env vars yet). That's expected.

---

## Step 2: Set Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables, add:

```
# Subpath deployment (e.g. accelerator-x.ai/quiz/aireadiness):
NEXT_PUBLIC_APP_URL          https://accelerator-x.ai/quiz/aireadiness
NEXT_PUBLIC_BASE_PATH        /quiz/aireadiness

# Subdomain deployment (e.g. quiz.yourdomain.com) — omit NEXT_PUBLIC_BASE_PATH:
# NEXT_PUBLIC_APP_URL        https://quiz.yourdomain.com

SCOREKIT_TEMPLATE_ID         ai-readiness
NEXT_PUBLIC_WEBHOOK_URL  https://your-n8n.example.com/webhook/scorekit/quiz-submit
UPSTASH_REDIS_REST_URL       https://your-db-id.upstash.io
UPSTASH_REDIS_REST_TOKEN     your-upstash-token
EMAIL_PROVIDER               brevo
BREVO_API_KEY                xkeysib-...
EMAIL_FROM                   reports@yourdomain.com
EMAIL_FROM_NAME              Your Brand Name
```

See `docs/04-ops/ENV-VARS.md` for full descriptions.

---

## Step 3: Create Upstash Redis Database

> **Note:** Vercel KV is sunset. Do not use Storage → KV. Use the Marketplace route below.

**Via Vercel Marketplace (recommended):**
1. Vercel Dashboard → your project → **Integrations** → **Marketplace**
2. Search **Upstash** → **Add Integration**
3. Create a new Redis database, connect it to your project
4. Leave the **Custom Prefix** field as default — Vercel injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically
5. Redeploy after connecting

**Via Upstash console (manual):**
1. [console.upstash.com](https://console.upstash.com) → Create Database → choose closest region
2. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the REST API tab
3. Add manually in Vercel → Settings → Environment Variables

---

## Step 4: Set Up Brevo

1. Sign up at [app.brevo.com](https://app.brevo.com)
2. Go to **SMTP & API** → **API Keys** → **Create a new API key**
3. Copy the key (`xkeysib-...`) → paste as `BREVO_API_KEY` in Vercel
4. Go to **Senders & IPs** → **Senders** → **Add a new sender**
5. Add and verify your sending email address (matches `EMAIL_FROM`)

---

## Step 5: Configure Domain Access

ScoreKit supports two hosting patterns. Choose the one that fits your setup.

---

### Option A — Subpath on an existing domain (recommended for multi-quiz setups)

Serve the quiz at `yourdomain.com/quiz/<slug>` by proxying through your main site host.

**When to use:** Your main site is already on a CDN/host (Netlify, Cloudflare Pages, etc.) and you want multiple quizzes at clean subpaths over time.

**How it works:** Your main site host rewrites `/quiz/<slug>/*` requests to the Vercel deployment. The browser URL never changes — it stays at `yourdomain.com/quiz/<slug>`.

**For Netlify** — add to your main site's `netlify.toml`:

```toml
[[redirects]]
  from = "/quiz/aireadiness"
  to = "https://your-vercel-deployment.vercel.app/quiz/aireadiness"
  status = 200
  force = true

[[redirects]]
  from = "/quiz/aireadiness/*"
  to = "https://your-vercel-deployment.vercel.app/quiz/aireadiness/:splat"
  status = 200
  force = true
```

Replace `your-vercel-deployment.vercel.app` with your actual Vercel project URL (found in Vercel Dashboard → Project → Domains).

**For Cloudflare Pages** — add a `_redirects` file with:
```
/quiz/aireadiness https://your-vercel-deployment.vercel.app/quiz/aireadiness 200
/quiz/aireadiness/* https://your-vercel-deployment.vercel.app/quiz/aireadiness/:splat 200
```

**No Vercel custom domain needed** — Vercel serves from its `.vercel.app` URL; your main host proxies to it.

---

### Option B — Dedicated subdomain

Serve the quiz at `quiz.yourdomain.com` directly from Vercel.

1. Vercel Dashboard → Project → Settings → Domains → Add `quiz.yourdomain.com`
2. In your DNS provider, add a CNAME record:
   - Name: `quiz`
   - Value: `cname.vercel-dns.com`
3. Wait for DNS propagation (1–5 minutes with Netlify DNS)
4. Vercel will auto-provision an SSL certificate
5. Set `NEXT_PUBLIC_APP_URL=https://quiz.yourdomain.com` — leave `NEXT_PUBLIC_BASE_PATH` unset

---

## Step 6: Redeploy

Trigger a new deployment after setting env vars:
- Vercel Dashboard → Deployments → **Redeploy** latest, or
- Push a commit to `main`

---

## Step 7: Smoke Test

Run through the full user journey in production:

1. Visit `https://accelerator-x.ai/quiz/aireadiness` → branded landing page loads ✓
2. Click **Take the Assessment** → quiz loads ✓
3. Complete all questions → submit → email gate appears ✓
4. Enter details → **Get My Free Report** → redirected to `/report/[token]` ✓
5. Check inbox → PDF email received ✓
6. Open report link in a different browser / incognito → loads from Upstash ✓ (proves cross-device)
7. Check Airtable → new row created with scores ✓

---

## Multi-Tenant Deployments (additional clients)

Each client = one Vercel project:

1. Create a new Vercel project pointing to the same repo, root dir `apps/web`
2. Set `SCOREKIT_TEMPLATE_ID` to the client's template ID (e.g. `fitmum`)
3. Set client-specific `NEXT_PUBLIC_APP_URL`, `EMAIL_FROM`, `EMAIL_FROM_NAME`
4. Set up separate Upstash KV and Brevo sender for isolation
5. Configure client's custom domain

The template content (copy, brand colors, questions) lives in `packages/core/src/templates/[id]/`.
No code changes required — just env vars and a template file.

---

## Local Development

```bash
# Clone + install
git clone https://github.com/your-org/scorekit.git
cd scorekit
pnpm install

# Optional: add Upstash creds for server-side report storage
# Without these, localStorage fallback is used (dev only)
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your values

# Start dev server
pnpm dev
# → http://localhost:3000
```

No Upstash or Brevo required for local dev — reports persist in browser localStorage and email sending is skipped gracefully.
