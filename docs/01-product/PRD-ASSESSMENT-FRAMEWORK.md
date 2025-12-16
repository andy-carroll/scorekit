# PRD: Assessment Framework

> **Status**: Draft  
> **Author**: Andy Carroll  
> **Created**: Dec 2025  
> **Related tickets**: scorekit-6r3, scorekit-nqr, scorekit-hr0

---

## 1. Problem Statement

### The opportunity

Business leaders are drowning in generic "how mature is your X" quizzes that produce meaningless scores and forgettable PDFs. Meanwhile, premium consultancy audits (£2k–£10k) deliver genuine insight but are inaccessible to most.

### What we're building

A **template-driven assessment engine** that helps respondents:

1. **Articulate their pain** in their own words
2. **Quantify the business cost** of their current constraints
3. **See the value** of removing those constraints
4. **Build their own business case** for transformation

The output is not a scorecard—it's a **business case document** that justifies investment in change.

### The commercial logic

If the assessment helps someone see they're losing £300k–£500k annually to inefficiency, friction, or missed opportunity, then a £30k–£50k transformation programme is an obvious investment. The assessment's job is to help them see and articulate that value.

### Why it matters

1. **For the respondent**: Clarity on what's costing them, in terms they can take to their board
2. **For us**: Rich qualification data + a pre-built business case before the first call
3. **For the platform**: Reusable engine across multiple verticals without code changes

---

## 2. Target Use Cases (Templates)

The assessment engine must support multiple templates with different:

- Questions and answer options
- Pillars and sub-dimensions
- Scoring weights and band thresholds
- Report copy and recommendations
- Landing page positioning

### Initial templates

| Template | ICP | Core question | Time |
|----------|-----|---------------|------|
| **AI Readiness** | Founder/MD at scaling company | "How ready is your business to adopt AI?" | 15–20 min |
| **Project & Admin Chaos** | COO/Ops lead at SMB | "Where is operational friction costing you?" | 12–15 min |
| **Talent Acquisition** | TA lead or recruitment agency owner | "What's holding back your hiring function?" | 12–15 min |

Each template produces a report that:

- **Reflects their words back**: Uses their own language about pain and goals
- **Quantifies the cost**: Shows what current constraints are costing them
- **Projects the value**: Shows what transformation could deliver
- **Builds the business case**: Makes investment decisions obvious
- **Sparks internal discussion**: Worth sharing with colleagues and leadership
- **Equips our sales conversation**: We arrive knowing their pain, history, and goals

---

## 3. Assessment Structure

### 3.1 Pillars

Each template defines **3–6 pillars** that represent distinct diagnostic dimensions.

**Example: AI Readiness Template**

| Pillar | What it measures |
|--------|------------------|
| Leadership & Vision | Executive commitment, strategy clarity, investment appetite |
| Data & Infrastructure | Data quality, accessibility, technical readiness |
| People & Skills | In-house expertise, training, access to talent |
| Process & Operations | Automation readiness, use case identification, change capability |
| Culture & Experimentation | Risk tolerance, learning culture, speed of adoption |

**Example: Project & Admin Chaos Template**

| Pillar | What it measures |
|--------|------------------|
| Visibility & Tracking | Do you know what's happening across projects? |
| Process Standardisation | Are workflows documented and repeatable? |
| Resource Allocation | Are people working on the right things? |
| Communication & Handoffs | Where do things fall through cracks? |
| Tool & System Friction | Are tools helping or hindering? |

### 3.2 Sub-dimensions (optional)

Pillars may contain **2–3 sub-dimensions** for granular insight:

```
Data & Infrastructure (pillar)
├── Data Quality (sub-dimension)
├── Data Accessibility (sub-dimension)
└── Technical Readiness (sub-dimension)
```

Sub-dimensions enable report statements like:
> "Your Data & Infrastructure pillar scored 45%. While Data Quality is relatively strong (62%), Data Accessibility is a significant blocker (28%)."

### 3.3 Question count

