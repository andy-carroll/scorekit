/**
 * Template Registry
 *
 * Central export for all assessment templates.
 */

export * from "./ai-readiness";

import { content as aiReadinessContent } from "./ai-readiness";

export const templates = {
  "ai-readiness": aiReadinessContent,
} as const;

export type TemplateId = keyof typeof templates;

export function getTemplateContent(id: TemplateId) {
  return templates[id];
}
