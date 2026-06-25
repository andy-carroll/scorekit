import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { aiCapabilityContent } from "@scorekit/core";
import {
  sections as capabilitySections,
  questions as capabilityQuestions,
} from "./ai-capability";
import type { ScoredOption } from "@scorekit/core";

const PILLAR_IDS = [
  "foundations",
  "practical-craft",
  "critical-evaluation",
  "workflow-integration",
  "responsible-use",
  "building-scaling",
];

describe("ai-capability question set", () => {
  const diagnostic = capabilityQuestions.filter((q) => q.category === "diagnostic");
  const context = capabilityQuestions.filter((q) => q.category === "context");

  it("has 12 diagnostic + 2 context questions", () => {
    expect(diagnostic).toHaveLength(12);
    expect(context).toHaveLength(2);
  });

  it("has exactly 2 diagnostic questions per dimension", () => {
    for (const pillarId of PILLAR_IDS) {
      const forPillar = diagnostic.filter(
        (q) => "pillarId" in q && q.pillarId === pillarId,
      );
      expect(forPillar, pillarId).toHaveLength(2);
    }
  });

  it("gives every diagnostic question 5 options with values 1–5", () => {
    for (const q of diagnostic) {
      const options = q.options as ScoredOption[];
      expect(options.map((o) => o.value), q.id).toEqual([1, 2, 3, 4, 5]);
    }
  });

  it("wires every pillar section to existing question ids", () => {
    const ids = new Set(capabilityQuestions.map((q) => q.id));
    for (const section of capabilitySections) {
      for (const qid of section.questionIds) {
        expect(ids.has(qid), `${section.id} → ${qid}`).toBe(true);
      }
    }
  });
});

describe("ai-capability content invariants", () => {
  it("declares 5 contiguous bands covering 0–100", () => {
    const bands = [...(aiCapabilityContent.bands ?? [])].sort(
      (a, b) => a.minScore - b.minScore,
    );
    expect(bands).toHaveLength(5);
    expect(bands[0].minScore).toBe(0);
    expect(bands[bands.length - 1].maxScore).toBe(100);
    for (let i = 1; i < bands.length; i++) {
      expect(bands[i].minScore, bands[i].id).toBe(bands[i - 1].maxScore);
    }
  });

  it("matches every band name to a bandIntros key", () => {
    for (const band of aiCapabilityContent.bands ?? []) {
      expect(aiCapabilityContent.bandIntros[band.name], band.name).toBeDefined();
    }
  });

  it("covers all 6 pillars in labels, insights, and recommendations", () => {
    for (const pillarId of PILLAR_IDS) {
      expect(aiCapabilityContent.pillarLabels[pillarId], pillarId).toBeDefined();
      const insight = aiCapabilityContent.pillarInsights[pillarId];
      expect(insight, pillarId).toBeDefined();
      expect(Object.keys(insight).sort()).toEqual(["high", "low", "medium"]);
      expect(aiCapabilityContent.recommendations[pillarId], pillarId).toBeDefined();
    }
  });

  it("requires a privacy policy URL", () => {
    expect(aiCapabilityContent.legal.privacyPolicyUrl).toMatch(/^https?:\/\//);
  });
});

describe("calculateScore band resolution by active template", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  async function loadActive(templateId: string) {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SCOREKIT_TEMPLATE_ID", templateId);
    return import("./index");
  }

  function answersOf(qs: { id: string; category: string }[], value: number) {
    return Object.fromEntries(
      qs.filter((q) => q.category === "diagnostic").map((q) => [q.id, value]),
    );
  }

  it("uses ai-capability's 5 custom bands", async () => {
    const { calculateScore, questions } = await loadActive("ai-capability");
    expect(calculateScore(answersOf(questions, 5)).band).toBe("Leading"); // 100%
    expect(calculateScore(answersOf(questions, 3)).band).toBe("Applying"); // 60%
    expect(calculateScore(answersOf(questions, 1)).band).toBe("Exploring"); // 20%
  });

  it("falls back to the default 4-band logic for ai-readiness", async () => {
    const { calculateScore, questions } = await loadActive("ai-readiness");
    expect(calculateScore(answersOf(questions, 5)).band).toBe("Leader"); // 100%
    expect(calculateScore(answersOf(questions, 1)).band).toBe("Starting"); // 20%
  });
});
