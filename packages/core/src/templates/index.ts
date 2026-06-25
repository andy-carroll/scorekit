/**
 * Template Registry
 *
 * Central export for all assessment templates.
 */

export * from "./ai-readiness";
export { aiCapabilityContent } from "./ai-capability";

import { aiReadinessContent } from "./ai-readiness";
import { aiCapabilityContent } from "./ai-capability";

export const templates = {
  "ai-readiness": aiReadinessContent,
  "ai-capability": aiCapabilityContent,
} as const;

export type TemplateId = keyof typeof templates;

export function getTemplateContent(id: TemplateId) {
  return templates[id];
}
