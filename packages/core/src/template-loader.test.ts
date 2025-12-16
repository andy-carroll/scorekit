import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateTemplate,
  parseTemplate,
  registerTemplate,
  getTemplate,
  listTemplates,
  clearTemplates,
  getDiagnosticQuestions,
  getContextQuestions,
  getQuestionsForPillar,
  getRecommendation,
  getBandForScore,
} from './template-loader';
import type { Template, DiagnosticQuestion, ContextQuestion } from './types';

// =============================================================================
// Test Fixtures
// =============================================================================

const createMinimalTemplate = (): Template => ({
  id: 'test-template',
  version: '1.0.0',
  name: 'Test Template',
  description: 'A test template',
  estimatedMinutes: 10,
  pillars: [
    { id: 'pillar-1', name: 'Pillar One', description: 'First pillar', order: 1 },
  ],
  questions: [
    {
      id: 'q1',
      text: 'Test question?',
      category: 'diagnostic',
      questionType: 'maturity',
      inputType: 'radio',
      pillarId: 'pillar-1',
      options: [
        { value: 1, label: 'Low' },
        { value: 2, label: 'Medium' },
        { value: 3, label: 'High' },
      ],
    } as DiagnosticQuestion,
  ],
  recommendations: [
    {
      pillarId: 'pillar-1',
      scoreRange: [0, 50],
      headline: 'Needs improvement',
      bodyTemplate: 'You scored {{score}}%',
      actions: ['Action 1', 'Action 2'],
    },
    {
      pillarId: 'pillar-1',
      scoreRange: [50, 100],
      headline: 'Doing well',
      bodyTemplate: 'You scored {{score}}%',
      actions: ['Keep it up'],
    },
  ],
  copy: {
    landing: {
      headline: 'Test Assessment',
      subheadline: 'Find out where you stand',
      valueProps: ['Quick', 'Actionable'],
      timeEstimate: '10 minutes',
      ctaText: 'Start',
    },
    report: {
      title: 'Your Report',
      openingInsightTemplates: { starting: 'You are starting' },
      pillarDescriptions: { 'pillar-1': 'About pillar one' },
      roadmapIntro: 'Here is your roadmap',
      businessCaseIntro: 'The business case',
      ctaHeadline: 'Next steps',
      ctaText: 'Book a call',
    },
  },
});

// =============================================================================
// validateTemplate Tests
// =============================================================================

describe('validateTemplate', () => {
  it('validates a correct template', () => {
    const template = createMinimalTemplate();
    const result = validateTemplate(template);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects non-object input', () => {
    const result = validateTemplate(null);
    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toContain('must be an object');
  });

  it('requires id field', () => {
    const template = createMinimalTemplate();
    delete (template as unknown as Record<string, unknown>).id;
    const result = validateTemplate(template);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.path === 'id')).toBe(true);
  });

  it('requires at least one pillar', () => {
    const template = createMinimalTemplate();
    template.pillars = [];
    const result = validateTemplate(template);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.path === 'pillars')).toBe(true);
  });

  it('detects duplicate pillar ids', () => {
    const template = createMinimalTemplate();
    template.pillars.push({ id: 'pillar-1', name: 'Duplicate', description: '', order: 2 });
    const result = validateTemplate(template);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes('Duplicate pillar'))).toBe(true);
  });

  it('requires diagnostic questions to have pillarId', () => {
    const template = createMinimalTemplate();
    delete (template.questions[0] as unknown as Record<string, unknown>).pillarId;
    const result = validateTemplate(template);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes('pillarId'))).toBe(true);
  });

  it('warns when a pillar has no questions', () => {
    const template = createMinimalTemplate();
    template.pillars.push({ id: 'pillar-2', name: 'Empty Pillar', description: '', order: 2 });
    const result = validateTemplate(template);
    expect(result.valid).toBe(true); // Still valid, just a warning
    expect(result.warnings.some(w => w.message.includes('pillar-2'))).toBe(true);
  });
});

// =============================================================================
// parseTemplate Tests
// =============================================================================

describe('parseTemplate', () => {
  it('parses valid JSON', () => {
    const template = createMinimalTemplate();
    const json = JSON.stringify(template);
    const parsed = parseTemplate(json);
    expect(parsed.id).toBe('test-template');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseTemplate('not json')).toThrow('Invalid JSON');
  });

  it('throws on invalid template', () => {
    expect(() => parseTemplate('{}')).toThrow('Invalid template');
  });

  it('applies default bands when not specified', () => {
    const template = createMinimalTemplate();
    delete template.bands;
    const json = JSON.stringify(template);
    const parsed = parseTemplate(json);
    expect(parsed.bands).toBeDefined();
    expect(parsed.bands!.length).toBe(4);
  });
});

