# API Spec (Draft)

## V1 endpoints

- `POST /api/assessments/start`
- `POST /api/assessments/:id/answers`
- `POST /api/assessments/:id/unlock` (email gate)
- `GET /report/:token`
- `POST /api/ghl/sync`
- `POST /api/pdf/generate`

## Notes

- The exact shape will evolve with the Next.js implementation.
- Keep report access tokenised.
