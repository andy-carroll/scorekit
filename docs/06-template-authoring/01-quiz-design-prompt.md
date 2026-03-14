# ScoreKit — Quiz Design Prompt

**How to use this:** Fill in the five lines under "My context", then paste the entire document into Claude (or any capable LLM). You'll get back a fully designed quiz architecture ready to drop into the worksheet.

---

## My context

- **Target audience:** [WHO TAKES THIS QUIZ — be specific, e.g. "female personal training clients aged 30–50 who want to get fit after having children"]
- **Domain / what we're assessing:** [WHAT ARE YOU MEASURING — e.g. "fitness readiness and lifestyle habits", "sales team capability", "sustainability maturity"]
- **Primary outcome for the respondent:** [WHAT SHOULD THEY GET FROM THIS — e.g. "a personalised fitness readiness score and a training plan recommendation", "clarity on where their sales process breaks down"]
- **How it will be used:** [LEAD GEN / COACHING TOOL / BENCHMARKING / SELF-ASSESSMENT / PROGRAMME ENTRY CRITERIA]
- **Anything else that matters:** [E.G. "questions must feel encouraging, not judgemental", "we serve both beginners and experienced athletes", "this is for B2B SaaS companies only"]

---

## Your task

Please design a complete assessment quiz for me using the ScoreKit framework. Here is exactly what I need:

### 1. Pillars (4–6 total)

For each pillar, provide:
- **ID** (lowercase, hyphenated, e.g. `nutrition`, `movement-habits`, `mindset`)
- **Name** (display name, e.g. "Nutrition & Fuelling")
- **Description** (1–2 sentences shown to the respondent before questions in that pillar)

Pillars should be genuinely distinct dimensions that together give a complete picture. Each should be independently improvable — a low score on one pillar should lead to a different recommendation than a low score on another.

### 2. Scored questions per pillar (4–5 per pillar)

For each pillar, write 4–5 diagnostic questions. Each question must have **exactly 5 answer options** scored 1 (lowest/worst) through 5 (highest/best).

**ScoreKit question design principles — follow these carefully:**
- **Concrete and observable**: Each option must describe a real behaviour, state, or situation — not a vague quality. Bad: "Poor / Fair / Good / Very Good / Excellent". Good: "I never track my food intake / I track occasionally when I remember / I track most days but inconsistently / I track daily with some gaps / I track consistently with full nutritional detail."
- **Clearly distinct**: No two adjacent options should feel interchangeable or overlap in meaning.
- **Realistic progression**: The steps from 1→2→3→4→5 should represent how someone actually develops, not arbitrary intervals.
- **Written for the respondent**: Use plain language. Avoid technical jargon unless your audience is experts. Write in first person where natural ("I…" or "My…").
- **Neutral tone**: Don't shame low scores. Frame option 1 as "where most people start" not "failure".

### 3. Context questions (4–6 total, unscored)

These gather demographic and goal information to personalise the report. They are NOT scored. Provide:

- **ID** (e.g. `ctx-goal`, `ctx-experience`)
- **Question text**
- **Input type**: `select` (dropdown), `multi-select` (checkboxes), or `text` (free text)
- **Options** (for select and multi-select): 4–8 choices

Typical context questions cover: who they are, their starting point, what they want, what's blocked them before, what success looks like.

### 4. Score bands (4 bands)

Define 4 bands that carve up the 0–100% score range. For each band:
- **ID** (e.g. `foundation`, `building`, `progressing`, `peak`)
- **Label** (display name shown on the report, e.g. "Foundation Stage")
- **Minimum % threshold** (the lowest score that falls into this band)
- **What it means** (1–2 sentences describing someone at this level)

Bands should feel meaningful and motivating, not clinical. The top band should feel genuinely aspirational, not just "you scored high."

### 5. Pillar insights (per pillar, 3 levels: low / medium / high)

For each pillar, write a short insight for each score level (low = avg 1–2.3, medium = avg 2.4–3.6, high = avg 3.7–5):
- **Title** (5–8 words, e.g. "Your nutrition foundations need attention")
- **Insight** (2–3 sentences that explain what this score means for the respondent and what they should focus on)

Be specific and actionable. Avoid generic advice. Reference the domain.

### 6. Recommendations (one per pillar)

For each pillar, write a recommendation that appears on the report regardless of score level (it's the "first action to take" for this pillar):
- **Headline** (verb-first, e.g. "Build your nutrition tracking habit")
- **Action** (1 concrete sentence — what to do this week)
- **Detail** (1 sentence — why this matters or a practical tip)

---

## Output format

Please output in the following structured format so I can paste it directly into the ScoreKit worksheet:

```
## PILLARS

### [pillar-id]
Name: [Pillar Name]
Description: [1–2 sentences]

### [pillar-id]
...

---

## SCORED QUESTIONS

### [pillar-id]

**Q1: [Question text]**
- Score 1: [Option text]
- Score 2: [Option text]
- Score 3: [Option text]
- Score 4: [Option text]
- Score 5: [Option text]

**Q2: ...**

---

## CONTEXT QUESTIONS

**[ctx-id]: [Question text]** (input: select)
- [option-id]: [Option label]
- [option-id]: [Option label]
...

---

## SCORE BANDS

| ID | Label | Min % | What it means |
|----|-------|-------|---------------|
| [id] | [Label] | [0/40/60/80] | [Description] |

---

## PILLAR INSIGHTS

### [pillar-id]
Low (avg 1–2.3):
  Title: [title]
  Insight: [2–3 sentences]
Medium (avg 2.4–3.6):
  Title: [title]
  Insight: [2–3 sentences]
High (avg 3.7–5):
  Title: [title]
  Insight: [2–3 sentences]

---

## RECOMMENDATIONS

### [pillar-id]
Headline: [verb-first headline]
Action: [1 concrete sentence]
Detail: [1 sentence why/tip]
```

Once I've reviewed your output I'll refine it, then use the template generation prompt to turn it into code.
