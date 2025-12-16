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

// =============================================================================
// Recommendation Types
// =============================================================================

/**
 * Recommendation triggered by pillar score range
 */
export interface Recommendation {
  pillarId: string;
  scoreRange: [number, number];     // [min, max] percentage
  headline: string;                  // Bold headline
  bodyTemplate: string;              // Supports {{placeholders}}
  actions: string[];                 // Specific action items
  ifTriedBefore?: string;            // Additional copy if history indicates prior attempts
}

/**
 * Pattern detection rule for contradictions/insights
 */
export interface Pattern {
  id: string;
  name: string;
  description: string;               // What this pattern reveals
  conditions: PatternCondition[];    // All must be true
  insight: string;                   // Insight text for report
}

export interface PatternCondition {
  type: 'pillar_score' | 'answer_value' | 'answer_exists';
  pillarId?: string;
  questionId?: string;
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq' | 'in';
  value: number | string | string[];
}

// =============================================================================
// Copy Types (for landing page and report)
// =============================================================================

/**
 * Landing page copy for a template
 */
export interface LandingCopy {
  headline: string;
  subheadline: string;
  valueProps: string[];              // Bullet points
  timeEstimate: string;              // e.g., "15-20 minutes"
  trustSignals?: string[];           // e.g., "Used by 500+ companies"
  ctaText: string;                   // e.g., "Start Your Assessment"
}

/**
 * Report copy and templates
 */
export interface ReportCopy {
  title: string;                     // e.g., "Your AI Readiness Report"
  openingInsightTemplates: Record<string, string>; // By band id
  pillarDescriptions: Record<string, string>;      // By pillar id
  roadmapIntro: string;
  businessCaseIntro: string;
  ctaHeadline: string;
  ctaText: string;
  ctaUrl?: string;
}

// =============================================================================
// Template Type
// =============================================================================

/**
 * Complete assessment template definition
 */
export interface Template {
  id: string;                        // e.g., "ai-readiness-v1"
  version: string;                   // Semantic version, e.g., "1.0.0"
  name: string;                      // e.g., "AI Readiness Assessment"
  description: string;
  estimatedMinutes: number;

  // Structure
  pillars: Pillar[];
  questions: Question[];
  
  // Scoring configuration
  bands?: Band[];                    // Override DEFAULT_BANDS if needed
  pillarWeights?: Record<string, number>; // pillarId → weight (default 1)

  // Report content
  recommendations: Recommendation[];
  patterns?: Pattern[];              // Optional pattern detection rules

  // Copy
  copy: {
    landing: LandingCopy;
    report: ReportCopy;
  };

  // Metadata
  createdAt?: string;
  updatedAt?: string;
  author?: string;
}

// =============================================================================
// Scoring Result Types
// =============================================================================

/**
 * Score result for a single pillar
 */
export interface PillarScore {
  pillarId: string;
  score: number;                     // Percentage 0-100
  band: Band;
  rawScore: number;                  // Sum of answer values
  maxScore: number;                  // Maximum possible
  questionCount: number;
  subDimensions?: Record<string, number>; // subDimensionId → score
}

/**
 * Complete scoring result for an assessment
 */
export interface ScoringResult {
  overall: number;                   // Percentage 0-100
  overallBand: Band;
  pillars: Record<string, PillarScore>; // pillarId → score
  primaryConstraint: string;         // pillarId of lowest scoring pillar
  patterns?: Pattern[];              // Detected patterns
}

// =============================================================================
// Value Calculation Types
// =============================================================================

/**
 * Value calculation result
 */
export interface ValueCalculation {
  annualCost?: number;               // Cost of current state
  potentialValue?: number;           // Value of transformation
  roi?: number;                      // Return on investment multiplier
  inputs: {
    hoursLostWeekly?: number;
    teamSize?: number;
    hourlyRate?: number;
    revenueBand?: number;
  };
}

// =============================================================================
// Report Data Types
// =============================================================================

/**
 * Complete report data structure
 */
export interface ReportData {
  // Header
  templateName: string;
  respondentName?: string;
  companyName?: string;
  generatedAt: string;

  // Opening
  openingInsight: string;

  // Context (their words)
  yourContext: {
    companyProfile: string;
    trigger?: string;
    goals?: string;
  };
  whatYouToldUs: string[];           // Pain points quoted back

  // Diagnosis
  costOfCurrentState?: {
    narrative: string;
    annualCost?: number;
  };
  
  scoring: ScoringResult;
  pillarNarratives: Record<string, string>; // pillarId → narrative
  patternsNoticed?: string[];
  whatYouveTried?: string;
  biggestConstraint: {
    pillarId: string;
    pillarName: string;
    narrative: string;
    recommendation: Recommendation;
  };

  // Value
  transformationValue?: {
    narrative: string;
    potentialValue?: number;
  };

  // Actions
  singlePriority: string;
  roadmap: {
    day30: string[];
    day60: string[];
    day90: string[];
  };

  // Business case
  businessCase?: {
    costOfInaction: string;
    valueOfTransformation: string;
    investmentCase: string;
  };

  // CTA
  nextSteps: {
    headline: string;
    ctaText: string;
    ctaUrl?: string;
  };
}

