import { sections, getQuestionsForSection, type Question } from "@/lib/questions";

export type TestAnswerValue = number | string | string[];

type BasicOption = { value?: number; id?: string; label?: string };

function getDefaultAnswerForQuestion(q: Question): TestAnswerValue {
  // Simple heuristics to produce valid, non-empty answers
  if (q.inputType === "radio" && Array.isArray(q.options) && q.options.length > 0) {
    const idx = Math.floor(q.options.length / 2);
    const opt = q.options[idx] as BasicOption;
    // For scored options, use numeric value; otherwise fall back to id/label
    if (typeof opt.value === "number") return opt.value;
    if (typeof opt.id === "string") return opt.id;
    return opt.label ?? idx;
  }

  if (q.inputType === "select" && Array.isArray(q.options) && q.options.length > 0) {
    const opt = q.options[0] as BasicOption;
    return opt.id ?? opt.label ?? "option-0";
  }

  if (q.inputType === "multi-select" && Array.isArray(q.options) && q.options.length > 0) {
    const opt = q.options[0] as BasicOption;
    const id = opt.id ?? opt.label ?? "option-0";
    return [id];
  }

  if (q.inputType === "number") {
    return 3; // mid-scale placeholder
  }

  // text or any other fallback
  return "Test answer";
}

/**
 * Build a complete set of test answers for the current template.
 * Uses sections + getQuestionsForSection so it should generalise to new templates
 * that plug into the same questions module.
 */
export function buildTestAnswersForCurrentTemplate(): Record<string, TestAnswerValue> {
  const answers: Record<string, TestAnswerValue> = {};

  for (const section of sections) {
    const qs = getQuestionsForSection(section.id);
    for (const q of qs) {
      if (!q.id) continue;
      answers[q.id] = getDefaultAnswerForQuestion(q);
    }
  }

  return answers;
}
