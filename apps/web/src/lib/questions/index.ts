/**
 * Question-set registry + scoring.
 * ============================================================
 * The quiz engine imports `sections`, `getQuestionsForSection`, and
 * `calculateScore` from "@/lib/questions" (this module). Which question set is
 * active is chosen by NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID — the client-visible
 * twin of SCOREKIT_TEMPLATE_ID (which selects report content server-side).
 * Both must be set to the same value in a deployment.
 *
 * To add a template: create ./your-template.ts exporting `sections` and
 * `questions`, then register it in QUESTION_SETS below. Score bands come from
 * the template's content (`bands` in content.ts); when absent, scoring falls
 * back to the default 4-band logic.
 */
import { templates } from "@scorekit/core";
import type { Band, TemplateContent } from "@scorekit/core";
import * as aiReadiness from "./ai-readiness";
import * as aiCapability from "./ai-capability";
import type { Question, Section, QuestionSet, ScoreResult } from "./types";

const DEFAULT_TEMPLATE_ID = "ai-readiness";

const QUESTION_SETS: Record<string, QuestionSet> = {
  "ai-readiness": { sections: aiReadiness.sections, questions: aiReadiness.questions },
  "ai-capability": { sections: aiCapability.sections, questions: aiCapability.questions },
};

const ACTIVE_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID ?? DEFAULT_TEMPLATE_ID;

const activeSet =
  QUESTION_SETS[ACTIVE_TEMPLATE_ID] ?? QUESTION_SETS[DEFAULT_TEMPLATE_ID];

export const sections: Section[] = activeSet.sections;
export const questions: Question[] = activeSet.questions;
export type { Question, Section } from "./types";

// Helper to get questions for a section
export function getQuestionsForSection(sectionId: string): Question[] {
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return [];
  return section.questionIds
    .map((qId) => questions.find((q) => q.id === qId))
    .filter((q): q is Question => q !== undefined);
}

// Get pillar sections only (excluding context)
export function getPillarSections(): Section[] {
  return sections.filter((s) => s.type === "pillar");
}

/** Bands declared on the active template's content, if any. */
function activeBands(): Band[] | undefined {
  const content = (templates as Record<string, TemplateContent>)[ACTIVE_TEMPLATE_ID];
  return content?.bands;
}

/**
 * Resolve a band name for a percentage score.
 * - With custom `bands`: minScore inclusive, maxScore exclusive; top band
 *   inclusive at 100. Band `name` is returned (must match a `bandIntros` key).
 * - Without: the default AI-readiness 4-band logic (unchanged).
 */
function bandForPercentage(percentage: number, bands?: Band[]): string {
  if (bands && bands.length > 0) {
    const sorted = [...bands].sort((a, b) => a.minScore - b.minScore);
    for (const b of sorted) {
      if (percentage >= b.minScore && percentage < b.maxScore) return b.name;
    }
    const top = sorted[sorted.length - 1];
    if (top && percentage >= top.maxScore) return top.name;
    return sorted[0].name;
  }

  if (percentage >= 80) return "Leader";
  if (percentage >= 60) return "Progressing";
  if (percentage >= 40) return "Emerging";
  return "Starting";
}

export function calculateScore(answers: Record<string, number>): ScoreResult {
  const pillarScores: Record<string, number> = {};
  const pillarTotals: Record<string, { sum: number; count: number }> = {};
  let total = 0;
  let scoredQuestionCount = 0;

  // Only score diagnostic questions (those with pillarId)
  for (const q of questions) {
    if (q.category === "diagnostic" && "pillarId" in q && q.pillarId) {
      const answer = typeof answers[q.id] === "number" ? answers[q.id] : 1;
      total += answer;
      scoredQuestionCount++;

      // Accumulate pillar scores
      if (!pillarTotals[q.pillarId]) {
        pillarTotals[q.pillarId] = { sum: 0, count: 0 };
      }
      pillarTotals[q.pillarId].sum += answer;
      pillarTotals[q.pillarId].count++;
    }
  }

  // Calculate average score per pillar (1-5 scale)
  for (const [pillarId, { sum, count }] of Object.entries(pillarTotals)) {
    pillarScores[pillarId] = Math.round((sum / count) * 10) / 10; // Round to 1 decimal
  }

  const max = scoredQuestionCount * 5;
  const percentage = max > 0 ? Math.round((total / max) * 100) : 0;
  const band = bandForPercentage(percentage, activeBands());

  return { total, max, percentage, pillarScores, band };
}
