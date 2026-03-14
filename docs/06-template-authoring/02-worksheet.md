# ScoreKit — Template Worksheet

**How to use this:** Fill in every section below. This is the input for `03-template-generation-prompt.md`, which turns it into a ready-to-use `content.ts` file. Anything marked `[OPTIONAL]` can be left blank.

---

## TEMPLATE IDENTITY

- **Template ID** (lowercase, hyphenated): [e.g. `fitness-readiness`]
- **Template name** (display name): [e.g. "Fitness Readiness Assessment"]
- **Short description** (1 sentence, for SEO meta tag): [e.g. "Discover how ready your body and lifestyle are for a structured fitness programme."]
- **Report title** (heading at the top of the PDF/web report): [e.g. "Your Fitness Readiness Report"]
- **Page title** (browser tab title): [e.g. "Fitness Readiness Assessment | FitMum"]
- **Estimated time to complete**: [e.g. "10 minutes"]

---

## BRAND

- **Brand name** (short display name, appears in footer/email): [e.g. "FitMum"]
- **Primary colour** (hex): [e.g. `#e93f8e`]
- **Primary hover colour** (slightly darker, [OPTIONAL]): [e.g. `#d4327d`]
- **Secondary colour** (hex, [OPTIONAL]): [e.g. `#1b2a4a`]
- **Logo filename** (file in `/public/logos/`): [e.g. `fitmum.png`]
- **Favicon filename** (file in `/public/favicons/`): [e.g. `fitmum.png`]
- **OG image URL** (full URL for social sharing, [OPTIONAL]): [e.g. `https://fitmum.co/og-image.png`]
- **Display font** ([OPTIONAL], leave blank for system default): [e.g. `Montserrat`]
- **Body font** ([OPTIONAL], leave blank for system default): [e.g. `Open Sans`]

---

## LANDING PAGE

- **Headline**: [e.g. "Are you ready to get fit for good?"]
- **Subheadline** (1–2 sentences expanding on the headline): [e.g. "Find out exactly where you are today, what's holding you back, and the fastest path to lasting results — personalised for you."]
- **CTA button text**: [e.g. "Take the Assessment"]
- **Time estimate** (shown below the button): [e.g. "10 minutes"]
- **Trust line** (social proof above the bottom CTA, [OPTIONAL]): [e.g. "Trusted by 1,000+ women on their fitness journey."]

### Value props (3 feature cards shown on landing page)

| Title | Body | Accent colour |
|-------|------|--------------|
| [e.g. "Your Readiness Score"] | [e.g. "See where you stand across fitness, nutrition, mindset, sleep, and lifestyle."] | teal |
| [e.g. "Honest Insights"] | [e.g. "Understand what's working, what's not, and why your past attempts may have stalled."] | purple |
| [e.g. "Your Action Plan"] | [e.g. "Get specific, prioritised recommendations matched to your current stage."] | pink |

*(Accent colour options: `teal`, `purple`, `pink`, `green`)*

---

## SCORE BANDS

Four bands covering 0–100%. Fill in from lowest to highest.

| ID | Label | Minimum % | What it means (1–2 sentences shown on report) |
|----|-------|-----------|------------------------------------------------|
| [e.g. `foundation`] | [e.g. "Foundation Stage"] | 0 | [e.g. "You're at the very beginning of your fitness journey. The most important thing right now is building the habits that everything else can grow from."] |
| [e.g. `building`] | [e.g. "Building Momentum"] | 40 | [e.g. "You've made a start and have some positive habits in place. Now it's about making them consistent and closing the gaps that are still slowing you down."] |
| [e.g. `progressing`] | [e.g. "Progressing Well"] | 65 | [e.g. "You have solid foundations and real momentum. With a few targeted improvements, you're ready to see significant results."] |
| [e.g. `peak`] | [e.g. "Peak Ready"] | 80 | [e.g. "You're primed for serious progress. Your habits, mindset, and lifestyle are aligned — now it's about consistent execution and pushing to the next level."] |

*(The minimum % of the first band is always 0. Adjust the other thresholds to fit your domain.)*

---

## BAND REPORT INTROS

For each band, the report shows a headline and an opening paragraph. Fill in below.

### [Band 1 label — e.g. Foundation Stage]
- **Headline**: [e.g. "You're at the starting line — and that's the best place to build from"]
- **Intro paragraph**: [e.g. "Most people at your stage feel motivated but unsure where to focus first. The good news? This assessment has pinpointed exactly where to begin. Small, targeted changes now will compound quickly — and this report shows you which ones matter most."]

