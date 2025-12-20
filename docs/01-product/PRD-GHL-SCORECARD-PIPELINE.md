Here’s a PRD you can drop into `docs/` (e.g. `docs/05-gohl/PRD-GHL-SCORECARD-PIPELINE.md`).

---

# PRD: Canonical GoHighLevel Setup for Scorecard Funnels

## 1. Purpose & Scope

Design a **reusable GoHighLevel (GHL) configuration** for quiz/scorecard funnels that:

- Powers **ScoreKit** and your own products.
- Can be **cloned and lightly customised** for client projects.
- Minimises re‑inventing pipelines, tags, and automations per implementation.

This PRD covers:

- Contact model & custom fields.
- Pipelines & stages.
- Tagging strategy.
- Core automations & workflows.
- Email/SMS assets.
- Reuse & templating patterns.

## 2. High-Level Objectives

- **Single canonical pattern** for all scorecard funnels (yours + client work).
- **Fast spin-up**: new instance should take < 30 minutes from blank sub‑account.
- **Non-fragile**: clear naming conventions; minimal hidden logic.
- **Composable**: able to plug in different frontend scorecards (ScoreKit, niche variants) without touching the GHL core much.

## 3. Contact Model

### 3.1 Core fields

Use standard GHL contact fields where possible:

- `First Name`
- `Last Name` (optional)
- `Email`
- `Phone` (optional, used only when SMS needed)
- `Company Name`
- `Website` (optional)
- `Job Title` / `Role`

### 3.2 Custom fields (Scorecard-specific)

Use **one “scorecard namespace” per template** to avoid collisions if a contact takes multiple assessments.

For AI Readiness, prefix with `AIR_`:

- **Inputs / context**
  - `AIR_Assessment_Token` (text) – token from ScoreKit report.
  - `AIR_Completed_At` (datetime).
  - `AIR_Latest_Assessment_URL` (text) – direct link to web report.
- **Scores**
  - `AIR_Overall_Score_Percent` (number).
  - `AIR_Overall_Band` (text).
  - `AIR_Pillar_Leadership` (number).
  - `AIR_Pillar_Data` (number).
  - `AIR_Pillar_People` (number).
  - `AIR_Pillar_Process` (number).
  - `AIR_Pillar_Culture` (number).
- **Value / intent (future)**
  - `AIR_Estimated_Annual_Cost` (currency/number).
  - `AIR_Estimated_Potential_Value` (currency/number).
  - `AIR_Primary_Intent` (text) – e.g. “explore consulting”, “DIY improvement”.

Pattern for future templates:

- Prefix per template, e.g. `REC_` for recruitment scorecard, `COO_` for operations.

## 4. Pipelines & Stages

Single **“Scorecard Funnel”** pipeline per sub‑account.

### 4.1 Pipeline stages

- **Stage 1 – Visitor**
  - Landed on quiz but has not completed email gate.
  - Mostly tracked via page events; may not exist as contact yet.
- **Stage 2 – Lead: Assessment Started**
  - Contact created.
  - Email captured (or at least name + email).
  - Tag: `scorecard_started`.
- **Stage 3 – Lead: Assessment Completed**
  - Scorecard completed; report generated.
  - Tag: `scorecard_completed`.
  - All score fields populated.
- **Stage 4 – MQL: High Potential**
  - Completed + meets certain thresholds (e.g. team size, score profile, or high cost-of-inaction).
  - Tag: `scorecard_mql`.
- **Stage 5 – SQL / Discovery Call Booked**
  - Booked a strategy session.
  - Tagged via calendar integration / specific booking form: `strategy_session_booked`.
- **Stage 6 – Client / Active Engagement**
  - Signed up for consulting / product engagement.
  - Tag: `client_active`.

This pipeline structure should be **constant across implementations**; differences are in scoring thresholds and messaging.

## 5. Tagging Strategy

Tags should be:

- **Machine-parseable** (snake case / kebab case).
- **Template-aware**.

### 5.1 Core behavioural tags

- `scorekit::assessment_started`
- `scorekit::assessment_completed`
- `scorekit::assessment_mql`
- `scorekit::strategy_session_booked`
- `scorekit::client`

### 5.2 Template tags

- `template::ai_readiness`
- Future: `template::recruitment`, `template::coo`, etc.

### 5.3 Campaign tags

For experiments/campaigns:

- `campaign::source::<utm_source>`
- `campaign::medium::<utm_medium>`
- `campaign::offer::<offer_name>`

These should be added at entry points (forms/pages) rather than inside downstream automations.

## 6. Automations & Workflows

### 6.1 Entry workflow: scorecard completion

**Trigger**: “Contact tag added” → `scorekit::assessment_completed`  
(or webhook from ScoreKit with event type).

**Actions:**

1. **Set / update custom fields** from payload:
   - `AIR_Overall_Score_Percent`, bands, pillar fields, etc.
   - `AIR_Latest_Assessment_URL` (link to web report).
2. **Move pipeline stage**:
   - To `Lead: Assessment Completed`.
3. **Conditional MQL tagging**:
   - If `team_size >= X` OR `estimated_cost >= Y` OR other criteria:
     - Add tag `scorekit::assessment_mql`.
     - Move stage to `MQL: High Potential`.
4. **Send immediate “Your report is ready” email**:
   - From branded domain.
   - Link to the **web report URL**.
   - Make PDF download optional for now (web already offers Download PDF).

*(Email delivery of PDF as attachment/URL is a separate slice; this workflow is ready to extend with that step.)*

### 6.2 Nurture workflow: assessment completed (generic)

**Trigger**: `scorekit::assessment_completed`.

**Logic:**

