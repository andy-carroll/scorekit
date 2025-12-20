import type { Template, Question, ScoredOption, UnscoredOption, ChoiceOption } from "./types";

export interface MappedAnswer {
  questionId: string;
  questionText: string;
  pillarId: string;
  pillarName: string;
  displayAnswer: string;
}

export interface PillarAnswers {
  pillarId: string;
  pillarName: string;
  answers: MappedAnswer[];
}

interface MapAnswersParams {
  template: Template;
  answers: Record<string, number | string | string[]>;
}

/**
 * Map raw answers + template metadata into a structure grouped by pillar
 * suitable for web "How we calculated your scores" and PDF appendix.
 */
export function mapAnswersToPillars({ template, answers }: MapAnswersParams): Record<string, PillarAnswers> {
  // Initialise pillar groups
  const pillarMap = new Map<string, PillarAnswers>();
  for (const pillar of template.pillars) {
    pillarMap.set(pillar.id, {
      pillarId: pillar.id,
      pillarName: pillar.name,
      answers: [],
    });
  }

  // Pre-compute ordering so we can keep template order regardless of answer order
  const questionOrder = new Map<string, number>();
  template.questions.forEach((q, index) => {
    questionOrder.set(q.id, q.order ?? index);
  });

  // Walk questions in template order so we can maintain stable ordering
  for (const question of template.questions) {
    const rawValue = answers[question.id];
    if (rawValue === undefined) continue; // unanswered

    const pillarId = (question as Question).pillarId;
    if (!pillarId) continue; // skip questions that are not tied to a pillar

    // Ensure pillar group exists even if template didn't declare it (defensive)
    if (!pillarMap.has(pillarId)) {
      pillarMap.set(pillarId, {
        pillarId,
        pillarName: pillarId,
        answers: [],
      });
    }

    const pillar = pillarMap.get(pillarId)!;
    const displayAnswer = formatDisplayAnswer(question, rawValue);

    // Empty string means "treat as unanswered" (e.g. empty multi-select)
    if (displayAnswer === "") continue;

    pillar.answers.push({
      questionId: question.id,
      questionText: question.text,
      pillarId,
      pillarName: pillar.pillarName,
      displayAnswer,
    });
  }

  // Sort answers within each pillar by template order
  for (const pillar of pillarMap.values()) {
    pillar.answers.sort((a, b) => {
      const aOrder = questionOrder.get(a.questionId) ?? 0;
      const bOrder = questionOrder.get(b.questionId) ?? 0;
      return aOrder - bOrder;
    });
  }

  // Only return pillars that actually have answers
  const result: Record<string, PillarAnswers> = {};
  for (const [pillarId, pillar] of pillarMap.entries()) {
    if (pillar.answers.length > 0) {
      result[pillarId] = pillar;
    }
  }

  return result;
}

function formatDisplayAnswer(question: Question, rawValue: number | string | string[]): string {
  const { inputType, options } = question as any;

  // Radio (scored) and choice (A/B)
  if (inputType === "radio" || inputType === "choice") {
    if (typeof rawValue !== "number" && typeof rawValue !== "string") return "";

    if (!Array.isArray(options)) return String(rawValue);

    if (inputType === "radio") {
      const numeric = typeof rawValue === "number" ? rawValue : Number(rawValue);
      const match = (options as ScoredOption[]).find((opt) => opt.value === numeric);
      return match ? match.label : String(rawValue);
    }

    if (inputType === "choice") {
      const id = String(rawValue);
      const match = (options as ChoiceOption[]).find((opt) => opt.id === id);
      return match ? match.label : id;
    }
  }

  // Multi-select context questions
  if (inputType === "multi-select") {
    if (!Array.isArray(rawValue) || rawValue.length === 0) return "";
    if (!Array.isArray(options)) return rawValue.join(", ");

    const labels = (rawValue as string[])
      .map((id) => (options as UnscoredOption[]).find((opt) => opt.id === id)?.label)
      .filter((v): v is string => Boolean(v));

    return labels.length > 0 ? labels.join(", ") : rawValue.join(", ");
  }

  // Free text
  if (inputType === "text") {
    if (typeof rawValue !== "string") return String(rawValue ?? "");
    return rawValue.trim();
  }

  // Numeric inputs
  if (inputType === "number" || inputType === "range") {
    if (typeof rawValue === "number") return String(rawValue);
    if (typeof rawValue === "string" && rawValue.trim() !== "") return rawValue.trim();
    return "";
  }

  // Single select context
  if (inputType === "select") {
    if (!Array.isArray(options)) return String(rawValue ?? "");
    const id = String(rawValue);
    const match = (options as UnscoredOption[]).find((opt) => opt.id === id);
    return match ? match.label : id;
  }

  // Fallback: stringify
  if (Array.isArray(rawValue)) return rawValue.join(", ");
  return String(rawValue ?? "");
}
