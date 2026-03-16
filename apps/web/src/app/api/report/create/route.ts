import { NextRequest, NextResponse } from "next/server";
import { getReportStore } from "@/lib/report-store";
import type { CreateReportInput } from "@/lib/report-store/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: CreateReportInput;

  try {
    body = (await req.json()) as CreateReportInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.templateId || !body?.result || !body?.lead) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const store = getReportStore();
    const { token } = await store.createReport(body);
    const report = await store.getReport(token);
    return NextResponse.json({ token, report });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[REPORT CREATE] Failed:", err);
    return NextResponse.json({ error: "Failed to create report", message }, { status: 500 });
  }
}
