import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionCard } from './QuestionCard';
import type { DiagnosticQuestion, ContextQuestion } from '@scorekit/core';

// =============================================================================
// Test Fixtures
// =============================================================================

const maturityQuestion: DiagnosticQuestion = {
  id: 'q1',
  text: 'How mature is your AI strategy?',
  category: 'diagnostic',
  questionType: 'maturity',
  inputType: 'radio',
  pillarId: 'leadership',
  options: [
    { value: 1, label: 'No strategy exists' },
    { value: 2, label: 'Informal discussions only' },
    { value: 3, label: 'Draft strategy in progress' },
    { value: 4, label: 'Documented and communicated' },
    { value: 5, label: 'Fully integrated with business strategy' },
  ],
};

const frequencyQuestion: DiagnosticQuestion = {
  id: 'q2',
  text: 'How often do you review AI initiatives?',
  category: 'diagnostic',
  questionType: 'frequency',
  inputType: 'radio',
  pillarId: 'leadership',
  options: [
    { value: 1, label: 'Never' },
    { value: 2, label: 'Rarely' },
    { value: 3, label: 'Sometimes' },
    { value: 4, label: 'Often' },
    { value: 5, label: 'Always' },
  ],
};

const priorityQuestion: DiagnosticQuestion = {
  id: 'q3',
  text: 'Which is the bigger blocker?',
  category: 'diagnostic',
  questionType: 'priority',
  inputType: 'choice',
  pillarId: 'leadership',
  options: [
    { id: 'a', label: 'Lack of budget', insight: 'Financial constraints' },
    { id: 'b', label: 'Lack of skills', insight: 'Talent gap' },
  ],
};

const demographicsQuestion: ContextQuestion = {
  id: 'ctx1',
  text: 'How many employees does your company have?',
  category: 'context',
  questionType: 'demographics',
  inputType: 'number',
  numberConfig: {
    min: 1,
    max: 10000,
    placeholder: 'Enter number',
  },
};

const painQuestion: ContextQuestion = {
  id: 'ctx2',
  text: 'What are your biggest frustrations?',
  category: 'context',
  questionType: 'pain',
  inputType: 'multi-select',
  options: [
    { id: 'slow', label: 'Slow decision making' },
    { id: 'silos', label: 'Information silos' },
    { id: 'manual', label: 'Too much manual work' },
  ],
};

const aspirationQuestion: ContextQuestion = {
  id: 'ctx3',
  text: 'What does success look like for you?',
  category: 'context',
  questionType: 'aspiration',
  inputType: 'text',
};

const costQuestion: ContextQuestion = {
  id: 'ctx4',
  text: 'How many hours per week are lost to inefficiency?',
  category: 'context',
  questionType: 'cost',
  inputType: 'number',
  numberConfig: {
    min: 0,
    max: 100,
    unit: 'hours',
    unitPosition: 'suffix',
  },
};

const selectQuestion: ContextQuestion = {
  id: 'ctx5',
  text: 'What triggered your interest in AI?',
  category: 'context',
  questionType: 'trigger',
  inputType: 'select',
  options: [
    { id: 'competitor', label: 'Competitor pressure' },
    { id: 'cost', label: 'Cost reduction goals' },
    { id: 'growth', label: 'Growth opportunity' },
  ],
};

// =============================================================================
// Tests
// =============================================================================

