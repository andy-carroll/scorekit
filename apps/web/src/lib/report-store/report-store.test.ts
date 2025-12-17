import { describe, expect, it, beforeEach } from "vitest";
import { getReportStore } from "./index";

describe("ReportStore (local)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates a report and can load it back by token", async () => {
    const store = getReportStore();

    const { token } = await store.createReport({
      templateId: "ai-readiness",
      answers: { "lead-1": 3 },
      result: {
        total: 10,
        max: 20,
        percentage: 50,
        pillarScores: { leadership: 3 },
        band: "Emerging",
      },
      lead: {
        name: "Jane",
        email: "jane@example.com",
        company: "Acme",
      },
    });

    const report = await store.getReport(token);
    expect(report).not.toBeNull();
    expect(report?.token).toBe(token);
    expect(report?.lead.email).toBe("jane@example.com");
    expect(report?.templateId).toBe("ai-readiness");
  });

  it("returns null for unknown tokens", async () => {
    const store = getReportStore();
    await expect(store.getReport("does-not-exist")).resolves.toBeNull();
  });
});