| Template type | Questions | Estimated time |
|---------------|-----------|----------------|
| Light (validation/MVP) | 15–20 | 8–12 min |
| Standard | 25–30 | 15–20 min |
| Comprehensive | 35–40 | 20–25 min |

For V1, target **25–30 questions** (5–6 per pillar).

---

## 4. Question Types

Questions fall into two categories:

- **Diagnostic questions** (scored) — assess current state
- **Context questions** (not scored) — capture pain, history, goals, and value

Both types can render as radio buttons, dropdowns, or (for some context questions) short text input.

### 4.1 Diagnostic question types (scored)

| Type | Purpose | Answer pattern | Example |
|------|---------|----------------|--------|
| **Maturity** | Assess current state | 5 scenarios from lowest to highest maturity | "Which best describes your AI strategy?" |
| **Frequency** | Reveal actual behaviour | Never → Rarely → Sometimes → Often → Always | "How often does leadership discuss AI in strategy meetings?" |
| **Capability** | Gauge confidence | Not at all → Slightly → Somewhat → Fairly → Very | "How confident are you that your team could run an AI pilot?" |
| **Specificity** | Check concrete facts | Yes / No / Partial / Planned / Don't know | "Do you have documented AI use cases?" |
| **History** | What's been tried | No / Yes, unsuccessfully / Yes, partially / Yes, working | "Have you invested in AI training before?" |
| **Priority** | Force trade-offs | Choose A or B (both are valid blockers) | "Which is the bigger obstacle: lack of budget or lack of skills?" |

### 4.2 Context question types (not scored, but critical for report)

| Type | Purpose | Answer pattern | Example |
|------|---------|----------------|--------|
| **Demographics** | Company profile | Select / number input | "How many employees?" "What's your industry?" |
| **Pain** | Current frustrations | Multi-select or text | "What's your biggest frustration with [X]?" |
| **Trigger** | Why now? | Select or text | "What prompted you to look at this area?" |
| **Cost** | Quantify the problem | Number or range | "Roughly how many hours/week does your team lose to [X]?" |
| **Aspiration** | Goals and outcomes | Select or text | "What would success look like in 12 months?" |
| **Value** | Quantify the opportunity | Number or range | "If you doubled your team's capacity, what would that be worth?" |

### 4.3 Why this mix matters

**Diagnostic questions** tell us where they are:
- **Maturity** → where they *think* they are
- **Frequency** → what they *actually do*
- **Capability** → confidence gaps
- **Specificity** → concrete facts vs. aspiration
- **History** → what's been tried (and whether it worked)
- **Priority** → what leadership perceives as the real blocker

**Context questions** tell us why it matters *to them*:
- **Pain** → what's frustrating them (in their words)
- **Trigger** → why they're looking at this now
- **Cost** → what the problem is costing them (quantified)
- **Aspiration** → what success looks like to them
- **Value** → what solving it would be worth (quantified)

The report weaves both together: "You scored X on [pillar], and you told us this is costing you [Y hours/week]. Based on your team size, that's approximately £[Z] annually."

### 4.4 Question mix per pillar (recommendation)

For a 6-question pillar:

- 2 × Maturity
- 2 × Frequency
- 1 × Capability or History
- 1 × Specificity

**Plus, per assessment (not per pillar):**

- 3–5 × Demographics (company context)
- 2–3 × Pain (in their words)
- 1–2 × Trigger (why now)
- 2–3 × Cost quantification
- 1–2 × Aspiration
- 1–2 × Value quantification

Total: ~30 diagnostic + ~12 context = ~42 questions, but context questions are faster.

---

## 5. Scoring Model

### 5.1 Per-question scoring

Each answer maps to a score:

| Answer position | Score |
|-----------------|-------|
| 1st (lowest) | 1 |
| 2nd | 2 |
| 3rd | 3 |
| 4th | 4 |
| 5th (highest) | 5 |

For 4-option questions (e.g., Yes/No/Partial/Planned), map to: 1, 2, 3, 4.

### 5.2 Pillar scoring

