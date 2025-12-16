# PRD: Report Page Redesign

> **Status**: Draft  
> **Author**: Andy Carroll  
> **Created**: Dec 2025  
> **Related tickets**: scorekit-ym7, scorekit-qzo

---

## 1. Problem Statement

### Current State

The report page is a data dump: 10+ horizontal bars, generic recommendations, no narrative. It fails to deliver on the assessment's promise of revealing insights that spark discussion and move teams forward.

### Why This Matters

Users just invested 15–20 minutes answering personal, sometimes uncomfortable questions. They exposed vulnerabilities about their organisation. The report should feel like a trusted advisor reflecting back — not a scorecard grading them.

**The current report fails because:**

| Problem | Impact |
|---------|--------|
| Data dump | 10+ bars overwhelm; no hierarchy of importance |
| No narrative | Shows scores but doesn't tell a story |
| Generic recs | "Focus on strengthening this area" — no specificity |
| Impersonal | Doesn't use their words back at them |
| Not shareable | Would you forward this to your board? No. |
| No "aha" | Nothing surprising or memorable |

---

## 2. User Context & Jobs-to-be-Done

### Who is this person?

- **Role**: Founder, MD, or senior leader at a scaling company (11–200 employees)
- **Technical depth**: Not technical — strategic decision-makers
- **Entry point**: Talk/workshop, LinkedIn, referral, or direct outreach
- **Investment**: Just spent 15–20 minutes on the assessment

### What job are they hiring this report to do?

| Job | Underlying Need |
|-----|-----------------|
| **Validate a hunch** | "I suspected we were behind — now I have proof" |
| **Build internal consensus** | "I need ammunition to convince my co-founder / board / team" |
| **Prioritise action** | "Where should we start? What matters most?" |
| **Justify investment** | "Is this worth our time and money?" |
| **Start a conversation** | "I want to share something that sparks discussion" |

### Why would they share this internally?

The report must be:
1. **Visually credible** — professional, not generic AI output
2. **Personally relevant** — uses their data and words
3. **Provocative** — sparks discussion, not eye-rolls

---

## 3. How Might We Questions

1. **HMW make them feel understood, not judged?**
   - They exposed vulnerabilities. Reflect back with empathy.

2. **HMW give them language they can use internally?**
   - Phrases and framings they can copy into Slack or a board deck.

3. **HMW make one thing crystal clear?**
   - What's the *one* insight that matters most?

4. **HMW earn the forward?**
   - Why would they share this? Make it worth discussing.

5. **HMW move them toward action without being pushy?**
   - The CTA should feel like the obvious next step, not a sales pitch.

---

## 4. Report Structure (Wireframe)

### 4.1 Above the Fold: The Headline Insight

```
┌─────────────────────────────────────────────────────────────────┐
│  AI Readiness Report                                            │
│  Prepared for [Name] at [Company]                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  "Your team is ready to move — but leadership          │   │
│  │   clarity is holding you back."                        │   │
│  │                                                         │   │
│  │  [Emerging]  42%                                        │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Content**: One sentence headline. Personalised. Provocative. Uses pillar data to identify the *real* bottleneck.

**Band framing**: Non-judgemental. "Emerging" means opportunity, not failure.

---

### 4.2 Your Profile: Visual Summary

```
┌─────────────────────────────────────────────────────────────────┐
│  Your AI Readiness Profile                                      │
│                                                                 │
│       Leadership          Data         People                   │
│          ████░░           ███░░░        ██░░░░                  │
│           3/5              2.5/5         2/5                    │
│                                                                 │
│        Process           Culture                                │
│          ███░░░           ████░░                                │
│           2.5/5            3.5/5                                │
│                                                                 │
│  [Alternative: Radar/spider chart with 5 pillars]              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Design principles**:
- NOT 10+ horizontal bars
- Simple 5-pillar visual (blocks, radar, or pentagon)
- Colour coding: red (1-2), amber (2.5-3.5), green (4-5)
- Clean, scannable at a glance

---

### 4.3 Your Top Blocker: The Key Insight

