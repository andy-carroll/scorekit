# PRD: Assessment Framework

> **Status**: Draft  
> **Author**: Andy Carroll  
> **Created**: Dec 2024  
> **Related tickets**: scorekit-6r3, scorekit-nqr, scorekit-hr0

---

## 1. Problem Statement

### The opportunity

Business leaders are drowning in generic "how mature is your X" quizzes that produce meaningless scores and forgettable PDFs. Meanwhile, premium consultancy audits (£2k–£10k) deliver genuine insight but are inaccessible to most.

### What we're building

A **template-driven assessment engine** that produces genuinely useful diagnostic reports—the kind that get shared internally, spark discussion, and equip sales conversations with real insight.

### Why it matters

1. **For the respondent**: Clarity on where they actually stand, not flattery or vague bands
2. **For the business owner (us)**: Rich lead qualification data before the first call
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
- Reveals strengths and weaknesses the respondent may not have articulated
- Provides specific, actionable focus areas (not generic advice)
- Is worth sharing with colleagues and discussing in leadership meetings
- Gives us (the business) insight into their real pain points before a call

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

All question types render as **single-select radio buttons** in V1. The type describes the *nature* of the question, not the UI.

### 4.1 Type definitions

| Type | Purpose | Answer pattern | Example |
|------|---------|----------------|---------|
| **Maturity** | Assess current state | 5 scenarios from lowest to highest maturity | "Which best describes your AI strategy?" |
| **Frequency** | Reveal actual behaviour | Never → Rarely → Sometimes → Often → Always | "How often does leadership discuss AI in strategy meetings?" |
| **Capability** | Gauge confidence | Not at all → Slightly → Somewhat → Fairly → Very | "How confident are you that your team could run an AI pilot?" |
| **Specificity** | Check concrete facts | Yes / No / Partial / Planned / Don't know | "Do you have documented AI use cases?" |
| **Priority** | Force trade-offs | Choose A or B (both are valid blockers) | "Which is the bigger obstacle: lack of budget or lack of skills?" |

### 4.2 Why multiple types matter

- **Maturity** questions reveal where they *think* they are
- **Frequency** questions reveal what they *actually do*
- **Capability** questions reveal confidence gaps
- **Specificity** questions cut through aspiration to reality
- **Priority** questions expose what leadership perceives as the real problem

Mixing types within a pillar produces richer, more diagnostic insight.

### 4.3 Question mix per pillar (recommendation)

For a 6-question pillar:
- 2 × Maturity
- 2 × Frequency
- 1 × Capability
- 1 × Specificity

Priority questions are optional and best used sparingly (1–2 per assessment).

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

The report is the core deliverable. It must be:
- **Worth sharing**: Colleagues should want to discuss it
- **Actionable**: Clear focus areas, not vague advice
- **Traceable**: Every insight maps to specific answers
- **Branded**: Premium design, not generic PDF

### 6.1 Report sections

| Section | Content |
|---------|---------|
| **Header** | Respondent name, company, date, template name |
| **Executive summary** | 2–3 sentences: overall band, primary constraint, top strength |
| **Overall score** | Percentage + band + visual (gauge or score card) |
| **Pillar breakdown** | Score per pillar + band + sub-dimension detail (if applicable) |
| **Strengths** | Top 2–3 highest-scoring areas with "what this means" |
| **Focus areas** | Top 3 lowest-scoring areas with specific recommendations |
| **Primary constraint deep-dive** | Expanded analysis of the weakest pillar |
| **30/60/90-day roadmap** | Template-specific actions based on score profile |
| **Next steps** | CTA (book a call, share with team, etc.) |

### 6.2 Recommendation mapping

Each pillar (or sub-dimension) has **pre-written recommendations** that trigger based on score:

```yaml
pillar: data_infrastructure
recommendations:
  - score_range: [0, 39]
    headline: "Data foundations need urgent attention"
    body: "Before pursuing AI initiatives, focus on..."
    actions:
      - "Audit current data sources and quality"
      - "Establish basic data governance policies"
  - score_range: [40, 59]
    headline: "Data foundations are emerging"
    body: "You have some data infrastructure, but gaps remain..."
```

### 6.3 Share card

A visual summary card for social sharing:
- Overall score + band
- Pillar radar or bar chart
- Template branding
- Call to action (take the assessment)

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