```
pillar_raw = sum of question scores in pillar
pillar_max = question_count × 5
pillar_score = (pillar_raw / pillar_max) × 100
```

### 5.3 Overall scoring

```
overall_score = average(all pillar scores)
```

Optionally, templates can define **pillar weights** (e.g., Leadership counts 1.5×).

### 5.4 Maturity bands

| Band | Score range | Meaning |
|------|-------------|---------|
| **Starting** | 0–39% | Significant gaps; foundational work needed |
| **Emerging** | 40–59% | Some progress; key blockers remain |
| **Progressing** | 60–79% | Solid foundation; optimisation opportunities |
| **Leading** | 80–100% | Strong across pillars; focus on acceleration |

Bands apply to overall score AND per-pillar scores.

### 5.5 Primary constraint

The **lowest-scoring pillar** is flagged as the primary constraint:

> "Your primary constraint is **Data & Infrastructure** (38%). Addressing this will unlock progress in other areas."

---

## 6. Report Output

The report is not a scorecard—it's a **business case document**.

### 6.1 Report principles

- **Their words, not ours**: Quote their pain and goals back to them
- **Quantified impact**: Show the cost of inaction in pounds/hours
- **Value projection**: Show what solving this could be worth
- **Narrative first, scores second**: Lead with insight, not methodology
- **One clear priority**: If you do nothing else, do this
- **Discussion-ready**: Structured for sharing with leadership

### 6.2 Report sections

| Section | Content |
|---------|--------|
| **Opening insight** | 1 paragraph: The single most important thing this assessment reveals |
| **Your context** | Company profile, what prompted this, your stated goals |
| **What you told us** | Their pain points and frustrations, quoted back |
| **The cost of the current state** | Quantified: "You estimated X hours/week lost. For a team of Y, that's £Z annually." |
| **The diagnosis** | Pillar breakdown with "so what" narrative for each |
| **Patterns we noticed** | Contradictions or notable combinations across answers |
| **What you've tried** | Acknowledge history, explain why this time could be different |
| **Your biggest constraint** | Deep-dive on the primary blocker |
| **What transformation could deliver** | Value projection based on their inputs |
| **Your single priority** | If you do one thing, do this |
| **30/60/90 roadmap** | Specific actions connected to *their* goals |
| **The business case** | Summary: Cost of inaction vs. value of transformation |
| **What happens next** | CTA: Book a call, share with team |

### 6.3 Recommendation mapping

Recommendations are **contextual**, drawing on both scores AND context answers:

```yaml
pillar: data_infrastructure
recommendations:
  - score_range: [0, 39]
    headline: "Data foundations are blocking your AI ambitions"
    body_template: |
      You scored {{score}}% on Data & Infrastructure, and you told us 
      {{pain_quote}}. For a company of {{company_size}} employees, 
      this typically costs {{estimated_cost}} annually in manual workarounds 
      and missed opportunities.
      
      Before pursuing AI initiatives, you need to address:
    actions:
      - "Audit current data sources and quality"
      - "Establish basic data governance policies"
    if_tried_before: |
      You mentioned you've attempted to address data issues before. 
      Common reasons previous efforts stall: ...
```

### 6.4 Value calculation logic

The report should calculate projected value based on their inputs:

```typescript
// Example: Time savings calculation
const hoursLostPerWeek = answers.hours_lost_weekly; // from Cost question
const teamSize = answers.team_size; // from Demographics
const avgHourlyCost = 50; // £50/hour loaded cost (or ask them)

const annualCost = hoursLostPerWeek * teamSize * 48 * avgHourlyCost;
// "You're losing approximately £X annually to this friction"

// Example: Capacity unlock calculation  
const capacityIncrease = answers.capacity_value; // from Value question
const revenuePerHead = answers.revenue_band / teamSize;
const potentialValue = capacityIncrease * revenuePerHead;
// "Unlocking this capacity could be worth £X annually"
```

### 6.5 The business case summary

The report should end with a clear business case:

