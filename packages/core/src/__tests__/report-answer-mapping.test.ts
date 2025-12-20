import { describe, it, expect } from "vitest";
import type { Template } from "../types";
import { mapAnswersToPillars } from "../report-answer-mapping";

describe("mapAnswersToPillars", () => {
  it("groups answers by pillar with human-readable labels", () => {
    // Arrange: minimal mock template with mixed input types
    const template: Template = {
      id: "test-template",
      version: "1.0.0",
      name: "Test",
      description: "Test template",
      estimatedMinutes: 5,
      pillars: [
        { id: "leadership", name: "Leadership & Vision", description: "", order: 1 },
        { id: "data", name: "Data & Infrastructure", description: "", order: 2 },
      ],
      questions: [
        {
          id: "q1",
          text: "How mature is your AI strategy?",
          pillarId: "leadership",
          inputType: "radio",
          options: [
            { value: 1, label: "No strategy" },
            { value: 3, label: "Draft in progress" },
            { value: 5, label: "Fully documented" },
          ],
        } as any,
        {
          id: "q2",
          text: "What are your biggest frustrations?",
          pillarId: "leadership",
          inputType: "multi-select",
          options: [
            { id: "slow", label: "Slow decisions" },
            { id: "silos", label: "Information silos" },
          ],
        } as any,
        {
          id: "q3",
          text: "Describe your data landscape",
          pillarId: "data",
          inputType: "text",
        } as any,
        {
          id: "q4",
          text: "How many core systems do you rely on?",
          pillarId: "data",
          inputType: "number",
        } as any,
      ],
      copy: {
        landing: {
          headline: "h",
          subheadline: "s",
          valueProps: [],
          timeEstimate: "",
          ctaText: "",
        },
        report: {
          title: "t",
          openingInsightTemplates: {},
          pillarDescriptions: {},
          roadmapIntro: "",
          businessCaseIntro: "",
          ctaHeadline: "",
          ctaText: "",
        },
      },
      recommendations: [],
    };

    const answers: Record<string, number | string | string[]> = {
      q1: 3,
      q2: ["slow", "silos"],
      q3: "We have multiple sources of truth",
      q4: 5,
    };

    // Act
    const result = mapAnswersToPillars({ template, answers });

    // Assert (structure + basic expectations)
    expect(Object.keys(result)).toEqual(["leadership", "data"]);

    const leadership = result.leadership;
    const data = result.data;

    expect(leadership.pillarId).toBe("leadership");
    expect(leadership.pillarName).toBe("Leadership & Vision");
    expect(leadership.answers.map((a) => a.questionId)).toEqual(["q1", "q2"]);
    expect(leadership.answers[0].displayAnswer).toBe("Draft in progress");
    expect(leadership.answers[1].displayAnswer).toBe("Slow decisions, Information silos");

    expect(data.pillarId).toBe("data");
    expect(data.answers.map((a) => a.questionId)).toEqual(["q3", "q4"]);
    expect(data.answers[0].displayAnswer).toBe("We have multiple sources of truth");
    expect(data.answers[1].displayAnswer).toBe("5");
  });

  it("omits questions without answers", () => {
    const template: Template = {
      id: "test-template",
      version: "1.0.0",
      name: "Test",
      description: "Test template",
      estimatedMinutes: 5,
      pillars: [{ id: "leadership", name: "Leadership & Vision", description: "", order: 1 }],
      questions: [
        { id: "q1", text: "One?", pillarId: "leadership", inputType: "radio" },
        { id: "q2", text: "Two?", pillarId: "leadership", inputType: "radio" },
      ],
      recommendations: [],
      copy: {
        landing: {
          headline: "h",
          subheadline: "s",
          valueProps: [],
          timeEstimate: "",
          ctaText: "",
        },
        report: {
          title: "t",
          openingInsightTemplates: {},
          pillarDescriptions: {},
          roadmapIntro: "",
          businessCaseIntro: "",
          ctaHeadline: "",
          ctaText: "",
        },
      },
      recommendations: [],
    };

    const answers: Record<string, number | string | string[]> = { q1: 1 };

    const result = mapAnswersToPillars({ template, answers });

    const leadership = result.leadership;
    expect(leadership.answers.map((a) => a.questionId)).toEqual(["q1"]);
  });

  it("ignores answers for unknown question IDs", () => {
    const template: Template = {
      id: "test-template",
      version: "1.0.0",
      name: "Test",
      description: "Test template",
      estimatedMinutes: 5,
      pillars: [{ id: "leadership", name: "Leadership & Vision" }],
      questions: [{ id: "q1", text: "Known", pillarId: "leadership", inputType: "radio" }],
      recommendations: [],
      copy: {
        landing: {
          headline: "h",
          subheadline: "s",
          valueProps: [],
          timeEstimate: "",
          ctaText: "",
        },
        report: {
          title: "t",
          openingInsightTemplates: {},
          pillarDescriptions: {},
          roadmapIntro: "",
          businessCaseIntro: "",
          ctaHeadline: "",
          ctaText: "",
        },
      },
      recommendations: [],
    };

    const answers: Record<string, number | string | string[]> = { q1: 1, q_unknown: 5 };

    const result = mapAnswersToPillars({ template, answers });

    const leadership = result.leadership;
    expect(leadership.answers.map((a) => a.questionId)).toEqual(["q1"]);
  });

  it("orders questions within a pillar as in the template", () => {
    const template: Template = {
      id: "test-template",
      version: "1.0.0",
      name: "Test",
      description: "Test template",
      estimatedMinutes: 5,
      pillars: [{ id: "leadership", name: "Leadership & Vision" }],
      questions: [
        { id: "q1", text: "First", pillarId: "leadership", inputType: "radio" },
        { id: "q2", text: "Second", pillarId: "leadership", inputType: "radio" },
        { id: "q3", text: "Third", pillarId: "leadership", inputType: "radio" },
      ],
      recommendations: [],
      copy: {
        landing: {
          headline: "h",
          subheadline: "s",
          valueProps: [],
          timeEstimate: "",
          ctaText: "",
        },
        report: {
          title: "t",
          openingInsightTemplates: {},
          pillarDescriptions: {},
          roadmapIntro: "",
          businessCaseIntro: "",
          ctaHeadline: "",
          ctaText: "",
        },
      },
      recommendations: [],
    };

    const answers: Record<string, number | string | string[]> = { q2: 1, q1: 1, q3: 1 };

    const result = mapAnswersToPillars({ template, answers });

    const leadership = result.leadership;
    expect(leadership.answers.map((a) => a.questionId)).toEqual(["q1", "q2", "q3"]);
  });
});
