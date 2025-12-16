/**
 * ScoreKit Core Types
 * 
 * Defines the data model for assessment templates, questions, and responses.
 * See PRD: docs/01-product/PRD-ASSESSMENT-FRAMEWORK.md
 */

// =============================================================================
// Question Types
// =============================================================================

/**
 * Diagnostic question types (scored) - assess current state
 */
export type DiagnosticQuestionType =
  | 'maturity'    // 5 scenarios from lowest to highest maturity
  | 'frequency'   // Never → Rarely → Sometimes → Often → Always
  | 'capability'  // Not at all → Slightly → Somewhat → Fairly → Very
  | 'specificity' // Yes / No / Partial / Planned / Don't know
  | 'history'     // No / Yes, unsuccessfully / Yes, partially / Yes, working
  | 'priority';   // Choose A or B (both are valid blockers)

/**
 * Context question types (not scored) - capture pain, history, goals, value
 */
export type ContextQuestionType =
  | 'demographics' // Company profile (select / number input)
  | 'pain'         // Current frustrations (multi-select or text)
  | 'trigger'      // Why now? (select or text)
  | 'cost'         // Quantify the problem (number or range)
  | 'aspiration'   // Goals and outcomes (select or text)
  | 'value';       // Quantify the opportunity (number or range)

export type QuestionType = DiagnosticQuestionType | ContextQuestionType;

/**
 * Question category determines if the question contributes to scoring
 */
export type QuestionCategory = 'diagnostic' | 'context';

/**
 * Input type for rendering the question
 */
export type InputType =
  | 'radio'        // Single select (most diagnostic questions)
  | 'select'       // Dropdown (demographics, some context)
  | 'multi-select' // Multiple choice (pain points)
  | 'number'       // Numeric input (cost, value, team size)
  | 'range'        // Slider with min/max (cost estimates)
  | 'text'         // Free text (aspiration, pain in their words)
  | 'choice';      // A vs B priority questions

// =============================================================================
// Option Types
// =============================================================================

/**
 * Option for scored questions (diagnostic)
 */
export interface ScoredOption {
  value: number;  // Score value (1-5 typically)
  label: string;  // Display text
}

/**
 * Option for unscored questions (context)
 */
export interface UnscoredOption {
  id: string;     // Unique identifier
  label: string;  // Display text
}

/**
 * Option for priority/choice questions
 */
export interface ChoiceOption {
  id: 'a' | 'b';
  label: string;
  insight: string; // What selecting this reveals
}

/**
 * Configuration for number/range inputs
 */
export interface NumberInputConfig {
  min?: number;
  max?: number;
  step?: number;
  unit?: string;        // e.g., "hours", "£", "%"
  unitPosition?: 'prefix' | 'suffix';
  placeholder?: string;
}

// =============================================================================
// Question Interface
// =============================================================================

/**
 * Base question properties shared by all question types
 */
interface BaseQuestion {
  id: string;
  text: string;
  helpText?: string;          // Optional hint below question
  pillarId?: string;          // Which pillar this belongs to (null for context questions)
  required?: boolean;         // Default true
  order?: number;             // Display order within pillar/section
}

/**
 * Diagnostic question - scored, contributes to pillar and overall scores
 */
export interface DiagnosticQuestion extends BaseQuestion {
  category: 'diagnostic';
  questionType: DiagnosticQuestionType;
  inputType: 'radio' | 'choice';
  options: ScoredOption[] | ChoiceOption[];
  weight?: number;            // Weighting factor (default 1)
}

/**
 * Context question - not scored, but critical for report personalization
 */
export interface ContextQuestion extends BaseQuestion {
  category: 'context';
  questionType: ContextQuestionType;
  inputType: InputType;
  options?: UnscoredOption[]; // For select/multi-select
  numberConfig?: NumberInputConfig; // For number/range inputs
  reportKey?: string;         // Key used to reference this answer in report templates
}

/**
 * Union type for all questions
 */
export type Question = DiagnosticQuestion | ContextQuestion;

// =============================================================================
// Type Guards
// =============================================================================

export function isDiagnosticQuestion(q: Question): q is DiagnosticQuestion {
  return q.category === 'diagnostic';
}

export function isContextQuestion(q: Question): q is ContextQuestion {
  return q.category === 'context';
}

export function isScoredOption(opt: ScoredOption | UnscoredOption | ChoiceOption): opt is ScoredOption {
  return 'value' in opt && typeof opt.value === 'number';
}

// =============================================================================
// Answer Types
// =============================================================================

/**
 * Answer to a diagnostic question
 */
export interface DiagnosticAnswer {
  questionId: string;
  value: number;              // The score value selected
  selectedLabel?: string;     // The label text (for reference)
}

/**
 * Answer to a context question
 */
export interface ContextAnswer {
  questionId: string;
  value: string | number | string[]; // Varies by input type
  displayValue?: string;      // Formatted for display
}

export type Answer = DiagnosticAnswer | ContextAnswer;

/**
 * Complete response to an assessment
 */
export interface AssessmentResponse {
  templateId: string;
  templateVersion: string;
  completedAt: string;        // ISO timestamp
  diagnosticAnswers: Record<string, DiagnosticAnswer>;
  contextAnswers: Record<string, ContextAnswer>;
}

// =============================================================================
// Pillar Types
// =============================================================================

/**
 * A pillar is a major diagnostic dimension
 */
export interface Pillar {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;  // For compact displays
  icon?: string;              // Icon name or emoji
  order: number;              // Display order
  weight?: number;            // Weighting in overall score (default 1)
  subDimensions?: SubDimension[];
}

/**
 * Optional sub-dimension within a pillar for more granular breakdown
 */
export interface SubDimension {
  id: string;
  name: string;
  description?: string;
}

// =============================================================================
// Band Types
// =============================================================================

/**
 * Score band for overall and pillar scores
 */
export interface Band {
  id: string;
  name: string;               // e.g., "Starting", "Emerging", "Progressing", "Leading"
  minScore: number;           // Minimum percentage (inclusive)
  maxScore: number;           // Maximum percentage (exclusive, except for top band)
  color?: string;             // Display color
  description?: string;       // What this band means
}

/**
 * Default bands used across templates
 */
export const DEFAULT_BANDS: Band[] = [
  { id: 'starting', name: 'Starting', minScore: 0, maxScore: 40, color: '#ef4444' },
  { id: 'emerging', name: 'Emerging', minScore: 40, maxScore: 60, color: '#f59e0b' },
  { id: 'progressing', name: 'Progressing', minScore: 60, maxScore: 80, color: '#3b82f6' },
  { id: 'leading', name: 'Leading', minScore: 80, maxScore: 100, color: '#22c55e' },
];

