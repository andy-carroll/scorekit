/**
 * ScoreKit Template Registry
 * ============================================================
 * Maps SCOREKIT_TEMPLATE_ID env var → TemplateContent.
 *
 * Each entry in TEMPLATES is a separate client/brand deployment.
 * One Vercel project per client, each with its own SCOREKIT_TEMPLATE_ID.
 *
 * ── HOW IT WORKS ────────────────────────────────────────────────
 * • SCOREKIT_TEMPLATE_ID is set as an env var in your Vercel project.
 * • getActiveTemplateContent() is called server-side by layout.tsx,
 *   page.tsx, and other Server Components.
 * • The returned TemplateContent drives: page copy, brand colors, CSS
 *   custom property overrides, metadata, report headings.
 *
 * ── TO ADD A NEW TEMPLATE (new client or brand) ─────────────────
 * 1. Copy packages/core/src/templates/ai-readiness/ → your-template-id/
 * 2. Update content.ts with your brand.colors, copy, questions, scoring
 * 3. Export it from packages/core/src/index.ts
 * 4. Add it to the TEMPLATES map below
 * 5. Deploy a new Vercel project with SCOREKIT_TEMPLATE_ID=your-template-id
 *
 * ── CURRENT TEMPLATES ────────────────────────────────────────────
 * • "ai-readiness" — Accelerator-X AI Readiness Assessment (teal/pink)
 *   → Deploy with SCOREKIT_TEMPLATE_ID=ai-readiness (or omit — it's the default)
 *
 * Add Accelerator Solutions (amber/blue) when needed:
 *   Copy ai-readiness/ → ai-readiness-solutions/, update brand.colors,
 *   register here, deploy with SCOREKIT_TEMPLATE_ID=ai-readiness-solutions.
 * ============================================================
 */

import { aiReadinessContent, aiCapabilityContent } from "@scorekit/core";
import type { TemplateContent } from "@scorekit/core";

const TEMPLATES: Record<string, TemplateContent> = {
  "ai-readiness": aiReadinessContent,
  "ai-capability": aiCapabilityContent,
};

const DEFAULT_TEMPLATE_ID = "ai-readiness";

export function getActiveTemplateContent(): TemplateContent {
  // `||` (not `??`) so an empty-string env var is treated as unset, not as an
  // invalid template id.
  const id = process.env.SCOREKIT_TEMPLATE_ID || DEFAULT_TEMPLATE_ID;

  // Guard against a split-brain deployment. The server selects report/PDF
  // content from SCOREKIT_TEMPLATE_ID; the quiz (a client component) selects its
  // question set — and therefore the score band it writes into the report — from
  // NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID. If the two effective values diverge, the
  // stored band name won't match this template's bandIntros and reports/PDFs
  // silently render the wrong template's copy. Fail fast at the first
  // server-side resolution instead. Both default to the same id, so a
  // single-template deployment (e.g. ai-readiness) is unaffected.
  const clientId =
    process.env.NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID || DEFAULT_TEMPLATE_ID;
  if (clientId !== id) {
    throw new Error(
      `Template misconfiguration: SCOREKIT_TEMPLATE_ID ("${id}") and ` +
        `NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID ("${clientId}") must be set to the ` +
        `same template. The server resolves report/PDF content from the former; ` +
        `the quiz resolves its question set from the latter — a mismatch produces ` +
        `reports whose scores and content come from different templates.`
    );
  }

  const content = TEMPLATES[id];
  if (!content) {
    throw new Error(
      `Unknown SCOREKIT_TEMPLATE_ID: "${id}". Available: ${Object.keys(TEMPLATES).join(", ")}`
    );
  }
  return content;
}

export type { TemplateContent };
