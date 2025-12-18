import { describe, expect, it } from "vitest";

import type { ReportRecord } from "@/lib/report-store/types";

import { POST } from "./route";

describe("POST /api/report/pdf", () => {
  it("returns a PDF", async () => {
    const token = "test-token";

    const report: ReportRecord = {
      token,
      createdAt: new Date("2025-01-01T00:00:00.000Z").toISOString(),
      templateId: "ai-readiness",
      answers: {},
      lead: {
        email: "jane@company.com",
        name: "Jane",
        company: "Company",
      },
      result: {
        total: 10,
        max: 20,
        percentage: 50,
        pillarScores: {
          leadership: 2.5,
          data: 3.0,
        },
        band: "Starting",
      },
    };

    const req = new Request("http://localhost/api/report/pdf", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, report }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");

    const bytes = new Uint8Array(await res.arrayBuffer());
    const header = String.fromCharCode(...bytes.slice(0, 4));
    expect(header).toBe("%PDF");
  });
});