- **Branch by band**:
  - `Overall_Band` in `Starting/Emerging`:
    - Sequence focused on **high upside / foundational improvements**.
  - `Progressing/Leader`:
    - Sequence focused on **advanced optimisation / strategic partnership**.

**Sequence outline (per branch):**

- **Day 0** – “Here’s your report + immediate next step”
  - Re-send report link + CTA for strategy session.
- **Day 2** – “One key insight from your results”
  - Pull in 1–2 pillar scores into email.
- **Day 5** – “Case study aligned to your profile”
- **Day 8** – “Offer: strategy session / mini-review”
- **Day 14** – “Last chance” / reactivation.

Each step references **ScoreKit data fields** where possible (e.g. lowest pillar name).

### 6.3 Strategy session workflow

**Trigger**: Form or calendar booking tagged `scorekit::strategy_session_booked`.

- Move contact to **Stage 5 – SQL / Discovery Call Booked**.
- Add tag `scorekit::strategy_session_booked`.
- Send:
  - Confirmation email.
  - Optional SMS reminder (if phone present).
- Internal notification:
  - Slack/email to you or future operator.

## 7. Assets

### 7.1 Email templates

- **`email::assessment_report_link`**
  - Subject: “Your AI Readiness Report”
  - Body:
    - Link to web report (`AIR_Latest_Assessment_URL`).
    - Short explanation of band + what to do next.
- **`email::nurture_low_band_*`**, `email::nurture_high_band_*`  
  Series driven by the nurture workflow.

### 7.2 Forms / Pages

- **Assessment opt-in form**:
  - Fields: name, email, company, role.
  - Tags: `scorekit::assessment_started`, `template::ai_readiness`.
- **Strategy session form**:
  - Key qualifying questions if needed.
  - Tag: `scorekit::strategy_session_booked`.

## 8. Reuse & Templating Pattern

For **new products/clients**:

1. **Clone GHL sub-account** (or create new with same base pipeline and workflows).
2. **Keep pipeline, tags, and workflows identical**, only:
   - Change email copy.
   - Adjust MQL logic/thresholds.
   - Map to different set of custom fields with a new prefix (e.g. `REC_`).
3. **Integrate ScoreKit (or other frontend)**:
   - Map their result payload to the agreed GHL fields & tags via webhook.

This gives you:

- A **canonical GHL “scorecard engine”**.
- Minimal friction to stand up ScoreKit for:
  - Your own future scorecards.
  - Client implementations.

---

## 9. Integration Contract: ScoreKit → GoHighLevel Webhook

### 9.1 Trigger

- **Event source**: ScoreKit (backend or edge function)
- **When**: Assessment completed and report generated
- **Destination**: GHL inbound webhook (per sub-account)

### 9.2 HTTP request

- **Method**: `POST`
- **URL**: GHL webhook URL configured per account
- **Headers**:
  - `Content-Type: application/json`
  - Optional: `X-Scorekit-Signature` (HMAC for verification, future enhancement)

### 9.3 Payload shape (AI Readiness example)

```jsonc
{
  "event": "scorecard.completed",
  "templateId": "ai-readiness",
  "token": "<report-token>",

  "lead": {
    "firstName": "Ada",
    "lastName": "Lovelace",
    "email": "ada@example.com",
    "phone": "+44...",            // optional
    "company": "Analytical Engines Ltd",
    "role": "Founder/CEO",
    "website": "https://..."      // optional
  },

  "report": {
    "completedAt": "2025-12-20T09:15:00.000Z",
    "webReportUrl": "https://scorekit.app/report/<token>",

    "overall": {
      "scorePercent": 63,
      "band": "Emerging"
    },

    "pillars": {
      "leadership": 3.2,
      "data": 2.8,
      "people": 3.6,
      "process": 3.0,
      "culture": 4.1
    }
    // future: value calculation, intent, etc.
  },

  "meta": {
    "source": "scorekit",
    "campaign": {
      "source": "linkedin",
      "medium": "post",
      "offer": "ai-readiness-scorecard"
    }
  }
}
```

### 9.4 Mapping to GoHighLevel

**Contact core fields**

- `lead.firstName` → `First Name`
- `lead.lastName` → `Last Name`
- `lead.email` → `Email`
- `lead.phone` → `Phone`
- `lead.company` → `Company Name`
- `lead.website` → `Website`
- `lead.role` → `Job Title`

**Custom fields (AI Readiness)**

- `token` → `AIR_Assessment_Token`
- `report.completedAt` → `AIR_Completed_At`
- `report.webReportUrl` → `AIR_Latest_Assessment_URL`
- `report.overall.scorePercent` → `AIR_Overall_Score_Percent`
- `report.overall.band` → `AIR_Overall_Band`
- `report.pillars.leadership` → `AIR_Pillar_Leadership`
- `report.pillars.data` → `AIR_Pillar_Data`
- `report.pillars.people` → `AIR_Pillar_People`
- `report.pillars.process` → `AIR_Pillar_Process`
- `report.pillars.culture` → `AIR_Pillar_Culture`

**Tags**

- Always add:
  - `scorekit::assessment_completed`
  - `template::ai_readiness`
- If `meta.campaign.*` present, add:
  - `campaign::source::<meta.campaign.source>`
  - `campaign::medium::<meta.campaign.medium>`
  - `campaign::offer::<meta.campaign.offer>`

### 9.5 Error handling & idempotency

- ScoreKit should treat non-2xx responses from GHL as **retryable** (with backoff) up to a small max (e.g. 3 attempts).
- GHL workflows should be written assuming **duplicate webhooks are possible** (e.g. use tags/stages in idempotent ways, avoid double-sending the same email if tag already present).