describe('QuestionCard', () => {
  describe('radio input (diagnostic)', () => {
    it('renders question text and options', () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={maturityQuestion} onAnswer={onAnswer} />);
      
      expect(screen.getByText('How mature is your AI strategy?')).toBeInTheDocument();
      expect(screen.getByText('No strategy exists')).toBeInTheDocument();
      expect(screen.getByText('Fully integrated with business strategy')).toBeInTheDocument();
    });

    it('calls onAnswer with value when option selected', () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={maturityQuestion} onAnswer={onAnswer} />);
      
      fireEvent.click(screen.getByText('Draft strategy in progress'));
      expect(onAnswer).toHaveBeenCalledWith({ questionId: 'q1', value: 3 });
    });

    it('highlights selected option', () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={maturityQuestion} onAnswer={onAnswer} value={3} />);
      
      const selected = screen.getByText('Draft strategy in progress').closest('button');
      expect(selected).toHaveClass('border-indigo-600');
    });
  });

  describe('choice input (priority)', () => {
    it('renders A vs B choices', () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={priorityQuestion} onAnswer={onAnswer} />);
      
      expect(screen.getByText('Which is the bigger blocker?')).toBeInTheDocument();
      expect(screen.getByText('Lack of budget')).toBeInTheDocument();
      expect(screen.getByText('Lack of skills')).toBeInTheDocument();
    });

    it('calls onAnswer with choice id', () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={priorityQuestion} onAnswer={onAnswer} />);
      
      fireEvent.click(screen.getByText('Lack of skills'));
      expect(onAnswer).toHaveBeenCalledWith({ questionId: 'q3', value: 'b' });
    });
  });

  describe('number input (context)', () => {
    it('renders number input with placeholder', () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={demographicsQuestion} onAnswer={onAnswer} />);
      
      expect(screen.getByText('How many employees does your company have?')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter number')).toBeInTheDocument();
    });

    it('calls onAnswer on blur with numeric value', () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={demographicsQuestion} onAnswer={onAnswer} />);
      
      const input = screen.getByPlaceholderText('Enter number');
      fireEvent.change(input, { target: { value: '50' } });
      fireEvent.blur(input);
      
      expect(onAnswer).toHaveBeenCalledWith({ questionId: 'ctx1', value: 50 });
    });

    it('displays unit when configured', () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={costQuestion} onAnswer={onAnswer} />);
      
      expect(screen.getByText('hours')).toBeInTheDocument();
    });
  });

  describe('multi-select input (context)', () => {
    it('renders checkboxes for options', () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={painQuestion} onAnswer={onAnswer} />);
      
      expect(screen.getByText('What are your biggest frustrations?')).toBeInTheDocument();
      expect(screen.getByLabelText('Slow decision making')).toBeInTheDocument();
      expect(screen.getByLabelText('Information silos')).toBeInTheDocument();
    });

    it('calls onAnswer with array of selected ids', () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={painQuestion} onAnswer={onAnswer} value={['slow']} />);
      
      // Click adds 'manual' to existing 'slow' selection
      fireEvent.click(screen.getByLabelText('Too much manual work'));
      expect(onAnswer).toHaveBeenLastCalledWith({ questionId: 'ctx2', value: ['slow', 'manual'] });
    });
  });

  describe('text input (context)', () => {
    it('renders textarea', () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={aspirationQuestion} onAnswer={onAnswer} />);
      
      expect(screen.getByText('What does success look like for you?')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('calls onAnswer on blur with text value', () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={aspirationQuestion} onAnswer={onAnswer} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Faster decisions' } });
      fireEvent.blur(textarea);
      
      expect(onAnswer).toHaveBeenCalledWith({ questionId: 'ctx3', value: 'Faster decisions' });
    });
  });

  describe('select input (context)', () => {
    it('renders dropdown with options', () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={selectQuestion} onAnswer={onAnswer} />);
      
      expect(screen.getByText('What triggered your interest in AI?')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('calls onAnswer when option selected', () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={selectQuestion} onAnswer={onAnswer} />);
      
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'growth' } });
      expect(onAnswer).toHaveBeenCalledWith({ questionId: 'ctx5', value: 'growth' });
    });
  });

  describe('help text', () => {
    it('displays help text when provided', () => {
      const questionWithHelp: DiagnosticQuestion = {
        ...maturityQuestion,
        helpText: 'Consider your current planning documents',
      };
      const onAnswer = vi.fn();
      render(<QuestionCard question={questionWithHelp} onAnswer={onAnswer} />);
      
      expect(screen.getByText('Consider your current planning documents')).toBeInTheDocument();
    });
  });
});