// =============================================================================
// Template Registry Tests
// =============================================================================

describe('template registry', () => {
  beforeEach(() => {
    clearTemplates();
  });

  it('registers and retrieves a template', () => {
    const template = createMinimalTemplate();
    registerTemplate(template);
    const retrieved = getTemplate('test-template');
    expect(retrieved).toBeDefined();
    expect(retrieved!.name).toBe('Test Template');
  });

  it('returns undefined for unknown template', () => {
    const retrieved = getTemplate('unknown');
    expect(retrieved).toBeUndefined();
  });

  it('lists all registered templates', () => {
    const template1 = createMinimalTemplate();
    const template2 = { ...createMinimalTemplate(), id: 'template-2', name: 'Template 2' };
    registerTemplate(template1);
    registerTemplate(template2);
    const list = listTemplates();
    expect(list).toHaveLength(2);
  });

  it('throws when registering invalid template', () => {
    const invalid = { id: 'bad' } as Template;
    expect(() => registerTemplate(invalid)).toThrow();
  });
});

// =============================================================================
// Helper Function Tests
// =============================================================================

describe('getDiagnosticQuestions', () => {
  it('returns only diagnostic questions', () => {
    const template = createMinimalTemplate();
    template.questions.push({
      id: 'ctx1',
      text: 'Context question',
      category: 'context',
      questionType: 'demographics',
      inputType: 'select',
      options: [{ id: 'opt1', label: 'Option 1' }],
    } as ContextQuestion);

    const diagnostic = getDiagnosticQuestions(template);
    expect(diagnostic).toHaveLength(1);
    expect(diagnostic[0].id).toBe('q1');
  });
});

describe('getContextQuestions', () => {
  it('returns only context questions', () => {
    const template = createMinimalTemplate();
    template.questions.push({
      id: 'ctx1',
      text: 'Context question',
      category: 'context',
      questionType: 'demographics',
      inputType: 'select',
    } as ContextQuestion);

    const context = getContextQuestions(template);
    expect(context).toHaveLength(1);
    expect(context[0].id).toBe('ctx1');
  });
});

describe('getQuestionsForPillar', () => {
  it('returns questions for a specific pillar', () => {
    const template = createMinimalTemplate();
    template.pillars.push({ id: 'pillar-2', name: 'Pillar Two', description: '', order: 2 });
    template.questions.push({
      id: 'q2',
      text: 'Another question',
      category: 'diagnostic',
      questionType: 'frequency',
      inputType: 'radio',
      pillarId: 'pillar-2',
      options: [{ value: 1, label: 'Never' }, { value: 5, label: 'Always' }],
    } as DiagnosticQuestion);

    const pillar1Questions = getQuestionsForPillar(template, 'pillar-1');
    expect(pillar1Questions).toHaveLength(1);
    expect(pillar1Questions[0].id).toBe('q1');

    const pillar2Questions = getQuestionsForPillar(template, 'pillar-2');
    expect(pillar2Questions).toHaveLength(1);
    expect(pillar2Questions[0].id).toBe('q2');
  });
});

describe('getRecommendation', () => {
  it('returns recommendation for score in range', () => {
    const template = createMinimalTemplate();
    
    const lowRec = getRecommendation(template, 'pillar-1', 30);
    expect(lowRec).toBeDefined();
    expect(lowRec!.headline).toBe('Needs improvement');

    const highRec = getRecommendation(template, 'pillar-1', 75);
    expect(highRec).toBeDefined();
    expect(highRec!.headline).toBe('Doing well');
  });

  it('returns undefined for unknown pillar', () => {
    const template = createMinimalTemplate();
    const rec = getRecommendation(template, 'unknown', 50);
    expect(rec).toBeUndefined();
  });
});

describe('getBandForScore', () => {
  it('returns correct band for score', () => {
    const template = createMinimalTemplate();
    
    expect(getBandForScore(template, 20).id).toBe('starting');
    expect(getBandForScore(template, 45).id).toBe('emerging');
    expect(getBandForScore(template, 70).id).toBe('progressing');
    expect(getBandForScore(template, 90).id).toBe('leading');
  });

  it('handles edge case of 100%', () => {
    const template = createMinimalTemplate();
    const band = getBandForScore(template, 100);
    expect(band.id).toBe('leading');
  });
});