> **The Cost of Inaction**  
> Based on your inputs, the current state is costing you approximately **£X annually** in lost productivity, missed opportunities, and operational friction.
>
> **The Value of Transformation**  
> You told us that [aspiration]. Achieving this could deliver **£Y annually** in [efficiency gains / revenue growth / capacity unlock].
>
> **The Investment Case**  
> A focused transformation programme typically requires an investment of £30k–£50k. Based on your numbers, that's a **[X]x return** in the first year alone.

This framing makes the follow-up conversation about ROI, not about whether they need help.

### 6.6 Share card

A visual summary card for social sharing:

- Overall score + band
- Key insight (1 sentence)
- Pillar radar or bar chart
- "Take the assessment" CTA

---

## 7. Data Model

### 7.1 Template schema

```typescript
interface Template {
  id: string;                    // "ai-readiness-v1"
  version: string;               // "1.0.0"
  name: string;                  // "AI Readiness Assessment"
  description: string;
  estimatedMinutes: number;
  
  pillars: Pillar[];
  questions: Question[];
  recommendations: Recommendation[];
  
  bands: BandDefinition[];       // Override default bands if needed
  pillarWeights?: Record<string, number>;  // Optional weighting
  
  copy: {
    landing: LandingCopy;
    report: ReportCopy;
  };
}

interface Pillar {
  id: string;                    // "leadership"
  name: string;                  // "Leadership & Vision"
  description: string;
  subDimensions?: SubDimension[];
}

interface SubDimension {
  id: string;                    // "executive_sponsorship"
  name: string;                  // "Executive Sponsorship"
  description?: string;
}

interface Question {
  id: string;                    // "q1"
  pillarId: string;              // "leadership"
  subDimensionId?: string;       // "executive_sponsorship"
  questionType: QuestionType;    // "maturity" | "frequency" | etc.
  text: string;                  // The question
  options: Option[];
  order: number;                 // Display order
}

interface Option {
  value: number;                 // 1–5
  label: string;                 // What user sees
  insight?: string;              // What this answer reveals (for report)
}

type QuestionType = 
  | "maturity" 
  | "frequency" 
  | "capability" 
  | "specificity" 
  | "priority";
```

### 7.2 Response schema

```typescript
interface AssessmentResponse {
  id: string;                    // "resp_abc123"
  templateId: string;
  templateVersion: string;
  
  respondent: {
    email: string;
    name?: string;
    company?: string;
    role?: string;
  };
  
  answers: Record<string, number>;  // questionId → selected value
  
  scores: {
    overall: number;
    overallBand: Band;
    pillars: Record<string, PillarScore>;
    primaryConstraint: string;   // pillarId
  };
  
  createdAt: string;
  completedAt: string;
}

interface PillarScore {
  score: number;
  band: Band;
  subDimensions?: Record<string, number>;
}

type Band = "starting" | "emerging" | "progressing" | "leading";
```

---

## 8. User Experience Flow

### 8.1 Assessment flow

```
1. Landing page (template-specific)
   - Value prop, time estimate, trust signals
   - "Start Assessment" CTA

2. Assessment (grouped by pillar)
   - Pillar intro: "Leadership & Vision" + 1-line description
   - Questions 1–6 for this pillar
   - Progress: "Pillar 1 of 5" + overall progress bar
   - Auto-advance on selection (with back button)

3. Email gate
   - "Your results are ready"
   - Capture: email (required), name, company, role
   - "Get My Report" CTA

4. Report page (instant)
   - Full diagnostic report
   - Share card + social sharing
   - PDF download option
   - "Book a call" CTA

5. (Async) GHL sync + PDF email
   - Contact upserted with tags
   - PDF emailed
```

### 8.2 Pillar grouping UX

Rather than showing 30 questions in one stream, group by pillar:

```
[Pillar 1: Leadership & Vision]
  Question 1 of 6: "Which best describes..."
  Question 2 of 6: ...
  ...
  
[Pillar 2: Data & Infrastructure]
  Question 1 of 6: ...
```

Benefits:

- Respondent understands the structure
- Natural "checkpoints" create sense of progress
- Easier to return to specific sections if reviewing

