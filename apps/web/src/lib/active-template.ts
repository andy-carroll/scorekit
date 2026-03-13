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

import { aiReadinessContent } from "@scorekit/core";
import type { TemplateContent } from "@scorekit/core";

const TEMPLATES: Record<string, TemplateContent> = {
  "ai-readiness": aiReadinessContent,
};

export function getActiveTemplateContent(): TemplateContent {
  const id = process.env.SCOREKIT_TEMPLATE_ID ?? "ai-readiness";
  const content = TEMPLATES[id];
  if (!content) {
    throw new Error(
      `Unknown SCOREKIT_TEMPLATE_ID: "${id}". Available: ${Object.keys(TEMPLATES).join(", ")}`
    );
  }
  return content;
}

export type { TemplateContent };