### [Band 2 label]
- **Headline**: [...]
- **Intro paragraph**: [...]

### [Band 3 label]
- **Headline**: [...]
- **Intro paragraph**: [...]

### [Band 4 label]
- **Headline**: [...]
- **Intro paragraph**: [...]

---

## CONTEXT QUESTIONS

These are unscored questions shown before or after the diagnostic sections. They gather demographic and goal information to personalise the report.

| ID | Question text | Input type | Options (for select/multi-select) |
|----|---------------|------------|----------------------------------|
| `ctx-goal` | [e.g. "What is your primary goal right now?"] | select | [e.g. "Lose weight", "Build strength", "Improve fitness", "Feel more energetic", "All of the above"] |
| `ctx-experience` | [e.g. "How would you describe your current activity level?"] | select | [e.g. "Mostly sedentary", "Light activity 1–2×/week", "Moderate activity 3–4×/week", "Active 5+ days/week"] |
| `ctx-blocker` | [e.g. "What has most held you back from your fitness goals in the past?"] | multi-select | [e.g. "Lack of time", "Motivation and consistency", "Not knowing where to start", "Energy levels", "Injury or health issues", "Cost"] |
| `ctx-success` | [e.g. "What does success look like for you in 6 months?"] | text | — |

*(Input types: `select` = dropdown, `multi-select` = checkboxes, `text` = free text)*

---

## PILLARS

One section per pillar. Copy and paste this block for each pillar.

---

### PILLAR: [pillar-id]

- **Name**: [e.g. "Movement & Exercise"]
- **Description** (shown to the respondent before pillar questions, 1–2 sentences): [e.g. "This section looks at how active you currently are and whether your exercise habits are set up for progress."]

#### Questions

Each question must have exactly 5 answer options scored 1 (lowest) to 5 (highest).

**Q1: [Question text]**
- Score 1: [option text]
- Score 2: [option text]
- Score 3: [option text]
- Score 4: [option text]
- Score 5: [option text]

**Q2: ...**

**Q3: ...**

**Q4: ...**

*(Add Q5 if needed. 4–5 questions per pillar.)*

#### Pillar insights

*Low (avg score 1–2.3):*
- **Title** (5–8 words): [e.g. "Your movement habits need a fresh start"]
- **Insight** (2–3 sentences): [e.g. "Regular movement is the foundation everything else is built on. Right now, inconsistency is your biggest challenge — but it's also the fastest thing to fix. Start with a commitment to move for just 20 minutes, three times a week."]

*Medium (avg score 2.4–3.6):*
- **Title**: [...]
- **Insight**: [...]

*High (avg score 3.7–5):*
- **Title**: [...]
- **Insight**: [...]

#### Recommendation

*Shown on the report regardless of score level — the #1 action for this pillar:*
- **Headline** (verb-first, 4–6 words): [e.g. "Build your exercise baseline first"]
- **Action** (1 concrete sentence — what to do this week): [e.g. "Block three 30-minute sessions in your calendar this week and treat them like appointments."]
- **Detail** (1 sentence — why it matters or a tip): [e.g. "Consistency beats intensity every time — three modest workouts done reliably will outperform one intense session per fortnight."]

---

*(Repeat the PILLAR block above for each of your 4–6 pillars)*

---

## REPORT SECTION HEADINGS [OPTIONAL]

Override the default section headings if needed.

- **Pillar scores section**: [default: "Your Results by Pillar"]
- **Key insights section**: [default: "Key Insights"]
- **Next steps section**: [default: "Your Next Steps"]
- **How we score section**: [default: "How we calculated your scores"]
- **Your profile section**: [default: "Your Profile"]

---

## NEXT STEPS

Three action items shown at the bottom of the report (above the CTA).

| Title | Description |
|-------|-------------|
| [e.g. "Share your results with your coach"] | [e.g. "Your coach can use this report to personalise your programme from day one."] |
| [e.g. "Focus on your lowest-scoring pillar first"] | [e.g. "Small improvements in your weakest area will have the biggest impact on your overall progress."] |
| [e.g. "Book your free strategy call"] | [e.g. "Let's map out your first 8 weeks together based on exactly what this report revealed."] |

---

## CTA BLOCK

The call-to-action shown at the bottom of the report.

- **Headline**: [e.g. "Ready to turn your results into real progress?"]
- **Body** (1–2 sentences): [e.g. "Book a free 30-minute call with one of our coaches. We'll walk through your results and build your personalised 8-week plan."]
- **Button text**: [e.g. "Book Your Free Call"]
- **Button URL**: [e.g. `https://fitmum.co/book`]
