import { describe, it, expect } from "vitest";
import { aiCapabilityContent } from "@scorekit/core";
import { bandForPercentage } from "./index";

describe("bandForPercentage — custom bands (ai-capability)", () => {
  const bands = aiCapabilityContent.bands;

  // Locks the contract: minScore inclusive, maxScore exclusive, top band
  // inclusive at 100. Boundary values are the ones most likely to regress.
  const cases: Array<[number, string]> = [
    [0, "Getting Started"],
    [19, "Getting Started"],
    [20, "Exploring"], // lower bound inclusive
    [39, "Exploring"],
    [40, "Applying"],
    [64, "Applying"],
    [65, "Integrating"], // boundary moves up at minScore
    [84, "Integrating"],
    [85, "Leading"],
    [100, "Leading"], // top band inclusive at 100
  ];

  it.each(cases)("%i%% → %s", (pct, expected) => {
    expect(bandForPercentage(pct, bands)).toBe(expected);
  });
});

describe("bandForPercentage — fallback 4-band logic (no custom bands)", () => {
  const cases: Array<[number, string]> = [
    [0, "Starting"],
    [39, "Starting"],
    [40, "Emerging"],
    [59, "Emerging"],
    [60, "Progressing"],
    [79, "Progressing"],
    [80, "Leader"],
    [100, "Leader"],
  ];

  it.each(cases)("%i%% → %s (undefined bands)", (pct, expected) => {
    expect(bandForPercentage(pct, undefined)).toBe(expected);
    expect(bandForPercentage(pct, [])).toBe(expected); // empty bands also falls back
  });
});
