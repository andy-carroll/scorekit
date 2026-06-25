// AI Capability assessment — pillar-grouped questions.
// 14 questions total: 2 context + 12 diagnostic (2 per dimension, 5 options each).
// Exposes only the data arrays (`sections`, `questions`); shared types live in
// ./types and the scoring/lookup helpers live in ./index.
import type { ScoredOption, UnscoredOption } from "@scorekit/core";
import type { Question, Section } from "./types";

// NOTE: populated in issue #13. Empty until then so the registry resolves.
export const sections: Section[] = [];

export const questions: Question[] = [];

// Silence unused-import warnings until the question set is authored (#13).
export type _OptionTypes = ScoredOption | UnscoredOption;
