/**
 * Template Loader
 * 
 * Loads and validates assessment templates from JSON configuration.
 */

import type {
  Template,
  Question,
  Pillar,
  Recommendation,
  Pattern,
  Band,
  DiagnosticQuestion,
  ContextQuestion,
} from './types';
import { DEFAULT_BANDS, isDiagnosticQuestion } from './types';

// =============================================================================
// Validation Types
// =============================================================================

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// =============================================================================
// Template Validation
// =============================================================================

/**
 * Validate a template configuration
 */
export function validateTemplate(template: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!template || typeof template !== 'object') {
    errors.push({ path: '', message: 'Template must be an object' });
    return { valid: false, errors, warnings };
  }

  const t = template as Record<string, unknown>;

  // Required fields
  if (!t.id || typeof t.id !== 'string') {
    errors.push({ path: 'id', message: 'Template id is required and must be a string' });
  }
  if (!t.version || typeof t.version !== 'string') {
    errors.push({ path: 'version', message: 'Template version is required and must be a string' });
  }
  if (!t.name || typeof t.name !== 'string') {
    errors.push({ path: 'name', message: 'Template name is required and must be a string' });
  }
  if (!t.description || typeof t.description !== 'string') {
    errors.push({ path: 'description', message: 'Template description is required' });
  }
  if (typeof t.estimatedMinutes !== 'number' || t.estimatedMinutes <= 0) {
    errors.push({ path: 'estimatedMinutes', message: 'estimatedMinutes must be a positive number' });
  }

  // Pillars
  if (!Array.isArray(t.pillars) || t.pillars.length === 0) {
    errors.push({ path: 'pillars', message: 'Template must have at least one pillar' });
  } else {
    const pillarIds = new Set<string>();
    (t.pillars as Pillar[]).forEach((pillar, i) => {
      if (!pillar.id) {
        errors.push({ path: `pillars[${i}].id`, message: 'Pillar id is required' });
      } else if (pillarIds.has(pillar.id)) {
        errors.push({ path: `pillars[${i}].id`, message: `Duplicate pillar id: ${pillar.id}` });
      } else {
        pillarIds.add(pillar.id);
      }
      if (!pillar.name) {
        errors.push({ path: `pillars[${i}].name`, message: 'Pillar name is required' });
      }
    });
  }

  // Questions
  if (!Array.isArray(t.questions) || t.questions.length === 0) {
    errors.push({ path: 'questions', message: 'Template must have at least one question' });
  } else {
    const questionIds = new Set<string>();
    const pillarIds = new Set((t.pillars as Pillar[] || []).map(p => p.id));
    
    (t.questions as Question[]).forEach((q, i) => {
      if (!q.id) {
        errors.push({ path: `questions[${i}].id`, message: 'Question id is required' });
      } else if (questionIds.has(q.id)) {
        errors.push({ path: `questions[${i}].id`, message: `Duplicate question id: ${q.id}` });
      } else {
        questionIds.add(q.id);
      }
      
      if (!q.text) {
        errors.push({ path: `questions[${i}].text`, message: 'Question text is required' });
      }
      
      if (!q.category) {
        errors.push({ path: `questions[${i}].category`, message: 'Question category is required' });
      }
      
      // Diagnostic questions must have a pillarId
      if (q.category === 'diagnostic') {
        const dq = q as DiagnosticQuestion;
        if (!dq.pillarId) {
          errors.push({ path: `questions[${i}].pillarId`, message: 'Diagnostic questions must have a pillarId' });
        } else if (!pillarIds.has(dq.pillarId)) {
          errors.push({ path: `questions[${i}].pillarId`, message: `Unknown pillar: ${dq.pillarId}` });
        }
        
        if (!dq.options || !Array.isArray(dq.options) || dq.options.length === 0) {
          errors.push({ path: `questions[${i}].options`, message: 'Diagnostic questions must have options' });
        }
      }
    });

    // Check each pillar has at least one question
    if (pillarIds.size > 0) {
      const pillarsWithQuestions = new Set(
        (t.questions as Question[])
          .filter(q => q.category === 'diagnostic' && (q as DiagnosticQuestion).pillarId)
          .map(q => (q as DiagnosticQuestion).pillarId)
      );
      
      pillarIds.forEach(pillarId => {
        if (!pillarsWithQuestions.has(pillarId)) {
          warnings.push({ path: 'questions', message: `Pillar "${pillarId}" has no questions` });
        }
      });
    }
  }

  // Recommendations
  if (!Array.isArray(t.recommendations)) {
    errors.push({ path: 'recommendations', message: 'recommendations must be an array' });
  } else {
    const pillarIds = new Set((t.pillars as Pillar[] || []).map(p => p.id));
    
    (t.recommendations as Recommendation[]).forEach((rec, i) => {
      if (!rec.pillarId) {
        errors.push({ path: `recommendations[${i}].pillarId`, message: 'Recommendation pillarId is required' });
      } else if (!pillarIds.has(rec.pillarId)) {
        errors.push({ path: `recommendations[${i}].pillarId`, message: `Unknown pillar: ${rec.pillarId}` });
      }
      
      if (!rec.scoreRange || !Array.isArray(rec.scoreRange) || rec.scoreRange.length !== 2) {
        errors.push({ path: `recommendations[${i}].scoreRange`, message: 'scoreRange must be [min, max]' });
      }
      
      if (!rec.headline) {
        errors.push({ path: `recommendations[${i}].headline`, message: 'Recommendation headline is required' });
      }
    });
  }

  // Copy
  if (!t.copy || typeof t.copy !== 'object') {
    errors.push({ path: 'copy', message: 'Template copy is required' });
  } else {
    const copy = t.copy as Record<string, unknown>;
    if (!copy.landing || typeof copy.landing !== 'object') {
      errors.push({ path: 'copy.landing', message: 'Landing copy is required' });
    }
    if (!copy.report || typeof copy.report !== 'object') {
      errors.push({ path: 'copy.report', message: 'Report copy is required' });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// =============================================================================
// Template Loading
// =============================================================================

/**
 * Parse and validate a template from JSON
 */
export function parseTemplate(json: string): Template {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON');
  }

  const validation = validateTemplate(parsed);
  if (!validation.valid) {
    const errorMessages = validation.errors.map(e => `${e.path}: ${e.message}`).join('; ');
    throw new Error(`Invalid template: ${errorMessages}`);
  }

  // Apply defaults
  const template = parsed as Template;
  
  if (!template.bands) {
    template.bands = DEFAULT_BANDS;
  }

  return template;
}

/**
 * Get a template by ID (in-memory registry for now)
 */
const templateRegistry = new Map<string, Template>();

export function registerTemplate(template: Template): void {
  const validation = validateTemplate(template);
  if (!validation.valid) {
    const errorMessages = validation.errors.map(e => `${e.path}: ${e.message}`).join('; ');
    throw new Error(`Invalid template: ${errorMessages}`);
  }
  
  templateRegistry.set(template.id, template);
}

export function getTemplate(id: string): Template | undefined {
  return templateRegistry.get(id);
}

export function listTemplates(): Template[] {
  return Array.from(templateRegistry.values());
}

export function clearTemplates(): void {
  templateRegistry.clear();
}

// =============================================================================
// Template Helpers
// =============================================================================

/**
 * Get all diagnostic questions for a template
 */
export function getDiagnosticQuestions(template: Template): DiagnosticQuestion[] {
  return template.questions.filter(isDiagnosticQuestion);
}

/**
 * Get all context questions for a template
 */
export function getContextQuestions(template: Template): ContextQuestion[] {
  return template.questions.filter(q => q.category === 'context') as ContextQuestion[];
}

/**
 * Get questions for a specific pillar
 */
export function getQuestionsForPillar(template: Template, pillarId: string): DiagnosticQuestion[] {
  return getDiagnosticQuestions(template).filter(q => q.pillarId === pillarId);
}

/**
 * Get recommendations for a pillar at a given score
 */
export function getRecommendation(
  template: Template,
  pillarId: string,
  score: number
): Recommendation | undefined {
  return template.recommendations.find(
    r => r.pillarId === pillarId && score >= r.scoreRange[0] && score < r.scoreRange[1]
  );
}

/**
 * Get band for a given score
 */
export function getBandForScore(template: Template, score: number): Band {
  const bands = template.bands || DEFAULT_BANDS;
  
  // Find the band that contains this score
  const band = bands.find(b => score >= b.minScore && score < b.maxScore);
  
  // Handle edge case for 100% (top band's maxScore is typically 100)
  if (!band && score === 100) {
    return bands[bands.length - 1];
  }
  
  return band || bands[0];
}