---

## 9. GHL Integration

### 9.1 Contact fields

| Field | Source |
|-------|--------|
| Email | Email gate |
| Name | Email gate |
| Company | Email gate |
| Role | Email gate (optional) |
| Assessment Template | template.name |
| Overall Score | scores.overall |
| Overall Band | scores.overallBand |
| Primary Constraint | scores.primaryConstraint |
| Completed At | response.completedAt |

### 9.2 Tags

Apply tags based on:

- Template: `assessment:ai-readiness`
- Band: `ai-band:starting`, `ai-band:emerging`, etc.
- Primary constraint: `ai-constraint:data-infrastructure`

### 9.3 Workflow triggers

Fire webhook to trigger GHL automations based on:

- Template + band combination
- Specific primary constraint
- Score thresholds

---

## 10. Success Metrics

### 10.1 Assessment quality

| Metric | Target |
|--------|--------|
| Completion rate | >70% (start → email gate) |
| Time to complete | 15–20 min (for 30 questions) |
| Report share rate | >15% share their score |
| Return visits | >20% return to view report again |

### 10.2 Business impact

| Metric | Target |
|--------|--------|
| Lead quality score | Higher-scoring leads convert better |
| Call prep time | <5 min (report provides context) |
| Discovery call conversion | Baseline + 20% |

---

## 11. Implementation Phases

### Phase 1: Framework (current)

- [ ] Enhanced data model (Question types, pillars, sub-dimensions)
- [ ] Scoring engine with pillar breakdown
- [ ] Template config loader
- [ ] Basic report with pillar breakdown

### Phase 2: Full template

- [ ] 25–30 question AI Readiness template
- [ ] Recommendation mapping
- [ ] Enhanced report (strengths, focus areas, roadmap)
- [ ] PDF generation

### Phase 3: Polish & integration

- [ ] Premium UI (brand guidelines)
- [ ] Share card generation
- [ ] GHL integration
- [ ] Second template (Project Chaos or Recruitment)

---

## 12. Open Questions

1. **Pillar weighting**: Should some pillars count more than others? (Recommendation: start equal, add weighting later if needed)

2. **Branching logic**: Should some questions only appear based on previous answers? (Recommendation: defer to post-V1)

3. **Benchmarking**: Show "You scored X, average is Y"? (Recommendation: requires data; defer until we have responses)

4. **Role-based variants**: Different questions for CEO vs. COO vs. IC? (Recommendation: handle via separate templates initially)

---

## 13. Appendix: Example Questions by Type

### Maturity question

```
Which best describes your organisation's AI strategy?

○ We have no AI strategy
○ AI is discussed informally but there's no formal plan
○ We have a draft AI strategy in development
○ We have a documented AI strategy communicated to leadership
○ AI is fully integrated into our business strategy with clear KPIs
```

### Frequency question

```
How often does your leadership team discuss AI initiatives in strategy meetings?

○ Never
○ Rarely (once or twice a year)
○ Sometimes (quarterly)
○ Often (monthly)
○ Always (every meeting)
```

### Capability question

```
How confident are you that your team could successfully implement an AI pilot project?

○ Not at all confident
○ Slightly confident
○ Somewhat confident
○ Fairly confident
○ Very confident
```

### Specificity question

```
Do you have documented AI use cases for your business?

○ No
○ We've discussed ideas but nothing documented
○ We have a shortlist of potential use cases
○ We have prioritised use cases with business cases
○ We have use cases in active development
```

### Priority question

```
Which is the bigger obstacle to AI adoption in your organisation?

○ Lack of budget and executive buy-in
○ Lack of skills and expertise in the team
```

---

## 14. Next Steps

1. **Review this PRD** – Confirm pillars, question types, and report structure
2. **Update data model** – Implement enhanced Question and Template schemas
3. **Build scoring engine** – Pillar breakdown, sub-dimensions, band calculation
4. **Create AI Readiness template** – Start with 15–20 questions, expand to 30
5. **Enhance report page** – Pillar breakdown, strengths, focus areas