```
┌─────────────────────────────────────────────────────────────────┐
│  🎯 Your Biggest Opportunity                                    │
│                                                                 │
│  People & Skills                                    Score: 2/5  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  You said your biggest frustration is "lack of skills" —       │
│  and your People & Skills pillar scored lowest.                │
│                                                                 │
│  This is your leverage point.                                  │
│                                                                 │
│  Teams with low skills scores typically:                       │
│  • Spend 40% longer on AI experiments                          │
│  • Abandon 60% of pilots due to capability gaps                │
│  • Miss competitive opportunities while upskilling             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Logic**:
- Pick lowest-scoring pillar
- Connect to their own words (from context questions)
- Add industry context / benchmarks (if available)

---

### 4.4 What This Means: Cost Framing

```
┌─────────────────────────────────────────────────────────────────┐
│  💰 The Cost of Inaction                                        │
│                                                                 │
│  Based on your team size and industry, skill gaps like yours   │
│  typically cost:                                               │
│                                                                 │
│     £120,000 – £180,000 / year                                 │
│     in missed productivity and delayed initiatives             │
│                                                                 │
│  [How we calculated this →]                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Note**: Requires value calculation engine (Phase 4). For MVP, can show placeholder or qualitative framing.

---

### 4.5 One Recommended Action

```
┌─────────────────────────────────────────────────────────────────┐
│  ✅ Your First Move                                             │
│                                                                 │
│  Start a weekly 45-minute "AI Lab" session                     │
│                                                                 │
│  Block 45 minutes every Friday for your team to experiment     │
│  with AI tools on real work problems. No agenda, no pressure   │
│  — just protected time to build capability.                    │
│                                                                 │
│  Teams who do this consistently see a 40% improvement in       │
│  skills scores within 90 days.                                 │
│                                                                 │
│  [📥 Download our AI Lab starter kit]                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Principle**: Not three recommendations. **One.** The single highest-ROI thing they could do this week.

---

### 4.6 Share & Discuss

```
┌─────────────────────────────────────────────────────────────────┐
│  📤 Share This Report                                           │
│                                                                 │
│  [Copy Link]  [Download PDF]  [Email to Team]                  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  💬 Want to talk through your results?                         │
│                                                                 │
│  Book a free 15-minute strategy call to discuss                │
│  your priorities and next steps.                               │
│                                                                 │
│            [Book a Call]                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**CTA principles**:
- Share options prominent (they're the multiplier)
- Call booking is soft, positioned as helpful not salesy
- "Discuss your results" not "Let me sell you something"

---

## 5. Data Requirements

### What we have now

| Data | Source | Status |
|------|--------|--------|
| Pillar scores (5) | `calculateScore()` | ✅ Available |
| Overall percentage | `calculateScore()` | ✅ Available |
| Band (Starting/Emerging/Progressing/Leader) | `calculateScore()` | ✅ Available |
| User name + company | Email form | ✅ Available |
| Selected frustrations | Context question `ctx-pain` | ✅ Available |
| Aspiration text | Context question `ctx-aspiration` | ✅ Available |
| Employee count | Context question `ctx-employees` | ✅ Available |
| Industry | Context question `ctx-industry` | ✅ Available |

### What we need (future phases)

| Data | Purpose | Phase |
|------|---------|-------|
| Cost estimates | "Cost of Inaction" section | Phase 4 |
| Value projections | ROI framing | Phase 4 |
| Benchmark data | Industry comparisons | Phase 6+ |

---

## 6. Implementation Phases

### Phase A: Structure & Narrative (MVP)
- New report layout with sections 4.1–4.3 + 4.5–4.6
- Use existing data (pillar scores, context answers)
- Generate headline insight from pillar analysis
- Connect frustrations to lowest pillar

### Phase B: Cost Framing
- Add section 4.4 with qualitative cost framing
- Placeholder until value calculation engine ready

### Phase C: Polish & Sharing
- PDF generation
- Shareable links
- Email-to-team functionality

---

## 7. Success Metrics

| Metric | Target | How to measure |
|--------|--------|----------------|
| Time on report page | >60 seconds | Analytics |
| Share rate | >15% click share/download | Event tracking |
| Call booking rate | >5% | CTA clicks |
| User feedback | "Would share with team" >70% | Survey |

---

## 8. Open Questions

1. Should we show all 5 pillars equally, or hierarchy by score?
2. How do we generate the headline insight? (Rule-based vs. AI-generated)
3. What's the right balance of specificity vs. keeping it short?
4. Do we need industry-specific recommendations?

---

## Appendix: Current Report Screenshot

[See attached screenshot showing 10+ bars, generic recommendations, overwhelming layout]
