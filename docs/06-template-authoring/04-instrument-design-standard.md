# Instrument design standard

The shared grammar every ScoreKit template follows. Question **counts** vary by
what the instrument measures; everything else here is fixed. Established across
the two live instruments (ai-readiness, org-level; ai-capability, person-level)
and confirmed as a deliberate decision on 2026-07-12 — see "Length" below before
proposing to align counts between templates.

## The fixed grammar

1. **Five options per scored question, values 1–5.** Options are escalating
   *behavioural descriptions* — what the respondent actually does — never
   agree/disagree statements. Each option should be selectable with a straight
   face by someone at that level.

2. **Option 5 is "designs or teaches it for others."** The top of every scale is
   not "does it very well" but "builds the capability in others" — that is what
   distinguishes level 5 from level 4 and keeps the ceiling meaningful.

3. **Option 1 is an anchor, not an answer.** The bottom option is often an
   obvious no-no nobody will pick ("paste it straight in", "send it unread").
   That is deliberate and load-bearing: it defines the floor so option 2 reads
   as an *admissible confession* rather than the worst available answer — which
   is where the honest signal lives. It also states the norm: reading the bad
   option teaches the respondent where the line is. Do not "fix" throwaway
   option 1s; without them, nobody picks the new floor. Consequence to accept:
   the dimension's real range compresses to roughly 2–5, and the discrimination
   concentrates at the 2/3 boundary — design that boundary carefully, it is
   usually the one that matters commercially.

4. **Five declared bands** via the template's `bands` field in `content.ts`
   (minScore inclusive, maxScore exclusive, top band catches 100). Never rely on
   the legacy hardcoded 4-band fallback for a new template. Band names in
   sentence case; they must exactly match the `bandIntros` keys. Note: this is
   the standard for new templates going forward — `ai-capability` already
   declares 5 bands this way, but `ai-readiness` (the original, live template)
   predates the convention and still runs on the legacy 4-band fallback
   (`bandIntros` has 4 keys, no `bands` field declared). Migrating it is a
   deferred follow-up, not part of this doc.

5. **Person-level instruments carry a required free-text anchor** — "the most
   recent piece of real work you used AI for." This is the honesty instrument
   (it exposes the gap between self-rating and actual practice) and the anchor
   for any narrative report layer. A second optional free-text (current
   frustration) is cheap and often gold. Org-level instruments use an
   aspiration/goal free-text instead.

6. **Voice**: no em-dashes in respondent-facing copy, no hype, UK English,
   sentence case throughout. Same standard as the PDF and report copy.

## Length — deliberately NOT aligned across templates

Question count is a **measurement budget**, not a format choice. Do not pad or
trim a template to match another one's count.

| Subject | Coverage guide | Fatigue budget | Live example |
|---|---|---|---|
| **Org-level** (respondent rates their company) | 4–5 questions per pillar — org pillars are broad and multi-faceted | Self-serve, buying frame: ~10 min is acceptable | ai-readiness: 24 scored + 6 context |
| **Person-level** (respondent rates their own practice) | 2–3 questions per dimension — tight behavioural dimensions discriminate quickly | Mandated cohort: answer quality decays fast; shorter is a feature | ai-capability: 13 scored + 2 free-text + 2 demographic |

Reviewed and confirmed 2026-07-12: the 30-question / 17-question difference
between the two live instruments is intentional. No respondent takes both; no
buyer counts. Depth on a person-level instrument comes from the free-text
anchors and the managed narrative layer, not from more questions.

## Design with the bias asymmetry in mind

The two subjects fail in opposite directions:

- **Self-rating inflates.** People rating their own capability can read an
  escalating scale and pick aspirationally. Mitigations: the required free-text
  anchor (a level-5 self-rating beside "I asked ChatGPT to write an email" tells
  on itself), internal consistency across dimensions, development framing at
  point of introduction ("honest answers get a more useful report"), and human
  review where a managed tier exists. Accept that the instrument measures
  self-perception; the mitigations catch divergence, they don't prevent it.
- **Org-rating deflates.** People rating their company in a buying frame tend to
  understate — complaining about your employer is socially cheap, and they're
  taking the quiz because they feel behind. For a lead magnet this errs in the
  useful direction (surfaces pain). Don't over-correct for it.

## Keep instruments in lockstep across surfaces

If a template is deployed on more than one surface (ScoreKit web + a Tally form
+ a downstream scorer), the option labels must stay **byte-identical** across
all of them — text matching is how answers are scored on the managed path. Any
copy edit is a change to all surfaces at once, or it is a bug.
