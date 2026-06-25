// Shared types for the per-template question sets.
import type { DiagnosticQuestion, ContextQuestion } from "@scorekit/core";

export type Question = DiagnosticQuestion | ContextQuestion;

/** A pillar-grouped flow section (one screen group of questions). */
export interface Section {
  id: string;
  name: string;
  description: string;
  type: "context" | "pillar";
  questionIds: string[];
}

/** The data shape each template's question module exports. */
export interface QuestionSet {
  sections: Section[];
  questions: Question[];
}

export interface ScoreResult {
  total: number;
  max: number;
  percentage: number;
  pillarScores: Record<string, number>;
  band: string;
}
