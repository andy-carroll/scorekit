"use client";

import { useState } from "react";
import type {
  Question,
  DiagnosticQuestion,
  ContextQuestion,
  ScoredOption,
  ChoiceOption,
  UnscoredOption,
} from "@scorekit/core";

// =============================================================================
// Types
// =============================================================================

export interface AnswerValue {
  questionId: string;
  value: number | string | string[];
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: AnswerValue) => void;
  value?: number | string | string[];
  pillarName?: string;
}

// =============================================================================
// Type Guards
// =============================================================================

function isScoredOption(opt: ScoredOption | ChoiceOption | UnscoredOption): opt is ScoredOption {
  return 'value' in opt && typeof opt.value === 'number';
}

function isChoiceOption(opt: ScoredOption | ChoiceOption | UnscoredOption): opt is ChoiceOption {
  return 'id' in opt && 'insight' in opt;
}

// =============================================================================
// Input Components
// =============================================================================

function RadioInput({
  options,
  selectedValue,
  onSelect,
}: {
  options: ScoredOption[];
  selectedValue?: number;
  onSelect: (value: number) => void;
}) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-150 ${
            selectedValue === option.value
              ? "border-indigo-600 bg-indigo-50 text-indigo-900"
              : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50 text-gray-700"
          }`}
        >
          <span className="font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

function ChoiceInput({
  options,
  selectedValue,
  onSelect,
}: {
  options: ChoiceOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`text-left px-5 py-6 rounded-lg border-2 transition-all duration-150 ${
            selectedValue === option.id
              ? "border-indigo-600 bg-indigo-50 text-indigo-900"
              : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50 text-gray-700"
          }`}
        >
          <div className="text-xs font-bold text-gray-400 mb-2">
            Option {option.id.toUpperCase()}
          </div>
          <span className="font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

function SelectInput({
  options,
  selectedValue,
  onSelect,
}: {
  options: UnscoredOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <select
      value={selectedValue || ""}
      onChange={(e) => onSelect(e.target.value)}
      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-700 focus:border-indigo-600 focus:outline-none"
    >
      <option value="">Select an option...</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function MultiSelectInput({
  options,
  selectedValues,
  onSelect,
}: {
  options: UnscoredOption[];
  selectedValues: string[];
  onSelect: (values: string[]) => void;
}) {
  const toggleOption = (id: string) => {
    if (selectedValues.includes(id)) {
      onSelect(selectedValues.filter((v) => v !== id));
    } else {
      onSelect([...selectedValues, id]);
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.id}
          className={`flex items-center w-full px-5 py-4 rounded-lg border-2 cursor-pointer transition-all duration-150 ${
            selectedValues.includes(option.id)
              ? "border-indigo-600 bg-indigo-50 text-indigo-900"
              : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50 text-gray-700"
          }`}
        >
          <input
            type="checkbox"
            checked={selectedValues.includes(option.id)}
            onChange={() => toggleOption(option.id)}
            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-3 font-medium">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

function NumberInput({
  config,
  value,
  onChange,
}: {
  config?: ContextQuestion["numberConfig"];
  value?: number;
  onChange: (value: number) => void;
}) {
  const [localValue, setLocalValue] = useState(value?.toString() || "");

  const handleBlur = () => {
    const num = parseFloat(localValue);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {config?.unitPosition === "prefix" && config?.unit && (
        <span className="text-gray-500 font-medium">{config.unit}</span>
      )}
      <input
        type="number"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        min={config?.min}
        max={config?.max}
        step={config?.step}
        placeholder={config?.placeholder || "Enter a number"}
        className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-700 focus:border-indigo-600 focus:outline-none"
      />
      {config?.unitPosition === "suffix" && config?.unit && (
        <span className="text-gray-500 font-medium">{config.unit}</span>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      value={value || ""}
      onChange={handleChange}
      placeholder={placeholder || "Type your answer..."}
      rows={4}
      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-700 focus:border-indigo-600 focus:outline-none resize-none"
    />
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function QuestionCard({
  question,
  onAnswer,
  value,
  pillarName,
}: QuestionCardProps) {
  const handleAnswer = (answerValue: number | string | string[]) => {
    onAnswer({ questionId: question.id, value: answerValue });
  };

  const renderInput = () => {
    if (question.category === "diagnostic") {
      const dq = question as DiagnosticQuestion;
      
      if (dq.inputType === "radio" && dq.options.length > 0 && isScoredOption(dq.options[0])) {
        return (
          <RadioInput
            options={dq.options as ScoredOption[]}
            selectedValue={value as number | undefined}
            onSelect={handleAnswer}
          />
        );
      }
      
      if (dq.inputType === "choice" && dq.options.length > 0 && isChoiceOption(dq.options[0])) {
        return (
          <ChoiceInput
            options={dq.options as ChoiceOption[]}
            selectedValue={value as string | undefined}
            onSelect={handleAnswer}
          />
        );
      }
    }

    if (question.category === "context") {
      const cq = question as ContextQuestion;

      switch (cq.inputType) {
        case "select":
          return (
            <SelectInput
              options={cq.options || []}
              selectedValue={value as string | undefined}
              onSelect={handleAnswer}
            />
          );

        case "multi-select":
          return (
            <MultiSelectInput
              options={cq.options || []}
              selectedValues={(value as string[]) || []}
              onSelect={handleAnswer}
            />
          );

        case "number":
        case "range":
          return (
            <NumberInput
              config={cq.numberConfig}
              value={value as number | undefined}
              onChange={handleAnswer}
            />
          );

        case "text":
          return (
            <TextInput
              value={value as string | undefined}
              onChange={handleAnswer}
            />
          );

        case "radio":
          if (cq.options) {
            return (
              <SelectInput
                options={cq.options}
                selectedValue={value as string | undefined}
                onSelect={handleAnswer}
              />
            );
          }
          break;
      }
    }

    return <div className="text-red-500">Unknown input type</div>;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {pillarName && (
        <div className="mb-2 text-sm font-medium text-indigo-600 uppercase tracking-wide">
          {pillarName}
        </div>
      )}
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        {question.text}
      </h2>
      {question.helpText && (
        <p className="text-gray-500 mb-6">{question.helpText}</p>
      )}
      {!question.helpText && <div className="mb-6" />}
      {renderInput()}
    </div>
  );
}
