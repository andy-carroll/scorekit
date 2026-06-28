import { describe, it, expect } from "vitest";
import { aiReadinessContent, aiCapabilityContent } from "@scorekit/core";
import { PDF_LABEL_DEFAULTS } from "./route";

describe("PDF label defaults", () => {
  it("are template-agnostic — never leak a template-specific noun", () => {
    for (const value of Object.values(PDF_LABEL_DEFAULTS)) {
      expect(value.toLowerCase()).not.toContain("readiness");
      expect(value.toLowerCase()).not.toContain("capability");
    }
  });
});

describe("ai-readiness PDF wording is preserved explicitly (byte-for-byte invariant)", () => {
  const labels = aiReadinessContent.report?.pdfLabels;

  it("declares its own 'readiness' labels rather than relying on the defaults", () => {
    expect(labels?.overall).toBe("OVERALL READINESS");
    expect(labels?.pillarScores).toBe("Readiness by pillar");
    expect(labels?.scoredAppendixSubtitle).toBe(
      "Your answers to the scored questions — the inputs used to calculate your readiness scores.",
    );
  });
});

describe("ai-capability PDF wording", () => {
  it("uses capability nouns", () => {
    const labels = aiCapabilityContent.report?.pdfLabels;
    expect(labels?.overall).toBe("OVERALL CAPABILITY");
    expect(labels?.pillarScores).toBe("Capability by dimension");
    expect(labels?.scoredAppendixSubtitle).toContain("capability scores");
  });
});
