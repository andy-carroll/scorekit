# Scoring Model

## Requirements

- Deterministic and explainable
- Supports 25–35 questions
- Produces an overall score and per-pillar breakdown
- Produces a maturity band (e.g., Starter/Emerging/Developing/Leading)

## Recommended approach

- 5 pillars
- Each question scored 0–4
- Pillar score = average → normalised to 0–100
- Overall score = weighted average of pillar scores (default equal weighting)

## Outputs

- Overall score (0–100)
- Per-pillar scores (0–100)
- Maturity bands (overall + per pillar)
- Primary constraint = lowest pillar

## Non-goals

- Research/AI enrichment does not alter numeric score
